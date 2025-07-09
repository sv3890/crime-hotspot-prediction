from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr
from typing import Optional

Base = declarative_base()

class Subscriber(Base):
    __tablename__ = "subscribers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True)
    phone = Column(String(20), unique=True, index=True, nullable=True)
    name = Column(String(100))
    state = Column(String(100))
    city = Column(String(100))
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    radius = Column(Float, default=5.0)  # Alert radius in kilometers
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)
    last_notified = Column(DateTime, nullable=True)
    
    # Alert Preferences
    notify_email = Column(Boolean, default=True)
    notify_sms = Column(Boolean, default=False)
    notify_high_risk = Column(Boolean, default=True)
    notify_medium_risk = Column(Boolean, default=True)
    notify_low_risk = Column(Boolean, default=False)
    
    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "phone": self.phone,
            "name": self.name,
            "state": self.state,
            "city": self.city,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "radius": self.radius,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "last_notified": self.last_notified.isoformat() if self.last_notified else None,
            "notify_email": self.notify_email,
            "notify_sms": self.notify_sms,
            "notify_high_risk": self.notify_high_risk,
            "notify_medium_risk": self.notify_medium_risk,
            "notify_low_risk": self.notify_low_risk
        }

class SubscriptionRequest(BaseModel):
    name: str
    phone: str
    email: EmailStr
    city: str
    notify_email: Optional[bool] = True
    notify_sms: Optional[bool] = False
    notify_high_risk: Optional[bool] = True
    notify_medium_risk: Optional[bool] = True
    notify_low_risk: Optional[bool] = False 