import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from dotenv import load_dotenv
from contextlib import asynccontextmanager

# Load environment variables
load_dotenv()

# MongoDB connection settings
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "crime_prediction")

# Create async client
async_client = AsyncIOMotorClient(MONGODB_URL)
async_db = async_client[DATABASE_NAME]

# Create sync client for scripts
sync_client = MongoClient(MONGODB_URL)
sync_db = sync_client[DATABASE_NAME]

# Collections
crimes_collection = async_db.crimes
subscribers_collection = async_db.subscribers
predictions_collection = async_db.predictions

# Create indexes
async def create_indexes():
    # Crimes collection indexes
    await crimes_collection.create_index([("date_time", -1)])
    await crimes_collection.create_index([("state", 1), ("city", 1)])
    await crimes_collection.create_index([("location", "2dsphere")])
    
    # Subscribers collection indexes
    await subscribers_collection.create_index([("email", 1)], unique=True)
    await subscribers_collection.create_index([("phone", 1)], unique=True)
    await subscribers_collection.create_index([("location", "2dsphere")])
    
    # Predictions collection indexes
    await predictions_collection.create_index([("timestamp", -1)])
    await predictions_collection.create_index([("state", 1), ("city", 1)])

@asynccontextmanager
# srcc/backend/config/database.py (or similar)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()