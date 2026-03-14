import os
import shutil
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from app.ai_modules.resume_parser import ResumeParser
from app.database import repository

router = APIRouter()
parser = ResumeParser(provider="static")

# Temporary upload path
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "tmp")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_resume(user_id: int = Form(...), file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    try:
        # Save file temporarily
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Parse PDF
        extracted_text = parser.parse_pdf(file_path)
        if not extracted_text:
            raise HTTPException(status_code=400, detail="Could not extract text from the PDF.")
            
        # Extract Information
        parsed_data = parser.extract_information(extracted_text)
        
        # Save to database
        # Note: 'file_url' would normally be a cloud link (like S3/Cloudinary). Using filename for now.
        resume = repository.create_resume(
            user_id=user_id,
            file_url=file.filename,
            parsed_skills=parsed_data.get("skills", []),
            parsed_experience=parsed_data.get("experience", []),
            parsed_projects=parsed_data.get("projects", [])
        )
        
        if not resume:
            raise HTTPException(status_code=500, detail="Failed to save resume strictly to DB.")
            
        return {
            "message": "Resume uploaded and parsed successfully",
            "resume": resume,
            "parsed_data": parsed_data
        }
        
    finally:
        # Guarantee cleanup of temporary file
        if os.path.exists(file_path):
            os.remove(file_path)
