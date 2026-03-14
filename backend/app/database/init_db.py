import os
import mysql.connector
from .connection import get_db_connection

def init_db():
    print("Connecting to database...")
    conn = get_db_connection()
    if conn is None:
        print("Failed to connect to the database. Initialization aborted.")
        return

    try:
        cursor = conn.cursor()
        
        # Read the schema.sql file
        schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
        with open(schema_path, 'r') as file:
            sql_script = file.read()
            
        # Execute the statements in the script
        for statement in sql_script.split(';'):
            if statement.strip():
                print(f"Executing: {statement.strip()[:50]}...")
                cursor.execute(statement)

        conn.commit()
        print("Database initialized successfully!")
    except mysql.connector.Error as err:
        print(f"Error executing schema script: {err}")
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
            print("Database connection closed.")

if __name__ == "__main__":
    init_db()
