# lambda function to get the current UTC time when a new user is created


from sqlalchemy import Column, Integer, String, DateTime, Enum
from datetime import datetime , timezone
from app.config.db import Base
from app.config.enum import UserRole, UserStatus

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(
        String(150),
        unique=True,
        nullable=False
    )

    password_hash = Column(
        String(255),
        nullable=False
    )

    role = Column(
        Enum(UserRole),
        default=UserRole.EMPLOYEE,
        nullable=False
    )

    status = Column(
        Enum(UserStatus),
        default=UserStatus.ACTIVE,
        nullable=False
    )
    created_at = Column(
        DateTime,
        default=lambda:datetime.now(timezone.utc)    
    )

    updated_at = Column(
        DateTime,
        default=lambda:datetime.now(timezone.utc),
        onupdate=lambda:datetime.now(timezone.utc)
    )

