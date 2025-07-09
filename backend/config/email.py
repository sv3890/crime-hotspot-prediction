import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def send_email_to_subscriber(email, report):
    smtp_server = os.getenv('SMTP_SERVER')
    smtp_port = int(os.getenv('SMTP_PORT', 587))
    smtp_user = os.getenv('SMTP_USER')
    smtp_password = os.getenv('SMTP_PASSWORD')
    from_email = os.getenv('FROM_EMAIL', smtp_user)

    subject = f"🚨 Crime Alert: {report.get('crime_type', 'Unknown Crime')} in {report.get('city', 'your area')}"
    crime_type = report.get('crime_type', 'N/A')
    location = report.get('location', 'N/A')
    description = report.get('description', 'N/A')
    date = report.get('date', 'N/A')
    time = report.get('time', 'N/A')
    date_time = f"{date} {time}" if date != 'N/A' and time != 'N/A' else date or time or 'N/A'

    html = f"""
    <!DOCTYPE html>
    <html>
      <body style='font-family: Arial, sans-serif; color: #222;'>
        <div style='max-width: 500px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px; background: #f9f9f9;'>
          <h2 style='color: #1976d2; margin-top: 0;'>🚨 Crime Alert Notification</h2>
          <p>
            Dear Subscriber,<br><br>
            We want to inform you of a recent crime reported in your area. Please review the details below and stay alert.
          </p>
          <table style='width: 100%; border-collapse: collapse; margin: 16px 0;'>
            <tr>
              <td style='padding: 8px 0; font-weight: bold;'>Crime Type:</td>
              <td style='padding: 8px 0;'>{crime_type}</td>
            </tr>
            <tr>
              <td style='padding: 8px 0; font-weight: bold;'>Location:</td>
              <td style='padding: 8px 0;'>{location}</td>
            </tr>
            <tr>
              <td style='padding: 8px 0; font-weight: bold;'>Description:</td>
              <td style='padding: 8px 0;'>{description}</td>
            </tr>
            <tr>
              <td style='padding: 8px 0; font-weight: bold;'>Date &amp; Time:</td>
              <td style='padding: 8px 0;'>{date_time}</td>
            </tr>
          </table>
          <p style='margin-top: 24px;'>
            <b>Safety Tips:</b>
            <ul>
              <li>Stay vigilant and report any suspicious activity to local authorities.</li>
              <li>Share this information with your neighbors and loved ones.</li>
              <li>Follow recommended safety guidelines for your area.</li>
            </ul>
          </p>
          <p style='color: #555; font-size: 0.95em;'>
            Thank you for helping keep our community safe.<br>
            <b>Crime Alert System Team</b>
          </p>
        </div>
      </body>
    </html>
    """

    text = f"""
    🚨 Crime Alert Notification\n\nDear Subscriber,\n\nWe want to inform you of a recent crime reported in your area. Please review the details below and stay alert.\n\nCrime Type: {crime_type}\nLocation: {location}\nDescription: {description}\nDate & Time: {date_time}\n\nSafety Tips:\n- Stay vigilant and report any suspicious activity to local authorities.\n- Share this information with your neighbors and loved ones.\n- Follow recommended safety guidelines for your area.\n\nThank you for helping keep our community safe.\nCrime Alert System Team\n    """

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = from_email
    msg['To'] = email

    part1 = MIMEText(text, 'plain')
    part2 = MIMEText(html, 'html')
    msg.attach(part1)
    msg.attach(part2)

    try:
        if smtp_port == 465:
            with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
                server.login(smtp_user, smtp_password)
                server.sendmail(from_email, email, msg.as_string())
        else:
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.ehlo()
                server.starttls()
                server.ehlo()
                server.login(smtp_user, smtp_password)
                server.sendmail(from_email, email, msg.as_string())
        print(f"Crime alert email sent to {email}")
    except Exception as e:
        print(f"Failed to send email to {email}: {e}")

# Test the function
async def test_send_email():
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    smtp_user = "youraddress@gmail.com"
    smtp_password = "your_16_char_app_password"
    from_email = smtp_user
    to_email = smtp_user

    print("SMTP_USER:", smtp_user)
    print("SMTP_PASSWORD:", smtp_password)

    msg = MIMEText("Test email from Python", "plain")
    msg["Subject"] = "Test"
    msg["From"] = from_email
    msg["To"] = to_email

    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(smtp_user, smtp_password)
        server.sendmail(from_email, to_email, msg.as_string())
    print("Sent!") 