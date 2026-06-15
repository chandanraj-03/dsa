from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from database import get_database
from auth_utils import get_current_user_email
from datetime import datetime, timezone
from typing import List
from utils import to_object_id

router = APIRouter()

class CompleteTaskRequest(BaseModel):
    task_id: str

@router.post("/complete")
async def complete_task(req: CompleteTaskRequest, email: str = Depends(get_current_user_email)):
    db = get_database()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_id = str(user["_id"])
    obj_id = to_object_id(req.task_id)

    existing_progress = await db.progress.find_one({"user_id": user_id, "task_id": str(obj_id)})
    if existing_progress and existing_progress.get("completed"):
        return {"message": "Task already completed"}

    # Initialize SM-2 SRS fields
    now = datetime.now(timezone.utc)
    from datetime import timedelta
    next_revision = now + timedelta(days=1)

    await db.progress.update_one(
        {"user_id": user_id, "task_id": str(obj_id)},
        {
            "$set": {
                "completed": True,
                "completed_at": now,
                "next_revision_date": next_revision,
                "srs_interval": 1,
                "srs_ease": 2.5,
                "srs_repetitions": 0
            }
        },
        upsert=True
    )

    # Update Streak logic
    last_task_date = user.get("last_task_date")
    current_streak = user.get("streak", 0)
    
    if last_task_date:
        delta = (now.date() - last_task_date.date()).days
        if delta == 1:
            current_streak += 1
        elif delta > 1:
            current_streak = 1  # Reset streak
        # If delta == 0, already active today, streak remains same
    else:
        current_streak = 1

    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"streak": current_streak, "last_task_date": now}}
    )

    return {"message": "Task completed successfully", "streak": current_streak}


@router.post("/uncomplete")
async def uncomplete_task(req: CompleteTaskRequest, email: str = Depends(get_current_user_email)):
    """Undo a task completion — removes the progress record."""
    db = get_database()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_id = str(user["_id"])
    obj_id = to_object_id(req.task_id)
    
    result = await db.progress.update_one(
        {"user_id": user_id, "task_id": str(obj_id)},
        {
            "$set": {
                "completed": False,
                "completed_at": None,
                "next_revision_date": None,
                "srs_interval": 0,
                "srs_ease": 2.5,
                "srs_repetitions": 0
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Progress record not found")
    
    return {"message": "Task uncompleted successfully"}


@router.get("/stats")
async def get_progress_stats(email: str = Depends(get_current_user_email)):
    db = get_database()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user_id = str(user["_id"])

    total_tasks = await db.tasks.count_documents({})
    completed_tasks = await db.progress.count_documents({"user_id": user_id, "completed": True})

    percentage = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0

    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "percentage": round(percentage, 2)
    }


@router.get("/activity")
async def get_activity_data(email: str = Depends(get_current_user_email)):
    """Return completion dates for activity heatmap."""
    db = get_database()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user_id = str(user["_id"])
    
    cursor = db.progress.find(
        {"user_id": user_id, "completed": True, "completed_at": {"$ne": None}},
        {"completed_at": 1, "_id": 0}
    )
    records = await cursor.to_list(length=5000)
    
    # Group by date and count completions per day
    activity = {}
    for r in records:
        date_str = r["completed_at"].strftime("%Y-%m-%d")
        activity[date_str] = activity.get(date_str, 0) + 1
    
    return {"activity": activity}


@router.get("/by-topic")
async def get_progress_by_topic(email: str = Depends(get_current_user_email)):
    """Return progress breakdown by topic."""
    db = get_database()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user_id = str(user["_id"])
    
    # Get all tasks grouped by topic
    all_tasks = await db.tasks.find({}).to_list(length=5000)
    completed_progress = await db.progress.find(
        {"user_id": user_id, "completed": True}
    ).to_list(length=5000)
    
    completed_task_ids = {p["task_id"] for p in completed_progress}
    
    # Build topic breakdown
    topics = {}
    for task in all_tasks:
        topic = task.get("topic", "Unknown")
        if topic not in topics:
            topics[topic] = {"total": 0, "completed": 0}
        topics[topic]["total"] += 1
        if str(task["_id"]) in completed_task_ids:
            topics[topic]["completed"] += 1
    
    result = []
    for topic_name, counts in topics.items():
        result.append({
            "topic": topic_name,
            "total": counts["total"],
            "completed": counts["completed"],
            "percentage": round((counts["completed"] / counts["total"] * 100) if counts["total"] > 0 else 0, 1)
        })
    
    # Sort by topic name
    result.sort(key=lambda x: x["topic"])
    return {"topics": result}


class NotesUpdateRequest(BaseModel):
    notes: str

@router.get("/notes/{task_id}")
async def get_task_notes(task_id: str, email: str = Depends(get_current_user_email)):
    db = get_database()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_id = str(user["_id"])
    obj_id = to_object_id(task_id)

    progress = await db.progress.find_one({"user_id": user_id, "task_id": str(obj_id)})
    if progress:
        return {"notes": progress.get("notes", "")}
    
    return {"notes": ""}

@router.put("/notes/{task_id}")
async def update_task_notes(task_id: str, req: NotesUpdateRequest, email: str = Depends(get_current_user_email)):
    db = get_database()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_id = str(user["_id"])
    obj_id = to_object_id(task_id)

    # Upsert the progress document with notes
    await db.progress.update_one(
        {"user_id": user_id, "task_id": str(obj_id)},
        {"$set": {"notes": req.notes}},
        upsert=True
    )
    
    return {"message": "Notes updated successfully"}

@router.get("/mastery-stats")
async def get_mastery_stats(email: str = Depends(get_current_user_email)):
    db = get_database()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user_id = str(user["_id"])
    
    # Get all tasks grouped by topic
    all_tasks = await db.tasks.find({}).to_list(length=5000)
    completed_progress = await db.progress.find(
        {"user_id": user_id, "completed": True}
    ).to_list(length=5000)
    
    # map task_id to srs_ease
    ease_map = {p["task_id"]: p.get("srs_ease", 2.5) for p in completed_progress}
    
    topics = {}
    for task in all_tasks:
        topic = task.get("topic", "Unknown")
        if topic not in topics:
            topics[topic] = {"ease_sum": 0, "count": 0}
        
        tid = str(task["_id"])
        if tid in ease_map:
            topics[topic]["ease_sum"] += ease_map[tid]
            topics[topic]["count"] += 1
            
    result = []
    for topic_name, data in topics.items():
        if data["count"] > 0:
            avg_ease = data["ease_sum"] / data["count"]
            # Normalize ease 1.3 - 3.0+ to a 0-100 scale roughly
            score = (avg_ease - 1.3) / 1.7 * 100
            score = max(0, min(100, score))
            result.append({
                "subject": topic_name,
                "A": round(score),
                "fullMark": 100
            })
    
    # If no data, return all topics with 0 score
    if not result:
        all_topics = set(t.get("topic", "Unknown") for t in all_tasks)
        if not all_topics:
            return {"mastery": []}
            
        return {"mastery": [{"subject": t, "A": 0, "fullMark": 100} for t in all_topics]}
        
    return {"mastery": result}
