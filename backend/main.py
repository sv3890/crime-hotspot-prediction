from dotenv import load_dotenv
load_dotenv()

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from routes.options import router as options_router
from routes.prediction import router as prediction_router

app = FastAPI(
    title="Crime Prediction System",
    description="API for crime prediction, reporting, and analysis",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include routers
from routes import reporting, alerts, visualization, analysis, map_visualization

app.include_router(options_router, prefix="/api/options")
app.include_router(prediction_router, prefix="/api/prediction")
app.include_router(reporting.router, prefix="/api/reporting", tags=["Reporting"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(visualization.router, prefix="/api/visualization", tags=["Visualization"])
app.include_router(map_visualization.router, prefix="/api/map_data", tags=["Map Data"]) # Added new map data router
app.include_router(analysis.router, prefix="/api", tags=["Analysis"])


@app.get("/")
async def root():
    return {
        "message": "Crime Prediction System API",
        "status": "active",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
