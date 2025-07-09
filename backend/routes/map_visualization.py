from fastapi import APIRouter, HTTPException, Query
import pandas as pd
import os
from typing import List, Optional

router = APIRouter()

# Provided city coordinates
city_coordinates = {
    "Agra": {"lat": 27.1752554, "lng": 78.0098161},
    "Ahmedabad": {"lat": 23.0215374, "lng": 72.5800568},
    "Bangalore": {"lat": 12.9767936, "lng": 77.590082},
    "Bhopal": {"lat": 23.2584857, "lng": 77.401989},
    "Chennai": {"lat": 13.0836939, "lng": 80.270186},
    "Delhi": {"lat": 28.6517178, "lng": 77.2219388},
    "Faridabad": {"lat": 28.4031478, "lng": 77.3105561},
    "Ghaziabad": {"lat": 28.6711527, "lng": 77.4120356},
    "Hyderabad": {"lat": 17.360589, "lng": 78.4740613},
    "Indore": {"lat": 22.7203616, "lng": 75.8681996},
    "Jaipur": {"lat": 26.9154576, "lng": 75.8189817},
    "Kalyan": {"lat": 19.2396742, "lng": 73.1366482},
    "Kanpur": {"lat": 26.4609135, "lng": 80.3217588},
    "Kolkata": {"lat": 22.5726459, "lng": 88.3638953},
    "Lucknow": {"lat": 26.8381, "lng": 80.9346001},
    "Ludhiana": {"lat": 30.9090157, "lng": 75.851601},
    "Meerut": {"lat": 28.9963296, "lng": 77.7061915},
    "Mumbai": {"lat": 19.054999, "lng": 72.8692035},
    "Nagpur": {"lat": 21.1498134, "lng": 79.0820556},
    "Nashik": {"lat": 20.0112475, "lng": 73.7902364},
    "Patna": {"lat": 25.6093239, "lng": 85.1235252},
    "Pune": {"lat": 18.5213738, "lng": 73.8545071},
    "Rajkot": {"lat": 22.3053263, "lng": 70.8028377},
    "Srinagar": {"lat": 34.0747444, "lng": 74.8204443},
    "Surat": {"lat": 21.2094892, "lng": 72.8317058},
    "Thane": {"lat": 19.1943294, "lng": 72.9701779},
    "Varanasi": {"lat": 25.3356491, "lng": 83.0076292},
    "Vasai": {"lat": 19.3428238, "lng": 72.805441},
    "Visakhapatnam": {"lat": 17.6935526, "lng": 83.2921297}
}


# Load the CSV once at startup
try:
    # Adjust the path as necessary to correctly locate your CSV file
    csv_path = os.path.join(os.path.dirname(__file__), '..', 'crime_dataset_india.csv')
    if not os.path.exists(csv_path):
        # Fallback path if the above doesn't work (e.g., structure is different)
        csv_path = os.path.join(os.path.dirname(__file__), '..', '..', 'crime_dataset_india.csv') # Go up one more level
    
    df = pd.read_csv(csv_path)
    # Ensure 'Date of Occurrence' is parsed as datetime
    df['Date of Occurrence'] = pd.to_datetime(df['Date of Occurrence'], errors='coerce')
    df['Year'] = df['Date of Occurrence'].dt.year

    # Add Latitude and Longitude based on City
    def get_lat(city):
        return city_coordinates.get(city, {}).get('lat')

    def get_lng(city):
        return city_coordinates.get(city, {}).get('lng')

    df['Latitude'] = df['City'].apply(get_lat)
    df['Longitude'] = df['City'].apply(get_lng)
except FileNotFoundError:
    print(f"Error: crime_dataset_india.csv not found at expected paths.")
    df = pd.DataFrame() # Initialize an empty DataFrame if file not found
except Exception as e:
    print(f"Error loading or processing CSV: {e}")
    df = pd.DataFrame()


@router.get("/crime_incidents")
async def get_crime_incidents_on_map(
    year: int = Query(..., description="Year of crime incidents"),
    crime_type: Optional[str] = Query(None, description="Specific crime type to filter by (optional)")
):
    if df.empty:
        raise HTTPException(status_code=503, detail="Crime dataset is not available or failed to load.")

    filtered_df = df[df['Year'] == year]

    if crime_type:
        filtered_df = filtered_df[filtered_df['Crime Description'].str.contains(crime_type, case=False, na=False)]

    # Select relevant columns and drop rows with missing lat/lon
    # (missing lat/lon will occur if a city in the CSV is not in city_coordinates)
    map_data = filtered_df[['Latitude', 'Longitude', 'Crime Description', 'City', 'Date of Occurrence']].copy()
    map_data.dropna(subset=['Latitude', 'Longitude'], inplace=True)
    
    return map_data.to_dict(orient='records')
