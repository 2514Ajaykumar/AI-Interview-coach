import os
import sys

# Ensure app is importable
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.database.connection import get_db_connection

def alter_db():
    print("Connecting to database...")
    conn = get_db_connection()
    if conn is None:
        print("Failed to connect.")
        return
        
    try:
        cursor = conn.cursor()
        
        # We handle failures gracefully if columns already exist
        try:
            cursor.execute("ALTER TABLE interviews ADD COLUMN total_score INT NULL;")
            print("Added total_score.")
        except Exception as e:
            print("total_score might already exist:", e)
            
        try:
            cursor.execute("ALTER TABLE interviews ADD COLUMN finished_at TIMESTAMP NULL;")
            print("Added finished_at.")
        except Exception as e:
            print("finished_at might already exist:", e)
            
        conn.commit()
    except Exception as e:
        print("Error:", e)
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    alter_db()
