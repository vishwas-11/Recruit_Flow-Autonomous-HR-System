# import os
# from app.tools.bash_tool import run_bash
# from app.tools.file_tool import write_file


# async def onboarding_node(state):
#     print("🟢 ONBOARDING NODE TRIGGERED")

#     username = state.get("username", "employee")
#     employee_name = username.replace(" ", "_").lower()

#     # ✅ SAFE BASE DIR (ABSOLUTE PATH)
#     base_dir = os.path.join(os.getcwd(), "employees", employee_name)
#     file_path = os.path.join(base_dir, "welcome.txt")

#     print("Creating directory:", base_dir)

#     # 1. Create directory
#     mkdir_result = run_bash(f'mkdir "{base_dir}"')

#     print("MKDIR RESULT:", mkdir_result)

#     if not mkdir_result.get("success"):
#         return {
#             "messages": state["messages"] + [f"❌ Failed to create directory.\nError: {mkdir_result.get('error')}"],
#             "current_step": "onboarding"
#         }

#     # 2. Create welcome file
#     content = f"""
# Welcome {employee_name} 🎉

# We are excited to have you onboard!

# - HR Team
# """

#     write_result = write_file(file_path, content)

#     print("WRITE RESULT:", write_result)

#     if not write_result.get("success"):
#         return {
#             "messages": state["messages"] + [f"❌ Failed to create welcome file.\nError: {write_result.get('error')}"],
#             "current_step": "onboarding"
#         }

#     # 3. Verify using ls
#     ls_result = run_bash(f'dir "{base_dir}"' if os.name == "nt" else f'ls -la "{base_dir}"')

#     print("LS RESULT:", ls_result)

#     return {
#         "messages": state["messages"] + [
#             f"""✅ Onboarding completed for {employee_name}

# 📁 Directory created: {base_dir}

# 📄 Files:
# {ls_result.get("output")}
# """
#         ],
#         "current_step": "onboarding"
#     }








import os
from datetime import datetime

from app.tools.bash_tool import run_bash
from app.tools.file_tool import write_file
from app.db.connection import employees_collection
from app.utils.id_generator import generate_employee_id


async def onboarding_node(state):
    print("🟢 ONBOARDING NODE TRIGGERED")

    username = state.get("username", "employee")
    user_id = state.get("user_id")

    employee_name = username.replace(" ", "_").lower()

    # ✅ Generate employee ID
    employee_id = generate_employee_id()

    # ✅ File system path
    base_dir = os.path.join(os.getcwd(), "employees", employee_name)
    file_path = os.path.join(base_dir, "welcome.txt")

    print("Creating directory:", base_dir)

    # 1. Create directory
    mkdir_result = run_bash(f'mkdir "{base_dir}"')

    if not mkdir_result.get("success"):
        return {
            "messages": state["messages"] + ["❌ Failed to create employee directory."],
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
            "messages": state["messages"] + ["❌ Failed to create welcome file."],
            "current_step": "onboarding"
        }

    # 3. Store in MongoDB
    employee_doc = {
        "employee_id": employee_id,
        "user_id": user_id,
        "username": username,
        "directory": base_dir,
        "welcome_file": file_path,
        "created_at": datetime.utcnow()
    }

    await employees_collection.insert_one(employee_doc)

    # 4. Verify
    ls_cmd = f'dir "{base_dir}"' if os.name == "nt" else f'ls -la "{base_dir}"'
    ls_result = run_bash(ls_cmd)

    return {
        "messages": state["messages"] + [{
            "status": "success",
            "employee_id": employee_id,
            "username": username,
            "directory": base_dir,
            "files": ls_result.get("output")
        }],
        "current_step": "onboarding"
    }