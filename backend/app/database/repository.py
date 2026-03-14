import json
from typing import List, Optional
from datetime import datetime
from .connection import get_db_connection
from app.models.user import UserCreate, UserResponse
from app.models.resume import ResumeResponse
from app.models.interview import InterviewResponse, QuestionResponse

def create_user(user: UserCreate) -> Optional[UserResponse]:
    conn = get_db_connection()
    if not conn: return None
    try:
        cursor = conn.cursor(dictionary=True)
        query = "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)"
        cursor.execute(query, (user.name, user.email, user.password))
        conn.commit()
        user_id = cursor.lastrowid
        
        cursor.execute("SELECT id, name, email, created_at FROM users WHERE id = %s", (user_id,))
        new_user = cursor.fetchone()
        return UserResponse(**new_user) if new_user else None
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def get_user_by_email(email: str) -> Optional[dict]:
    # Returns a dict with password_hash for authentication purposes
    conn = get_db_connection()
    if not conn: return None
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        return cursor.fetchone()
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def get_user_by_id(user_id: int) -> Optional[UserResponse]:
    conn = get_db_connection()
    if not conn: return None
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, name, email, created_at FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        return UserResponse(**user) if user else None
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def create_resume(user_id: int, file_url: str, parsed_skills: list, parsed_experience: list, parsed_projects: list) -> Optional[ResumeResponse]:
    conn = get_db_connection()
    if not conn: return None
    try:
        cursor = conn.cursor(dictionary=True)
        query = """
        INSERT INTO resumes (user_id, file_url, parsed_skills, parsed_experience, parsed_projects)
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            user_id, file_url,
            json.dumps(parsed_skills) if parsed_skills else None,
            json.dumps(parsed_experience) if parsed_experience else None,
            json.dumps(parsed_projects) if parsed_projects else None
        ))
        conn.commit()
        resume_id = cursor.lastrowid

        cursor.execute("SELECT * FROM resumes WHERE id = %s", (resume_id,))
        resume = cursor.fetchone()
        if resume:
            resume['parsed_skills'] = json.loads(resume['parsed_skills']) if resume['parsed_skills'] else []
            resume['parsed_experience'] = json.loads(resume['parsed_experience']) if resume['parsed_experience'] else []
            resume['parsed_projects'] = json.loads(resume['parsed_projects']) if resume['parsed_projects'] else []
            return ResumeResponse(**resume)
        return None
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def get_resumes_by_user(user_id: int) -> List[ResumeResponse]:
    conn = get_db_connection()
    if not conn: return []
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM resumes WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
        resumes = cursor.fetchall()
        result = []
        for r in resumes:
            r['parsed_skills'] = json.loads(r['parsed_skills']) if r.get('parsed_skills') else []
            r['parsed_experience'] = json.loads(r['parsed_experience']) if r.get('parsed_experience') else []
            r['parsed_projects'] = json.loads(r['parsed_projects']) if r.get('parsed_projects') else []
            result.append(ResumeResponse(**r))
        return result
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def create_interview(user_id: int, job_role_id: int) -> Optional[InterviewResponse]:
    conn = get_db_connection()
    if not conn: return None
    try:
        cursor = conn.cursor(dictionary=True)
        query = "INSERT INTO interviews (user_id, job_role_id, status) VALUES (%s, %s, %s)"
        cursor.execute(query, (user_id, job_role_id, 'scheduled'))
        conn.commit()
        interview_id = cursor.lastrowid

        cursor.execute("SELECT * FROM interviews WHERE id = %s", (interview_id,))
        interview = cursor.fetchone()
        return InterviewResponse(**interview) if interview else None
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def get_interviews_by_user(user_id: int) -> List[InterviewResponse]:
    conn = get_db_connection()
    if not conn: return []
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM interviews WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
        interviews = cursor.fetchall()
        return [InterviewResponse(**i) for i in interviews]
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def create_job_role(title: str, description: Optional[str] = None) -> Optional[dict]:
    conn = get_db_connection()
    if not conn: return None
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("INSERT INTO job_roles (title, description) VALUES (%s, %s)", (title, description))
        conn.commit()
        role_id = cursor.lastrowid
        cursor.execute("SELECT * FROM job_roles WHERE id = %s", (role_id,))
        return cursor.fetchone()
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def get_job_role_by_title(title: str) -> Optional[dict]:
    conn = get_db_connection()
    if not conn: return None
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM job_roles WHERE title = %s", (title,))
        return cursor.fetchone()
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def create_question(job_role_id: int, content: str, difficulty: str) -> Optional[QuestionResponse]:
    conn = get_db_connection()
    if not conn: return None
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "INSERT INTO questions (job_role_id, content, difficulty) VALUES (%s, %s, %s)",
            (job_role_id, content, difficulty)
        )
        conn.commit()
        question_id = cursor.lastrowid
        cursor.execute("SELECT * FROM questions WHERE id = %s", (question_id,))
        question = cursor.fetchone()
        return QuestionResponse(**question) if question else None
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def get_questions_by_role(job_role_id: int) -> List[QuestionResponse]:
    conn = get_db_connection()
    if not conn: return []
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM questions WHERE job_role_id = %s", (job_role_id,))
        questions = cursor.fetchall()
        return [QuestionResponse(**q) for q in questions]
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def save_answer(interview_id: int, question_id: int, answer_text: str, score: int, feedback: str) -> bool:
    conn = get_db_connection()
    if not conn: return False
    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO answers (interview_id, question_id, answer_text, score, feedback) VALUES (%s, %s, %s, %s, %s)",
            (interview_id, question_id, answer_text, score, feedback)
        )
        conn.commit()
        return True
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def complete_interview(interview_id: int, total_score: int) -> bool:
    conn = get_db_connection()
    if not conn: return False
    try:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE interviews SET status = 'completed', total_score = %s, finished_at = CURRENT_TIMESTAMP WHERE id = %s",
            (total_score, interview_id)
        )
        conn.commit()
        return True
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def get_interview_history(user_id: int) -> List[dict]:
    conn = get_db_connection()
    if not conn: return []
    try:
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT i.id as interview_id, j.title as role_title, i.created_at as date, i.total_score as score,
                   (SELECT COUNT(*) FROM questions q WHERE q.job_role_id = i.job_role_id) as questions_count
            FROM interviews i
            LEFT JOIN job_roles j ON i.job_role_id = j.id
            WHERE i.user_id = %s AND i.status = 'completed'
            ORDER BY i.created_at DESC
        """
        cursor.execute(query, (user_id,))
        return cursor.fetchall()
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def get_interview_report(interview_id: int) -> dict:
    conn = get_db_connection()
    if not conn: return {}
    try:
        cursor = conn.cursor(dictionary=True)
        # Get interview basic info
        cursor.execute("SELECT total_score, status FROM interviews WHERE id = %s", (interview_id,))
        interview = cursor.fetchone()
        
        # Get all answers
        cursor.execute("SELECT score, feedback, answer_text FROM answers WHERE interview_id = %s", (interview_id,))
        answers = cursor.fetchall()
        
        return {
            "interview": interview,
            "answers": answers
        }
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
