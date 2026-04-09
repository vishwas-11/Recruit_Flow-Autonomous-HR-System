import json
from fastapi import APIRouter, Depends
from uuid import uuid4

from app.agents.graph import run_graph
from app.utils.auth import get_current_user
from app.services.memory_service import save_message, get_chat_history
from app.models.chat import ChatRequest

router = APIRouter()


@router.post("/")
async def chat(req: ChatRequest, user=Depends(get_current_user)):
    message = req.message
    user_id = user["user_id"]
    username = user["username"]

    # Save user message
    await save_message(user_id, "user", message)

    # Optional history
    history = await get_chat_history(user_id)

    chat_id = str(uuid4())
    role = user["role"]
    # Pass username into graph
    response = await run_graph(
        message,
        user_id,
        chat_id,
        username,
        role
    )

    # Save assistant response
    # msg_type = "general"
    # if isinstance(response, dict) and "skills" in response:
    #     msg_type = "research"
    # await save_message(user_id, "assistant", str(response), msg_type)

    # # CLEAN RESPONSE (NO STRINGIFIED JSON)
    # if isinstance(response, dict):
    #     return response

    # return {
    #     "response": str(response)
    # }



    msg_type = "general"
    if isinstance(response, dict) and "skills" in response:
        msg_type = "research"

    await save_message(
        user_id,
        "assistant",
        json.dumps(response) if isinstance(response, dict) else str(response),
        msg_type
    )

    print("RESPONSE TYPE:", type(response))
    # ALWAYS RETURN SAME SHAPE
    return {
        "response": response
    }