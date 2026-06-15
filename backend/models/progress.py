from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional

class ProgressBase(BaseModel):
    user_id: str
    task_id: str
    completed: bool = False
    completed_at: Optional[datetime] = None
    revision_dates: List[datetime] = []
    notes: Optional[str] = ""

class ProgressInDB(ProgressBase):
    id: str = Field(alias="_id")

class ProgressOut(ProgressBase):
    id: str
