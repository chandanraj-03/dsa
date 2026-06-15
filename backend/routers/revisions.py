from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from database import get_database
from auth_utils import get_current_user_email
from datetime import datetime, timezone
from utils import to_object_id

router = APIRouter()


class MarkReviewedRequest(BaseModel):
    task_id: str
    quality: int  # 0 to 5


@router.get("/upcoming")
async def get_upcoming_revisions(email: str = Depends(get_current_user_email)):
    db = get_database()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user_id = str(user["_id"])

    now = datetime.now(timezone.utc).replace(tzinfo=None)
    cursor = db.progress.find({"user_id": user_id, "completed": True})
    progress_records = await cursor.to_list(length=1000)

    upcoming_revisions = []

    for p in progress_records:
        rev_date = p.get("next_revision_date")
        if rev_date and (rev_date <= now or (rev_date - now).days == 0):
            # Fetch task details
            obj_id = to_object_id(p["task_id"])
            task = await db.tasks.find_one({"_id": obj_id})
            if not task:
                task = await db.tasks.find_one({"_id": p["task_id"]})
                
            if task:
                upcoming_revisions.append({
                    "task_id": p["task_id"],
                    "topic": task.get("topic"),
                    "title": task.get("title"),
                    "due_date": rev_date
                })

    # Sort by due date
    upcoming_revisions.sort(key=lambda x: x["due_date"])
    return upcoming_revisions


@router.post("/mark-reviewed")
async def mark_revision_reviewed(req: MarkReviewedRequest, email: str = Depends(get_current_user_email)):
    """Update SRS parameters for the task."""
    db = get_database()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_id = str(user["_id"])
    obj_id = to_object_id(req.task_id)
    
    # Find the progress record
    progress = await db.progress.find_one({"user_id": user_id, "task_id": str(obj_id)})
    if not progress:
        raise HTTPException(status_code=404, detail="Progress record not found")
    
    quality = req.quality
    interval = progress.get("srs_interval", 1)
    ease = progress.get("srs_ease", 2.5)
    repetitions = progress.get("srs_repetitions", 0)

    # SM-2 Algorithm
    if quality >= 3:
        if repetitions == 0:
            interval = 1
        elif repetitions == 1:
            interval = 6
        else:
            interval = round(interval * ease)
        repetitions += 1
    else:
        repetitions = 0
        interval = 1
    
    ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    if ease < 1.3:
        ease = 1.3
        
    from datetime import timedelta
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    next_date = now + timedelta(days=interval)
    
    await db.progress.update_one(
        {"_id": progress["_id"]},
        {
            "$set": {
                "srs_interval": interval,
                "srs_ease": ease,
                "srs_repetitions": repetitions,
                "next_revision_date": next_date
            }
        }
    )
    
    return {"message": "Revision marked as reviewed"}
