from sqlalchemy import Column, Integer, String, Text
from .database import Base

class Session(Base):
    __tablename__ = "sessions"

    id               = Column(Integer, primary_key=True, autoincrement=True)
    cake_name        = Column(String, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    completed_at     = Column(Text, nullable=False)