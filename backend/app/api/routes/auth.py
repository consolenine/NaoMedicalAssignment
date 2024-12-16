from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ...core import get_db
from ...core.security import get_password_hash, verify_password, create_access_token, verify_token
from ...models import User

router = APIRouter(prefix="/auth", tags=["auth"])

class SignupRequest(BaseModel):
    email: str
    name: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Bad Request")

    hashed_password = get_password_hash(data.password)
    new_user = User(
        email=data.email,
        name=data.name,
        password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer", "user": {"email": user.email, "name": user.name, "role": user.role}}

@router.post("/logout")
def logout(token = Depends(verify_token)):
    # needs maybe blacklisting of tokens
    return {"message": "Logged out successfully"}

@router.get("/me")
def me(db: Session = Depends(get_db), token = Depends(verify_token)):
    user = db.query(User).filter(User.email == token.get("sub")).first()
    if not user:
        raise HTTPException(status_code=404, detail="Not found")
    return {
        "email": user.email,
        "name": user.name,
        "role": user.role
    }
