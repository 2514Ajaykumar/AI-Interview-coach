from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.interview_engine import InterviewOrchestrator
from app.database import repository

router = APIRouter()
orchestrator = InterviewOrchestrator()


# -------- REQUEST MODELS -------- #

class StartInterviewRequest(BaseModel):
    user_id: int
    role_title: str
    experience_level: Optional[str] = "Beginner"

    # NEW FEATURES
    difficulty: Optional[str] = "Beginner"
    question_limit: Optional[int] = 10


class SubmitAnswerRequest(BaseModel):
    interview_id: int
    question_id: int
    answer_text: str


class NextQuestionRequest(BaseModel):
    interview_id: int
    question: str
    answer: str


# -------- START INTERVIEW -------- #

@router.post("/start")
async def start_interview(payload: StartInterviewRequest):
    try:
        result = orchestrator.start_interview_session(
            user_id=payload.user_id,
            role_title=payload.role_title,
            difficulty=payload.difficulty,
            question_limit=payload.question_limit
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------- NEXT QUESTION -------- #

@router.post("/next_question")
async def next_question(payload: NextQuestionRequest):
    try:
        result = orchestrator.next_question(
            interview_id=payload.interview_id,
            previous_question=payload.question,
            answer=payload.answer
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------- SUBMIT ANSWER -------- #

@router.post("/submit_answer")
async def submit_answer(payload: SubmitAnswerRequest):
    try:
        evaluation = orchestrator.evaluate_answer(
            interview_id=payload.interview_id,
            question_id=payload.question_id,
            answer_text=payload.answer_text
        )
        return evaluation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------- HISTORY -------- #

@router.get("/history/{user_id}")
async def get_history(user_id: int):
    try:
        return repository.get_interview_history(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------- COMPLETE INTERVIEW -------- #

@router.post("/{interview_id}/complete")
async def complete_interview(interview_id: int):
    try:
        return orchestrator.complete_session(interview_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------- INTERVIEW REPORT -------- #

@router.get("/{interview_id}/report")
async def get_report(interview_id: int):
    try:
        report = repository.get_interview_report(interview_id)

        if not report or not report.get("interview"):
            raise HTTPException(status_code=404, detail="Interview not found")

        return report

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))