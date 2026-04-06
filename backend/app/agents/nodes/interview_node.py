# from app.agents.nodes.llm import llm
# from app.services.skill_extractor import extract_skills


# def interview_node(state):
#     user_message = state["messages"][-1]

#     skills = extract_skills(user_message)

#     if skills:
#         return {
#             "messages": state["messages"] + [
#                 f"You mentioned {skills}. Would you like a technical interview?"
#             ],
#             "current_step": "interview"
#         }


#     print("Calling LLM with:", user_message)

#     response = llm.invoke([
#         {
#             "role": "system",
#             "content": (
#                 "You are an HR interviewer.\n"
#                 "Ask ONLY ONE short question at a time.\n"
#                 "Keep response under 2 sentences.\n"
#                 "Do NOT generate multiple questions.\n"
#             )
#         },
#         {"role": "user", "content": user_message}
#     ])


#     print("LLM Response:", response.content)

#     return {
#         "messages": state["messages"] + [response.content[:200]],
#         "current_step": "interview"
#     }







from app.agents.nodes.llm import llm
from app.services.skill_extractor import extract_skills
from app.services.memory_service import update_user_memory, get_user_memory


async def interview_node(state):
    user_message = state["messages"][-1]
    user_id = state["user_id"]
    chat_id = state["chat_id"]

    # 1. Extract new skills
    new_skills = extract_skills(user_message)

    print("Extracted skills:", new_skills)

    if new_skills:
        await update_user_memory(user_id, chat_id, new_skills)

    # 2. Get full memory
    memory = await get_user_memory(user_id, chat_id)
    skills = memory.get("skills", [])

    # 3. Decision: handoff or continue
    if skills and len(skills) >= 2:
        return {
            "messages": state["messages"] + [
                f"Great, I see you have experience in {skills}. Let's move to technical round."
            ],
            "current_step": "tech",
            "skills": skills
        }

    # 4. Continue HR interview (memory-aware)
    response = llm.invoke([
        {
            "role": "system",
            "content": (
                f"You are an HR interviewer.\n"
                f"Candidate skills so far: {skills}\n"
                "Ask ONE short follow-up question (max 20 words).\n"
            )
        },
        {"role": "user", "content": user_message}
    ])

    return {
        "messages": state["messages"] + [response.content],
        "current_step": "interview",
        "skills": skills
    }