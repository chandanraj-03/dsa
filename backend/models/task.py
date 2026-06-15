from pydantic import BaseModel, Field
from typing import Optional

class TaskBase(BaseModel):
    day: int
    topic: str
    title: str
    description: str
    difficulty: str  # Easy, Medium, Hard
    leetcode_link: Optional[str] = None
    leetcode_number: Optional[int] = None
    type: str = "learning" # learning, practice, revision

class TaskInDB(TaskBase):
    id: str = Field(alias="_id")

class TaskOut(TaskBase):
    id: str
