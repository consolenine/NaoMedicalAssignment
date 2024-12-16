from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from ..core import Base
import enum


class Role(str, enum.Enum):
    patient = "patient"
    staff = "staff"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    name = Column(String)
    password = Column(String)
    role = Column(Enum(Role), default=Role.patient)
