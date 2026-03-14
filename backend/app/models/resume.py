from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ResumeResponse(BaseModel):
    id: int
    user_id: int
    file_url: str
    parsed_skills: Optional[List[str]] = []
    parsed_experience: Optional[List[str]] = []
    parsed_projects: Optional[List[str]] = []
    created_at: datetime
    
    class Config:
        from_attributes = True
