from fastapi import APIRouter
import pandas as pd
import os

router = APIRouter()

# Load the CSV once at startup
csv_path = os.path.join(os.path.dirname(__file__), '..', 'crime_dataset_india.csv')
df = pd.read_csv(csv_path)
# Ensure 'Date of Occurrence' is parsed as datetime and 'Year' column exists
df['Date of Occurrence'] = pd.to_datetime(df['Date of Occurrence'], errors='coerce')
df['Year'] = df['Date of Occurrence'].dt.year

@router.get("/api/options")
def get_options():
    age_groups = [
        {"value": "0-18", "label": "0–18 (Child/Teen)"},
        {"value": "19-25", "label": "19–25 (Young Adult)"},
        {"value": "26-35", "label": "26–35 (Adult)"},
        {"value": "36-50", "label": "36–50 (Middle-aged)"},
        {"value": "50+", "label": "50+ (Senior)"}
    ]
    genders = [
        {"value": "M", "label": "Male"},
        {"value": "F", "label": "Female"},
        {"value": "O", "label": "Other"}
    ]
    # Prepare city options as value-label pairs
    cities = sorted(df['City'].dropna().unique().tolist())
    city_options = [{"value": city, "label": city} for city in cities]
    
    # Get unique years from the 'Year' column, sort them descending
    dataset_years = sorted(df['Year'].dropna().unique().astype(int).tolist(), reverse=True)

    return {
        "cities": city_options,
        "crimeTypes": sorted(df['Crime Description'].dropna().unique().tolist()),
        "ageGroups": age_groups,
        "genders": genders,
        "years": dataset_years, # Add years to the response
    }
