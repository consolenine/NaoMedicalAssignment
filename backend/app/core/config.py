import os

class Settings:
    DEBUG: bool
    DATABASE_URL: str
    SECRET_KEY: str
    POSTGRES_HOST: str
    POSTGRES_PORT: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    DATABASE_URL: str
    CORS_ALLOWED_ORIGINS: list[str]
    FRONTEND_HOST: str = None
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    JWT_ALGORITHM: str

    def __init__(self):
        self.DEBUG = os.getenv("DEBUG", "False").lower() in (
            "true",
            "1",
        )
        self.SECRET_KEY = os.getenv("SECRET_KEY")

        self.POSTGRES_HOST = os.getenv("POSTGRES_HOST")
        self.POSTGRES_PORT = os.getenv("POSTGRES_PORT")
        self.POSTGRES_USER = os.getenv("POSTGRES_USER")
        self.POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
        self.POSTGRES_DB = os.getenv("POSTGRES_DB")
        self.DATABASE_URL = f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        self.CORS_ALLOWED_ORIGINS = []

        if os.getenv("FRONTEND_HOST"):
            self.FRONTEND_HOST = os.getenv("FRONTEND_HOST")
            self.CORS_ALLOWED_ORIGINS.append(self.FRONTEND_HOST)

        # Auth
        self.ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 8
        self.JWT_ALGORITHM = "HS256"

settings = Settings()
