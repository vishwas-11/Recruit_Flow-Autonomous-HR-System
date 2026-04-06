from fastapi import APIRouter, Depends
from app.agents.graph import run_graph
from app.utils.auth import get_current_user
from app.db.connection import chats_collection
from app.services.memory_service import save_message, get_chat_history
from app.models.chat import ChatRequest
from uuid import uuid4

router = APIRouter()


@router.post("/")
async def chat(req: ChatRequest, user=Depends(get_current_user)):

    message = req.message

    user_id = user["user_id"]

    # Save user message
    await save_message(user_id, "user", message)

    # Get history
    history = await get_chat_history(user_id)

    chat_id = str(uuid4())

    response = await run_graph(message, user_id, chat_id)

    # Save bot response
    await save_message(user_id, "assistant", response)

    return {"response": response}