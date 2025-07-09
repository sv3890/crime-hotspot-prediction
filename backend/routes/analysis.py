from fastapi import APIRouter, HTTPException
import pandas as pd
import os

router = APIRouter()

# Load dataset once at startup
backend_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(backend_dir, '..', 'crime_dataset_india.csv')
df = pd.read_csv(csv_path)
df['Year'] = pd.to_datetime(df['Date of Occurrence'], errors='coerce').dt.year
df['Month'] = pd.to_datetime(df['Date of Occurrence'], errors='coerce').dt.month

# Robustly create 'Hour' column if possible
if 'Time of Occurrence' in df.columns:
    try:
        df['Hour'] = pd.to_datetime(df['Time of Occurrence'], errors='coerce').dt.hour
    except Exception:
        df['Hour'] = None
else:
    df['Hour'] = None

def get_age_group(age):
    try:
        age = int(age)
        if age <= 18:
            return '0-18'
        elif age <= 30:
            return '19-30'
        elif age <= 45:
            return '31-45'
        elif age <= 60:
            return '46-60'
        else:
            return '60+'
    except:
        return None

def get_time_of_day(hour):
    if pd.isna(hour):
        return None
    if 6 <= hour < 12:
        return 'Morning'
    elif 12 <= hour < 18:
        return 'Afternoon'
    elif 18 <= hour < 24:
        return 'Evening'
    else:
        return 'Night'

@router.post("/analyze")
async def analyze(data: dict):
    try:
        print("Received analysis request data:", data)
        filtered = df.copy()
        if data.get('city'):
            filtered = filtered[filtered['City'] == data['city']]
        if data.get('gender'):
            filtered = filtered[filtered['Victim Gender'] == data['gender']]
        if data.get('age_group'):
            filtered = filtered[filtered['Victim Age'].apply(lambda x: get_age_group(x) == data['age_group'])]
        if data.get('month'):
            try:
                filtered = filtered[filtered['Month'] == int(data['month'])]
            except:
                pass
        if data.get('year'):
            try:
                filtered = filtered[filtered['Year'] == int(data['year'])]
            except:
                pass
        if data.get('time_of_day') and 'Hour' in filtered.columns:
            filtered = filtered[filtered['Hour'].apply(lambda x: get_time_of_day(x) == data['time_of_day'])]

        total = len(filtered)
        top_crimes = filtered['Crime Description'].value_counts().head(3).to_dict() if not filtered.empty and 'Crime Description' in filtered.columns else {}
        peak_hours = filtered['Hour'].value_counts().head(2).to_dict() if not filtered.empty and 'Hour' in filtered.columns else {}
        risk_level = "Low"
        if total > 100:
            risk_level = "High"
        elif total > 30:
            risk_level = "Medium"

        trend = ""
        if not filtered.empty and 'Month' in filtered.columns:
            common_month = filtered['Month'].mode()[0]
            trend = f"Most crimes occurred in month {common_month}."
            if 'Victim Gender' in filtered.columns and filtered['Victim Gender'].mode()[0] == "F":
                trend += " Females are more frequently victims in this filter."

        summary = (
            f"Total crimes matching your filter: {total}. "
            f"Top crime types: {', '.join([f'{k} ({v})' for k, v in top_crimes.items()])}. "
            f"Peak hours: {', '.join([str(h) for h in peak_hours.keys()])}. "
            f"Risk level: {risk_level}. "
            f"{trend}"
        )

        details = {
            "trend": [
                {"year": int(y), "count": int(c)}
                for y, c in filtered.groupby('Year').size().to_dict().items()
            ] if not filtered.empty and 'Year' in filtered.columns else [],
            "heatmap": [
                {"hour": int(h), "count": int(c)}
                for h, c in filtered.groupby('Hour').size().to_dict().items()
            ] if not filtered.empty and 'Hour' in filtered.columns else [],
            "top_crime_types": [
                {"type": k, "count": v}
                for k, v in top_crimes.items()
            ] if top_crimes else [],
            "victim_profile": {
                "most_common_gender": filtered['Victim Gender'].mode()[0] if not filtered.empty and 'Victim Gender' in filtered.columns else "N/A",
                "most_common_age_group": get_age_group(filtered['Victim Age'].mode()[0]) if not filtered.empty and 'Victim Age' in filtered.columns else "N/A"
            } if not filtered.empty else {},
            "recommendations": [
                "Increase patrols in the evening." if 'Hour' in filtered.columns and any((filtered['Hour'] >= 18) & (filtered['Hour'] <= 23)) else "",
                "Awareness programs for young adults." if 'Victim Age' in filtered.columns and (filtered['Victim Age'].between(19, 30).sum() > 0) else "",
                "Consider community outreach in high-crime areas." if total > 10 else ""
            ]
        }
        details["recommendations"] = [r for r in details["recommendations"] if r]

        if filtered.empty:
            return {
                "summary": "No crimes found matching your filter. Try relaxing your filters.",
                "details": {}
            }

        return {"summary": summary, "details": details}
    except Exception as e:
        print(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))