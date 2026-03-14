from fastapi import APIRouter
from pydantic import BaseModel
from app.ai_modules.code_evaluator import CodeEvaluator

router = APIRouter()

evaluator = CodeEvaluator()


class CodeSubmission(BaseModel):
    language: str
    question: str
    code: str


@router.post("/evaluate")
def evaluate_code(payload: CodeSubmission):

    result = evaluator.evaluate(
        payload.language,
        payload.question,
        payload.code
    )

    return result