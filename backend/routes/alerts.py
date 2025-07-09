from fastapi import APIRouter, HTTPException
from models.subscriber import SubscriptionRequest
from config.database import subscribers_collection

router = APIRouter()

@router.post("/subscribe")
async def subscribe(subscription: SubscriptionRequest):
    """Subscribe to crime alerts"""
    try:
        # Check if email already exists
        existing_email = await subscribers_collection.find_one({"email": subscription.email})
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already subscribed")
        # Check if phone already exists
        existing_phone = await subscribers_collection.find_one({"phone": subscription.phone})
        if existing_phone:
            raise HTTPException(status_code=400, detail="Phone already subscribed")
        result = await subscribers_collection.insert_one(subscription.dict())
        return {"message": "Successfully subscribed to crime alerts", "subscriber_id": str(result.inserted_id)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/subscribers/{subscriber_id}")
async def update_subscription(
    subscriber_id: int,
    subscription: SubscriptionRequest
):
    """Update subscription preferences"""
    # This endpoint is removed as per the instructions
    pass

@router.delete("/subscribers/{subscriber_id}")
async def unsubscribe(
    subscriber_id: int
):
    """Unsubscribe from crime alerts"""
    # This endpoint is removed as per the instructions
    pass

@router.get("/subscribers/{subscriber_id}")
async def get_subscription(
    subscriber_id: int
):
    """Get subscription details"""
    # This endpoint is removed as per the instructions
    pass

# You can add MongoDB-based update, delete, and get endpoints if needed. 