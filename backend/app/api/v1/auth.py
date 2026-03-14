from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
# from database import get_db_connection
from app.database.connection import get_db_connection
from passlib.context import CryptContext

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserSignupRequest(BaseModel):
    name: str
    email: str
    password: str


class UserLoginRequest(BaseModel):
    email: str
    password: str


# -----------------------------
# SIGNUP
# -----------------------------
@router.post("/signup")
def signup(payload: UserSignupRequest):

    conn = get_db_connection()
    cursor = conn.cursor()

    # check if email exists
    cursor.execute("SELECT id FROM users WHERE email=%s", (payload.email,))
    existing_user = cursor.fetchone()

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # hash password
    hashed_password = pwd_context.hash(payload.password)

    cursor.execute(
        "INSERT INTO users (name,email,password_hash) VALUES (%s,%s,%s)",
        (payload.name, payload.email, hashed_password)
    )

    conn.commit()

    user_id = cursor.lastrowid

    cursor.close()
    conn.close()

    return {
        "message": "Signup successful",
        "user_id": user_id
    }


# -----------------------------
# LOGIN
# -----------------------------
@router.post("/login")
def login(payload: UserLoginRequest):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM users WHERE email=%s",
        (payload.email,)
    )

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # verify password
    if not pwd_context.verify(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # return {
    #     "message": "Login successful",
    #     "user_id": user["id"],
    #     "token": "mock_token"
    # }
    return {
    "message": "Login successful",
    "user_id": user["id"],
    "role": user["role"],
    "token": "mock_token"
}