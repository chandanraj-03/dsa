from fastapi import APIRouter, Depends, HTTPException
from database import get_database
from auth_utils import get_current_user_email
from routers.progress import get_progress_stats
from routers.revisions import get_upcoming_revisions
from utils import to_object_id
from datetime import timezone

router = APIRouter()

@router.get("/overview")
async def get_dashboard_overview(email: str = Depends(get_current_user_email)):
    db = get_database()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    stats = await get_progress_stats(email)
    revisions = await get_upcoming_revisions(email)
    
    # Calculate current day based on completed tasks
    user_id = str(user["_id"])
    cursor = db.progress.find({"user_id": user_id, "completed": True})
    completed_progress = await cursor.to_list(length=1000)
    
    completed_task_ids = [p["task_id"] for p in completed_progress]
    
    obj_ids = [to_object_id(tid) for tid in completed_task_ids]
            
    completed_tasks = await db.tasks.find({"_id": {"$in": obj_ids}}).to_list(length=1000)
    all_tasks = await db.tasks.find({}, {"day": 1}).to_list(length=1000)
    
    day_counts = {}
    for t in all_tasks:
        d = t.get("day", 1)
        day_counts[d] = day_counts.get(d, 0) + 1
        
    completed_day_counts = {}
    for t in completed_tasks:
        d = t.get("day", 1)
        completed_day_counts[d] = completed_day_counts.get(d, 0) + 1
        
    max_day = 1
    for d in sorted(day_counts.keys()):
        if completed_day_counts.get(d, 0) < day_counts[d]:
            max_day = d
            break
    else:
        if day_counts:
            max_day = max(day_counts.keys())
            if max_day < 60:
                max_day += 1

    # Build set of completed task ID strings for frontend
    completed_ids_set = set(str(tid) for tid in completed_task_ids)
    
    # Build map of task ID to completed_at date
    completed_task_dates = {}
    for p in completed_progress:
        if "completed_at" in p and p["completed_at"]:
            completed_task_dates[p["task_id"]] = p["completed_at"].replace(tzinfo=timezone.utc).isoformat()

    return {
        "user_name": user["name"],
        "streak": user.get("streak", 0),
        "progress_percentage": stats["percentage"],
        "completed_tasks": stats["completed_tasks"],
        "total_tasks": stats["total_tasks"],
        "current_day": max_day,
        "upcoming_revisions_count": len(revisions),
        "upcoming_revisions": revisions[:5],  # Return top 5
        "completed_task_ids": list(completed_ids_set),  # New: for frontend completion indicators
        "completed_task_dates": completed_task_dates
    }
