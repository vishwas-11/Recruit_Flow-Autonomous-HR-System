from fastapi import APIRouter, Depends

from app.db.connection import employees_collection
from app.utils.auth import get_current_user

router = APIRouter()


def serialize_employee(employee_doc):
    if not employee_doc:
        return None

    welcome_document = employee_doc.get("welcome_document") or {}
    created_at = employee_doc.get("created_at")
    welcome_created_at = welcome_document.get("created_at")

    return {
        "id": str(employee_doc["_id"]),
        "employee_id": employee_doc.get("employee_id"),
        "user_id": employee_doc.get("user_id"),
        "username": employee_doc.get("username"),
        "is_employee": True,
        "created_at": created_at.isoformat() if created_at else None,
        "welcome_document": {
            "file_name": welcome_document.get("file_name"),
            "content": welcome_document.get("content"),
            "content_type": welcome_document.get("content_type"),
            "stored_in": welcome_document.get("stored_in"),
            "created_at": welcome_created_at.isoformat() if welcome_created_at else None,
        },
    }


@router.get("/me")
async def get_my_employee_record(user=Depends(get_current_user)):
    employee = await employees_collection.find_one({"user_id": user["user_id"]})

    if not employee:
        return {"is_employee": False}

    return serialize_employee(employee)
