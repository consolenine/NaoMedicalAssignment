from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

# Initialize the database engine
engine = create_engine(settings.DATABASE_URL, echo=True)

# Create a new session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all models to inherit from
Base = declarative_base()

# Dependency to get the database session
def get_db():
    db = SessionLocal()  # Create a new session
    try:
        yield db  # Use this session in FastAPI routes
    finally:
        db.close()  # Close the session after the request
