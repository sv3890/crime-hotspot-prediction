from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Crime(Base):
    __tablename__ = "crimes"

    id = Column(Integer, primary_key=True, index=True)
    state = Column(String(100))
    city = Column(String(100))
    latitude = Column(Float)
    longitude = Column(Float)
    incident_type = Column(String(100))
    description = Column(Text)
    risk_level = Column(String(20))
    date_time = Column(DateTime, default=datetime.now)
    is_anonymous = Column(Boolean, default=False)
    
    # Victim Information
    victim_name = Column(String(100), nullable=True)
    victim_contact = Column(String(20), nullable=True)
    victim_age = Column(Integer, nullable=True)
    victim_gender = Column(String(20), nullable=True)
    
    # Location Details
    location_details = Column(Text, nullable=True)
    weather_condition = Column(String(50), nullable=True)
    nearby_landmarks = Column(Text, nullable=True)
    
    # Evidence and Witness
    evidence_details = Column(Text, nullable=True)
    witness_details = Column(Text, nullable=True)
    
    # Verification
    status = Column(String(20), default="pending")
    verification_notes = Column(Text, nullable=True)
    verified_at = Column(DateTime, nullable=True)
    reported_by = Column(String(100), nullable=True)
    
    def to_dict(self):
        return {
            "id": self.id,
            "state": self.state,
            "city": self.city,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "incident_type": self.incident_type,
            "description": self.description,
            "risk_level": self.risk_level,
            "date_time": self.date_time.isoformat() if self.date_time else None,
            "is_anonymous": self.is_anonymous,
            "victim_name": self.victim_name,
            "victim_contact": self.victim_contact,
            "victim_age": self.victim_age,
            "victim_gender": self.victim_gender,
            "location_details": self.location_details,
            "weather_condition": self.weather_condition,
            "nearby_landmarks": self.nearby_landmarks,
            "evidence_details": self.evidence_details,
            "witness_details": self.witness_details,
            "status": self.status,
            "verification_notes": self.verification_notes,
            "verified_at": self.verified_at.isoformat() if self.verified_at else None,
            "reported_by": self.reported_by
        } 