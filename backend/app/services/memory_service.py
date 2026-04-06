from app.db.connection import chats_collection
from app.db.connection import memory_collection
from datetime import datetime


async def save_message(user_id: str, role: str, content: str):
    await chats_collection.insert_one({
        "user_id": user_id,
        "role": role,
        "content": content,
        "timestamp": datetime.utcnow()
    })


async def get_chat_history(user_id: str, limit: int = 10):
    cursor = chats_collection.find(
        {"user_id": user_id}
    ).sort("timestamp", -1).limit(limit)

    messages = []
    async for doc in cursor:
        messages.append(doc["content"])

    return list(reversed(messages))



async def update_user_memory(user_id: str, chat_id: str, new_skills: list):
    existing = await memory_collection.find_one({
        "user_id": user_id,
        "chat_id": chat_id
    })

    if existing:
        updated_skills = list(set(existing.get("skills", []) + new_skills))
        await memory_collection.update_one(
            {"user_id": user_id, "chat_id": chat_id},
            {"$set": {"skills": updated_skills}}
        )
    else:
        await memory_collection.insert_one({
            "user_id": user_id,
            "chat_id": chat_id,
            "skills": new_skills
        })


    print("Updating memory for:", user_id, new_skills)

async def get_user_memory(user_id: str, chat_id: str):
    data = await memory_collection.find_one({
        "user_id": user_id,
        "chat_id": chat_id
    })
    return data if data else {"skills": []}
