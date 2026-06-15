from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from datetime import timedelta, datetime, timezone
from database import get_database
from models.user import UserCreate, UserOut, Token, UserInDB
from auth_utils import get_password_hash, verify_password, create_access_token, get_current_user_email
from config import settings

router = APIRouter()

MIN_PASSWORD_LENGTH = 6

@router.post("/register", response_model=UserOut)
async def register_user(user: UserCreate):
    db = get_database()
    
    # Validate password strength
    if len(user.password) < MIN_PASSWORD_LENGTH:
        raise HTTPException(
            status_code=400, 
            detail=f"Password must be at least {MIN_PASSWORD_LENGTH} characters long"
        )
    
    if await db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = UserInDB(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        created_at=datetime.now(timezone.utc),
        streak=0
    )
    
    result = await db.users.insert_one(new_user.dict(by_alias=True))
    created_user = await db.users.find_one({"_id": result.inserted_id})
    return UserOut(
        id=str(created_user["_id"]),
        name=created_user["name"],
        email=created_user["email"],
        streak=created_user["streak"],
        created_at=created_user["created_at"],
        last_active=created_user.get("last_active")
    )

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    db = get_database()
    user = await db.users.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last_login
    await db.users.update_one({"_id": user["_id"]}, {"$set": {"last_login": datetime.now(timezone.utc)}})
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
async def read_users_me(email: str = Depends(get_current_user_email)):
    db = get_database()
    user = await db.users.find_one({"email": email})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
        streak=user["streak"],
        created_at=user["created_at"],
        last_active=user.get("last_active")
    )

@router.delete("/account")
async def delete_account(email: str = Depends(get_current_user_email)):
    db = get_database()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user_id = str(user["_id"])
    
    # Delete user's progress
    await db.progress.delete_many({"user_id": user_id})
    
    # Delete user account
    result = await db.users.delete_one({"_id": user["_id"]})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=500, detail="Failed to delete account")
        
    return {"message": "Account and all associated data deleted successfully"}
