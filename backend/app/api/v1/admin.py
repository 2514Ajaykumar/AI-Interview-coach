from fastapi import APIRouter
from app.database.connection import get_db_connection

import csv
import io
from fastapi.responses import StreamingResponse

router = APIRouter()

# ------------------------------------------------
# GET ALL USERS
# ------------------------------------------------

@router.get("/users")
def get_all_users():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, name, email, created_at
        FROM users
        ORDER BY created_at DESC
    """)

    users = cursor.fetchall()

    cursor.close()
    conn.close()

    return {
        "total_users": len(users),
        "users": users
    }


# ------------------------------------------------
# ADMIN PLATFORM STATS
# ------------------------------------------------

@router.get("/stats")
def get_admin_stats():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) as total_users FROM users")
    total_users = cursor.fetchone()["total_users"]

    cursor.execute("SELECT COUNT(*) as total_interviews FROM interviews")
    total_interviews = cursor.fetchone()["total_interviews"]

    cursor.close()
    conn.close()

    return {
        "total_users": total_users,
        "total_interviews": total_interviews
    }


# ------------------------------------------------
# USER PERFORMANCE ANALYTICS
# ------------------------------------------------

@router.get("/user-performance")
def get_user_performance():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            u.id,
            u.name,
            u.email,
            COUNT(i.id) AS interviews_taken,
            AVG(i.score) AS avg_score,
            MAX(i.score) AS best_score
        FROM users u
        LEFT JOIN interviews i
        ON u.id = i.user_id
        GROUP BY u.id
        ORDER BY avg_score DESC
    """)

    performance = cursor.fetchall()

    cursor.close()
    conn.close()

    return {
        "users": performance
    }


# ------------------------------------------------
# GET SINGLE USER INTERVIEW HISTORY
# ------------------------------------------------

@router.get("/user/{user_id}/interviews")
def get_user_interviews(user_id: int):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            id,
            role_title,
            score,
            created_at
        FROM interviews
        WHERE user_id = %s
        ORDER BY created_at DESC
    """, (user_id,))

    interviews = cursor.fetchall()

    cursor.close()
    conn.close()

    return {
        "total_interviews": len(interviews),
        "interviews": interviews
    }


# ------------------------------------------------
# USER REGISTRATION ACTIVITY
# ------------------------------------------------

@router.get("/login-activity")
def get_login_activity():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            DATE(created_at) as date,
            COUNT(*) as users
        FROM users
        GROUP BY DATE(created_at)
        ORDER BY date
    """)

    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return {
        "activity": data
    }


# ------------------------------------------------
# INTERVIEW ACTIVITY
# ------------------------------------------------

@router.get("/interview-activity")
def get_interview_activity():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            DATE(created_at) as date,
            COUNT(*) as interviews
        FROM interviews
        GROUP BY DATE(created_at)
        ORDER BY date
    """)

    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return {
        "activity": data
    }


# ------------------------------------------------
# TOP PERFORMERS LEADERBOARD
# ------------------------------------------------

@router.get("/leaderboard")
def get_leaderboard():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            u.id,
            u.name,
            MAX(i.score) as best_score
        FROM users u
        JOIN interviews i
        ON u.id = i.user_id
        GROUP BY u.id
        ORDER BY best_score DESC
        LIMIT 5
    """)

    leaders = cursor.fetchall()

    cursor.close()
    conn.close()

    return {
        "leaders": leaders
    }


# ------------------------------------------------
# SKILL ANALYTICS (SIMULATED AI)
# ------------------------------------------------

@router.get("/skill-analytics/{user_id}")
def get_skill_analytics(user_id:int):

    return {
        "skills":[
            {"skill":"Coding","score":80},
            {"skill":"Algorithms","score":60},
            {"skill":"System Design","score":40},
            {"skill":"Communication","score":75}
        ]
    }


# ------------------------------------------------
# EXPORT USERS CSV REPORT
# ------------------------------------------------

@router.get("/export-users")
def export_users():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id,name,email FROM users")
    users = cursor.fetchall()

    cursor.close()
    conn.close()

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(["ID","Name","Email"])

    for user in users:
        writer.writerow([user["id"],user["name"],user["email"]])

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={
            "Content-Disposition":"attachment; filename=users_report.csv"
        }
    )