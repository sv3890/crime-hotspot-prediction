import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from datetime import datetime
from dotenv import load_dotenv
import requests
from sqlalchemy.orm import Session
from models.subscriber import Subscriber
from models.crime import Crime

load_dotenv()

class NotificationService:
    def __init__(self):
        self.email_sender = os.getenv("EMAIL_SENDER")
        self.email_password = os.getenv("EMAIL_PASSWORD")
        self.sms_api_key = os.getenv("SMS_API_KEY")
        self.sms_sender = os.getenv("SMS_SENDER")
    
    async def notify_subscribers(self, crime: Crime, subscribers: list[Subscriber], db: Session):
        """Notify subscribers about a new crime incident"""
        for subscriber in subscribers:
            if not subscriber.is_active:
                continue
            
            # Check if subscriber should be notified based on risk level
            if not self._should_notify(subscriber, crime.risk_level):
                continue
            
            # Check if subscriber is within radius
            if not self._is_within_radius(subscriber, crime):
                continue
            
            # Send notifications
            if subscriber.prefers_email:
                await self._send_email_notification(subscriber, crime)
            
            if subscriber.prefers_sms and subscriber.phone:
                await self._send_sms_notification(subscriber, crime)
            
            # Update last notified timestamp
            subscriber.last_notified = datetime.now()
            db.commit()
    
    def _should_notify(self, subscriber: Subscriber, risk_level: str) -> bool:
        """Check if subscriber should be notified based on risk level preferences"""
        if risk_level == "High" and subscriber.notify_high_risk:
            return True
        if risk_level == "Medium" and subscriber.notify_medium_risk:
            return True
        if risk_level == "Low" and subscriber.notify_low_risk:
            return True
        return False
    
    def _is_within_radius(self, subscriber: Subscriber, crime: Crime) -> bool:
        """Check if crime is within subscriber's alert radius"""
        if not all([subscriber.latitude, subscriber.longitude, crime.latitude, crime.longitude]):
            return False
        
        # Calculate distance using Haversine formula
        from math import radians, sin, cos, sqrt, atan2
        
        R = 6371  # Earth's radius in kilometers
        
        lat1, lon1 = radians(subscriber.latitude), radians(subscriber.longitude)
        lat2, lon2 = radians(crime.latitude), radians(crime.longitude)
        
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * atan2(sqrt(a), sqrt(1-a))
        distance = R * c
        
        return distance <= subscriber.radius
    
    async def _send_email_notification(self, subscriber: Subscriber, crime: Crime):
        """Send email notification to subscriber"""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.email_sender
            msg['To'] = subscriber.email
            msg['Subject'] = f"Crime Alert: {crime.incident_type} in {crime.city}"
            
            body = f"""
            Crime Alert Notification
            
            Incident Type: {crime.incident_type}
            Location: {crime.location_details}, {crime.city}, {crime.state}
            Risk Level: {crime.risk_level}
            Time: {crime.date_time.strftime('%Y-%m-%d %H:%M')}
            
            Description: {crime.description}
            
            Stay safe and be vigilant!
            """
            
            msg.attach(MIMEText(body, 'plain'))
            
            with smtplib.SMTP('smtp.gmail.com', 587) as server:
                server.starttls()
                server.login(self.email_sender, self.email_password)
                server.send_message(msg)
        except Exception as e:
            print(f"Error sending email notification: {str(e)}")
    
    async def _send_sms_notification(self, subscriber: Subscriber, crime: Crime):
        """Send SMS notification to subscriber"""
        try:
            message = f"Crime Alert: {crime.incident_type} in {crime.city}. Risk Level: {crime.risk_level}. Stay safe!"
            
            # Example using a hypothetical SMS API
            # Replace with your preferred SMS service
            response = requests.post(
                "https://api.sms-service.com/send",
                json={
                    "api_key": self.sms_api_key,
                    "sender": self.sms_sender,
                    "recipient": subscriber.phone,
                    "message": message
                }
            )
            
            if response.status_code != 200:
                print(f"Error sending SMS: {response.text}")
        except Exception as e:
            print(f"Error sending SMS notification: {str(e)}") 