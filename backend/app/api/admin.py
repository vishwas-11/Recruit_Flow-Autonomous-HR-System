from fastapi import APIRouter, Depends, HTTPException
from app.utils.auth import get_current_user
from app.db.connection import employees_collection, chats_collection

router = APIRouter()


def require_admin(user):
    if user.get("role") != "admin":
        print(f"⛔ Unauthorized access attempt by user_id={user.get('user_id')}")
        raise HTTPException(status_code=403, detail="Access denied")


@router.get("/employees")
async def get_employees(user=Depends(get_current_user)):
    require_admin(user)

    employees = []
    async for emp in employees_collection.find():
        emp["_id"] = str(emp["_id"])
        employees.append(emp)

    return employees


@router.get("/candidates")
async def get_candidates(user=Depends(get_current_user)):
    require_admin(user)

    candidates = []
    async for chat in chats_collection.find():
        chat["_id"] = str(chat["_id"])
        candidates.append(chat)

    return candidates


@router.get("/research")
async def get_research(user=Depends(get_current_user)):
    require_admin(user)

    research_logs = []
    async for chat in chats_collection.find({"type": "research"}):
        chat["_id"] = str(chat["_id"])
        research_logs.append(chat)

    return research_logs