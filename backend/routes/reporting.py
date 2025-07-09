from fastapi import APIRouter, HTTPException
from config.database import crimes_collection, subscribers_collection
from models.report import CrimeReportRequest
import asyncio
from config.email import send_email_to_subscriber

router = APIRouter()

async def send_email(email, report):
    subject = f"Crime Alert: {report['crime_type']} reported in {report['city']}"
    body = f"""
    <h3>Crime Alert Notification</h3>
    <b>Type:</b> {report['crime_type']}<br>
    <b>Location:</b> {report['location']}<br>
    <b>Description:</b> {report['description']}<br>
    <b>Date/Time:</b> {report['date']} {report['time']}<br>
    """
    await send_email_to_subscriber(email, report)

async def send_sms(phone, report):
    # Your SMS sending logic here
    pass

async def alert_subscribers(report):
    subscribers = subscribers_collection.find({})
    tasks = []
    async for subscriber in subscribers:
        if subscriber.get("email"):
            tasks.append(send_email(subscriber["email"], report))
    await asyncio.gather(*tasks)

@router.post("/submit")
async def submit_report(report: CrimeReportRequest):
    # Save the report
    result = await crimes_collection.insert_one(report.dict())
    await alert_subscribers(report.dict())
    return {"success": True, "report_id": str(result.inserted_id)}

@router.get("/reports/{report_id}")
async def get_report(report_id: str):
    report = await crimes_collection.find_one({"_id": report_id})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    report["_id"] = str(report["_id"])
    return report

# Add more MongoDB-based endpoints as needed. 