from fastapi import APIRouter, HTTPException
import pandas as pd
import numpy as np
import os
from typing import Dict, List, Optional

router = APIRouter()

# Load dataset robustly
try:
    csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'crime_dataset_india.csv'))
    if not os.path.exists(csv_path):
        csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'crime_dataset_india.csv'))
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Could not find crime_dataset_india.csv at {csv_path}")
    df = pd.read_csv(csv_path)

    # Convert date/time
    df['Date of Occurrence'] = pd.to_datetime(df['Date of Occurrence'], errors='coerce')
    df['Time of Occurrence'] = pd.to_datetime(df['Time of Occurrence'], errors='coerce')

    # Extract features
    df['Year'] = df['Date of Occurrence'].dt.year
    df['Month'] = df['Date of Occurrence'].dt.month
    df['Hour'] = df['Time of Occurrence'].dt.hour
    df['DayOfWeek'] = df['Date of Occurrence'].dt.dayofweek
    df['MonthName'] = df['Date of Occurrence'].dt.strftime('%B')

    required_columns = ['City', 'Crime Description', 'Victim Gender', 'Crime Domain']
    if not all(col in df.columns for col in required_columns):
        raise ValueError("Missing required columns in dataset")

except Exception as e:
    print(f"Error loading dataset: {str(e)}")
    df = pd.DataFrame()


def get_default_response():
    return {
        "city_stats": [],
        "crime_type_stats": [],
        "monthly_trends": [],
        "hourly_stats": [],
        "gender_stats": []
    }

# ----------- API Routes -----------

@router.get("/summary")
async def get_summary():
    try:
        if df.empty:
            return get_default_response()

        city_stats = df.groupby('City').agg({
            'Crime Description': 'count',
            'Victim Gender': lambda x: x.value_counts().to_dict(),
            'Crime Domain': lambda x: x.value_counts().to_dict()
        }).reset_index()
        city_stats.columns = ['city', 'total_crimes', 'gender_distribution', 'domain_distribution']
        city_stats = city_stats.sort_values('total_crimes', ascending=False).head(10)

        crime_type_stats = df.groupby('Crime Description').agg({
            'City': 'count',
            'Victim Gender': lambda x: x.value_counts().to_dict(),
            'Crime Domain': lambda x: x.value_counts().to_dict()
        }).reset_index()
        crime_type_stats.columns = ['crimeType', 'count', 'gender_distribution', 'domain_distribution']
        crime_type_stats = crime_type_stats.sort_values('count', ascending=False).head(10)

        monthly_trends = df.groupby(['Year', 'Month']).size().reset_index(name='count')
        monthly_trends['MonthName'] = pd.to_datetime(monthly_trends['Month'], format='%m').dt.strftime('%B')

        hourly_stats = df.groupby('Hour').agg({
            'Crime Description': 'count',
            'Crime Domain': lambda x: x.value_counts().to_dict()
        }).reset_index()
        hourly_stats.columns = ['hour', 'count', 'domain_distribution']

        gender_stats = df.groupby('Victim Gender').agg({
            'Crime Description': 'count',
            'Crime Domain': lambda x: x.value_counts().to_dict()
        }).reset_index()
        gender_stats.columns = ['gender', 'count', 'domain_distribution']

        return {
            "city_stats": city_stats.to_dict(orient='records'),
            "crime_type_stats": crime_type_stats.to_dict(orient='records'),
            "monthly_trends": monthly_trends.to_dict(orient='records'),
            "hourly_stats": hourly_stats.to_dict(orient='records'),
            "gender_stats": gender_stats.to_dict(orient='records')
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/heatmap")
async def get_heatmap():
    try:
        if df.empty:
            return {"heatmap": []}
        heatmap_data = df.groupby(['DayOfWeek', 'Hour']).size().reset_index(name='count')
        return {"heatmap": heatmap_data.to_dict(orient='records')}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/radar")
async def get_radar():
    try:
        if df.empty:
            return {"radar": []}
        top_cities = df['City'].value_counts().head(5).index.tolist()
        top_crimes = df['Crime Description'].value_counts().head(5).index.tolist()
        radar_data = []
        for city in top_cities:
            city_data = {'City': city}
            for crime in top_crimes:
                count = len(df[(df['City'] == city) & (df['Crime Description'] == crime)])
                city_data[crime] = count
            radar_data.append(city_data)
        return {"radar": radar_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/treemap")
async def get_treemap():
    try:
        if df.empty:
            return {"treemap": []}
        treemap_data = df.groupby(['Crime Domain', 'Crime Description']).size().reset_index(name='count')
        treemap_data = treemap_data.sort_values('count', ascending=False)
        return {"treemap": treemap_data.to_dict(orient='records')}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/trends")
async def get_trends():
    try:
        if df.empty:
            return {
                "yearly_trends": [],
                "monthly_trends": []
            }
        yearly_trends = df.groupby('Year').size().reset_index(name='count')
        last_year = df['Year'].max()
        monthly_trends = df[df['Year'] == last_year].groupby('Month').size().reset_index(name='count')
        monthly_trends['MonthName'] = pd.to_datetime(monthly_trends['Month'], format='%m').dt.strftime('%B')
        return {
            "yearly_trends": yearly_trends.to_dict(orient='records'),
            "monthly_trends": monthly_trends.to_dict(orient='records')
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/top-cities")
async def top_cities():
    pipeline = [
        {"$group": {"_id": "$city", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    results = await crimes_collection.aggregate(pipeline).to_list(length=10)
    return [{"city": r["_id"], "count": r["count"]} for r in results]
