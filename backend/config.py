# from pydantic_settings import BaseSettings
# from typing import Optional

# class Settings(BaseSettings):
#     DB_HOST: str = "localhost"
#     DB_PORT: str = "3306"
#     DB_USER: str = "root"
#     DB_PASSWORD: str = ""
#     DB_NAME: str = "interviewdb"
#     JWT_SECRET: str = "supersecret"
#     CLOUDINARY_URL: Optional[str] = None

#     class Config:
#         env_file = ".env"
#         env_file_encoding = "utf-8"
#         extra = "allow"

# settings = Settings()

from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DB_HOST: str = "127.0.0.1"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = ""
    DB_NAME: str = "interviewdb"
    JWT_SECRET: str = "supersecret"
    CLOUDINARY_URL: Optional[str] = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "allow"

settings = Settings()