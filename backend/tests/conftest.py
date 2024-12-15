import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .app.core import Base, get_db
from fastapi.testclient import TestClient
from .main import app

# Create a new SQLite test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Set up the database and override the dependency
@pytest.fixture(scope="module")
def override_db():
    Base.metadata.create_all(bind=engine)  # Create tables
    try:
        yield TestingSessionLocal()
    finally:
        Base.metadata.drop_all(bind=engine)  # Clean up after tests

@pytest.fixture(scope="module")
def test_client(override_db):
    def override_get_db():
        db = override_db
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    client = TestClient(app)
    yield client
