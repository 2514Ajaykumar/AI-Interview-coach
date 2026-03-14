from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="INTERVIEWAI API",
    description="Intelligent AI Interview Preparation Platform Backend",
    version="1.0.0"
)

# ---------------- CORS ---------------- #

origins = [
    "http://localhost:3000",  # local development
    "https://ai-interview-coach-brown-one.vercel.app"  # deployed frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- ROOT ---------------- #

@app.get("/")
def root():
    return {"message": "INTERVIEWAI backend running"}

# ---------------- HEALTH CHECK ---------------- #

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "message": "INTERVIEWAI Backend is running."
    }

# ---------------- ROUTES ---------------- #

from app.api.v1 import auth, resume, interview
from app.api.v1 import code
from app.api.v1 import admin

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(resume.router, prefix="/api/v1/resumes", tags=["Resumes"])
app.include_router(interview.router, prefix="/api/v1/interviews", tags=["Interviews"])
app.include_router(code.router, prefix="/api/v1/code", tags=["Code Evaluation"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])

# ---------------- RUN SERVER ---------------- #

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )