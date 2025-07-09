from pydantic import BaseModel
from typing import Optional

class CrimeReportRequest(BaseModel):
    city: str
    crime_type: str
    date: str
    time: str
    location: str
    description: str
    victim_age: Optional[int] = None
    victim_gender: Optional[str] = None
    weapon_used: Optional[str] = None
    crime_domain: Optional[str] = None
