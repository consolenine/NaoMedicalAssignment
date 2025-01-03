import enum
from datetime import datetime

from sqlalchemy import Column, String, Integer, ForeignKey, Enum, DateTime, ARRAY

from ..core import Base


class ChatSessionStatus(str, enum.Enum):
    waiting = "waiting"
    active = "active"
    closed = "closed"

class  ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(String, nullable=False)
    start_time = Column(DateTime, default=datetime.now)
    end_time = Column(DateTime)
    status = Column(Enum(ChatSessionStatus), default=ChatSessionStatus.waiting)
    patient_id = Column(Integer, ForeignKey("users.id"))
    staff_id = Column(Integer, ForeignKey("users.id"))
    patient_transcript = Column(ARRAY(String))
    patient_lang = Column(String)
    staff_transcript = Column(ARRAY(String))
    staff_lang = Column(String)