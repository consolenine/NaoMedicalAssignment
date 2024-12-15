from fastapi import APIRouter
from .routes import auth

api_router = APIRouter()

# Include authentication routes
api_router.include_router(auth.router)

# You can include more routers, e.g., users, video, etc.
# from app.api.routes import users
# api_router.include_router(users.router)
