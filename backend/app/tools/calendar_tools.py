from app.db.connection import db


async def create_event_tool(user_id: str, date: str, time: str):
    #  prevent duplicate for SAME USER
    existing = await db["events"].find_one({
        "user_id": user_id,
        "date": date.lower(),
        "time": time.lower()
    })

    if existing:
        return {
            "success": False,
            "message": "Slot already booked by you"
        }

    await db["events"].insert_one({
        "user_id": user_id,
        "date": date.lower(),
        "time": time.lower()
    })

    return {
        "success": True,
        "message": "Booked successfully"
    }