import re
from datetime import datetime

from app.db.connection import employees_collection, users_collection
from app.utils.id_generator import generate_employee_id


def extract_employee_name(message: str):
    message = message.lower()

    patterns = [
        r"onboard\s+(.+)",
        r"create employee\s+(.+)",
        r"hire\s+(.+)",
        r"setup employee\s+(.+)"
    ]

    for pattern in patterns:
        match = re.search(pattern, message)
        if match:
            return match.group(1).strip()

    return None


async def onboarding_node(state):
    print("🟢 ONBOARDING NODE TRIGGERED")

    user_message = state["messages"][-1]
    admin_user_id = state.get("user_id")

    #  Extract name
    extracted_name = extract_employee_name(user_message)

    if not extracted_name:
        return {
            "messages": state["messages"] + [
                "❌ Please specify employee name."
            ],
            "current_step": "onboarding"
        }

    username = extracted_name.title()
    print("Target employee:", username)

    # =========================================================
    #  NEW CHECK 1: USER MUST EXIST IN USERS COLLECTION
    # =========================================================
    user_doc = await users_collection.find_one({
        "username": {"$regex": f"^{username}$", "$options": "i"}
    })

    if not user_doc:
        return {
            "messages": state["messages"] + [
                f"❌ User '{username}' is not registered. Cannot onboard."
            ],
            "current_step": "onboarding"
        }


    # =========================================================
    #  CHECK 3: ALREADY ONBOARDED
    # =========================================================
    existing_employee = await employees_collection.find_one({
        "username": {"$regex": f"^{username}$", "$options": "i"}
    })

    if existing_employee:
        return {
            "messages": state["messages"] + [
                f"❌ Employee '{username}' is already onboarded."
            ],
            "current_step": "onboarding"
        }

    # =========================================================
    #  GENERATE EMPLOYEE
    # =========================================================
    employee_id = generate_employee_id()
    content = (
        f"Welcome {username} 🎉\n\n"
        f"Employee ID: {employee_id}\n\n"
        "We are excited to have you onboard!\n\n"
        "- HR Team\n"
    )

    employee_doc = {
        "employee_id": employee_id,
        "user_id": str(user_doc["_id"]),
        "username": username,
        "welcome_document": {
            "file_name": "welcome.txt",
            "content": content,
            "content_type": "text/plain",
            "stored_in": "mongodb",
            "created_at": datetime.utcnow()
        },
        "created_at": datetime.utcnow(),
        "created_by_admin": admin_user_id
    }

    await employees_collection.insert_one(employee_doc)

    return {
        "messages": state["messages"] + [{
            "status": "success",
            "message": f"✅ Employee '{username}' onboarded successfully",
            "employee_id": employee_id,
            "welcome_file": "welcome.txt",
            "storage": "MongoDB"
        }],
        "current_step": "onboarding"
    }
