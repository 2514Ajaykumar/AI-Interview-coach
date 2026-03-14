from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InterviewBase(BaseModel):
    user_id: int
    job_role_id: Optional[int]

class InterviewResponse(InterviewBase):
    id: int
    status: str
    scheduled_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True

class QuestionResponse(BaseModel):
    id: int
    job_role_id: int
    content: str
    difficulty: str
    
    class Config:
        from_attributes = True
