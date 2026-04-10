from app.db.connection import db
from datetime import datetime

events_collection = db["events"]


async def check_conflict(date: str, time: str, user_id: str):
    existing = await events_collection.find_one({
        "date": date,
        "time": time,
        "user_id": user_id
    })
    return existing is not None


async def create_event(user_id: str, date: str, time: str):
    event = {
        "user_id": user_id,
        "date": date,
        "time": time,
        "created_at": datetime.utcnow()
    }

    result = await events_collection.insert_one(event)
    return str(result.inserted_id)