from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.prediction import predict_crime_type

router = APIRouter()

class PredictionInput(BaseModel):
    city: str
    age_group: str
    gender: str
    time_of_day: str
    month: str
    day_of_week: str

@router.post("/")
async def predict(input: PredictionInput):
    try:
        result = predict_crime_type(
            input.city,
            input.age_group,
            input.gender,
            input.time_of_day,
            input.month,
            input.day_of_week
        )
        print("Prediction result:", result)  # Debug log
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return result
    except Exception as e:
        print("Prediction error:", e)  # Debug log
        raise HTTPException(status_code=500, detail=str(e))


# @router.post("/")
# async def predict(input: PredictionInput):
#     try:
#         result = predict_crime_type(
#             input.city,
#             input.age_group,
#             input.gender,
#             input.time_of_day,
#             input.month,
#             input.day_of_week
#         )
        
#         if "error" in result:
#             raise HTTPException(status_code=400, detail=result["error"])
            
#         return result
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

