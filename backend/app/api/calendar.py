from fastapi import APIRouter, Depends
from app.db.connection import db
from app.utils.auth import get_current_user

router = APIRouter()


@router.get("/")
async def get_events(user=Depends(get_current_user)):
    user_id = user["user_id"]

    events = []

    async for e in db["events"].find({"user_id": user_id}):
        events.append({
            "date": e["date"].lower(),
            "time": e["time"].lower()
        })

    return events