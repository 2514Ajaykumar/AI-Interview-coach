import mysql.connector
from config import settings

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=settings.DB_HOST,
            port=settings.DB_PORT,
            user=settings.DB_USER,
            password=settings.DB_PASSWORD,
            database=settings.DB_NAME
        )
        return connection
    except mysql.connector.Error as err:
        print(f"Error connecting to MySQL Database: {err}")
        return None
