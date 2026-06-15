from fastapi import APIRouter, Depends, HTTPException
from typing import List
from database import get_database
from models.task import TaskOut
from auth_utils import get_current_user_email
from datetime import datetime

router = APIRouter()

@router.get("/all", response_model=List[TaskOut])
async def get_all_tasks(email: str = Depends(get_current_user_email)):
    db = get_database()
    cursor = db.tasks.find({}).sort("day", 1)
    tasks = await cursor.to_list(length=1000)
    return [TaskOut(id=str(task["_id"]), **task) for task in tasks]

@router.get("/day/{day_number}", response_model=List[TaskOut])
async def get_tasks_by_day(day_number: int, email: str = Depends(get_current_user_email)):
    db = get_database()
    cursor = db.tasks.find({"day": day_number})
    tasks = await cursor.to_list(length=100)
    return [TaskOut(id=str(task["_id"]), **task) for task in tasks]
