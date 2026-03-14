# AI Interview Coach

Intelligent AI Interview Preparation Platform

## Tech Stack
Frontend: Next.js, TailwindCSS, TypeScript  
Backend: FastAPI, Python, MySQL  
AI: Groq API  
Other: Monaco Editor, Chart.js  

## Features
- Resume Upload & Parsing
- AI Generated Interview Questions
- Coding Interview Editor
- Voice Interview
- Interview Analytics Dashboard
- Leaderboard
- Admin Panel

## Setup

### Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

### Frontend
cd frontend
npm install
npm run dev