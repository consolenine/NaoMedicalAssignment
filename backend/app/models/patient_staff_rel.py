from sqlalchemy import Column, Integer, ForeignKey
from ..core import Base

class PatientStaffRel(Base):
    __tablename__ = "patient_doctor_rel"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    staff_id = Column(Integer, ForeignKey("users.id"))