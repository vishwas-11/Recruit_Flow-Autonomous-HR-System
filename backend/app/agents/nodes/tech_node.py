# from app.agents.nodes.llm import llm


# def tech_node(state):
#     user_message = state["messages"][-1]

#     response = llm.invoke([
#         {
#             "role": "system",
#             "content": (
#                 "You are a technical interviewer.\n"
#                 "Ask ONE concise technical question.\n"
#                 "Keep it short.\n"
#             )
#         },
#         {"role": "user", "content": user_message}
#     ])

#     return {
#         "messages": state["messages"] + [response.content],
#         "current_step": "tech"
#     }




from app.agents.nodes.llm import llm


def tech_node(state):
    user_message = state["messages"][-1]
    skills = state.get("skills", [])

    response = llm.invoke([
        {
            "role": "system",
            "content": (
                f"You are a senior technical interviewer.\n"
                f"Candidate skills: {skills}\n"
                f"Ask ONE short challenging technical question under 20 words.\n"
            )
        },
        {"role": "user", "content": user_message}
    ])

    return {
        "messages": state["messages"] + [response.content],
        "current_step": "tech"
    }