import os
import re
from datetime import datetime

from app.tools.bash_tool import run_bash
from app.tools.file_tool import write_file
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
    employee_name = username.replace(" ", "_").lower()

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
    #  OPTIONAL CHECK 2: USER SHOULD HAVE INTERVIEWED
    # (Only if you store interview/chat history)
    # =========================================================
    # Example:
    # from app.db.connection import chats_collection
    # chat = await chats_collection.find_one({"user_id": str(user_doc["_id"])})
    # if not chat:
    #     return {
    #         "messages": state["messages"] + [
    #             f"❌ User '{username}' has not completed interview yet."
    #         ],
    #         "current_step": "onboarding"
    #     }

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

    base_dir = os.path.join(os.getcwd(), "employees", employee_name)
    file_path = os.path.join(base_dir, "welcome.txt")

    print("Creating directory:", base_dir)

    # 1. Create directory
    mkdir_result = run_bash(f'mkdir "{base_dir}"')

    if not mkdir_result.get("success"):
        return {
            "messages": state["messages"] + [
                f"❌ Failed to create directory: {mkdir_result.get('error')}"
            ],
            "current_step": "onboarding"
        }

    # 2. Create welcome file
    content = f"""
Welcome {username} 🎉

Employee ID: {employee_id}

We are excited to have you onboard!

- HR Team
"""

    write_result = write_file(file_path, content)

    if not write_result.get("success"):
        return {
            "messages": state["messages"] + [
                f"❌ Failed to create welcome file: {write_result.get('error')}"
            ],
            "current_step": "onboarding"
        }

    # 3. Store in MongoDB
    employee_doc = {
        "employee_id": employee_id,
        "user_id": str(user_doc["_id"]),  #  ACTUAL USER ID (NOT ADMIN)
        "username": username,
        "directory": base_dir,
        "welcome_file": file_path,
        "created_at": datetime.utcnow(),
        "created_by_admin": admin_user_id
    }

    await employees_collection.insert_one(employee_doc)

    # 4. Verify
    ls_cmd = f'dir "{base_dir}"' if os.name == "nt" else f'ls -la "{base_dir}"'
    ls_result = run_bash(ls_cmd)

    return {
        "messages": state["messages"] + [{
            "status": "success",
            "message": f"✅ Employee '{username}' onboarded successfully",
            "employee_id": employee_id,
            "directory": base_dir,
            "files": ls_result.get("output")
        }],
        "current_step": "onboarding"
    }