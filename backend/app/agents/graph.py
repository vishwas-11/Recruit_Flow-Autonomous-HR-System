# from langgraph.graph import StateGraph, END
# from app.agents.state import State
# from app.agents.nodes.interview_node import interview_node
# from app.agents.nodes.tech_node import tech_node
# from app.agents.nodes.research_node import research_node


# def router(state):
#     last_message = state["messages"][-1]

#     #  Ensure safe string handling
#     if isinstance(last_message, str):
#         msg = last_message.lower()

#         #  Research trigger
#         if any(keyword in msg for keyword in [
#             "find information",
#             "find info",
#             "who is",
#             "tell me about",
#             "search about",
#             "information about"
#         ]):
#             return "research"

#     #  Tech step handling
#     if state.get("current_step") == "tech":
#         return "tech"

#     print("Routing decision:", last_message)
#     return END


# async def run_graph(user_input: str, user_id: str, chat_id: str):
#     graph = StateGraph(State)

#     # Nodes
#     graph.add_node("interview", interview_node)
#     graph.add_node("tech", tech_node)
#     graph.add_node("research", research_node)

#     # Entry routing
#     graph.set_conditional_entry_point(
#         router,
#         {
#             "research": "research",
#             "tech": "tech",
#             END: "interview"
#         }
#     )

#     # Transitions
#     graph.add_conditional_edges(
#         "interview",
#         router,
#         {
#             "research": "research",
#             "tech": "tech",
#             END: END
#         }
#     )

#     # Finish points
#     graph.set_finish_point("tech")
#     graph.set_finish_point("research")

#     app = graph.compile()

#     # Run graph
#     result = await app.ainvoke({
#         "messages": [user_input],
#         "current_step": "interview",
#         "candidate_data": {},
#         "user_id": user_id,
#         "chat_id": chat_id,
#         "skills": []
#     })

#     final_output = result["messages"][-1]

#     #  IMPORTANT: return clean JSON if dict
#     if isinstance(final_output, dict):
#         return final_output

#     return str(final_output)





from langgraph.graph import StateGraph, END
from app.agents.state import State

from app.agents.nodes.interview_node import interview_node
from app.agents.nodes.tech_node import tech_node
from app.agents.nodes.research_node import research_node
from app.agents.nodes.onboarding_node import onboarding_node


def router(state):
    last_message = state["messages"][-1].lower()

    #  Research trigger
    if any(k in last_message for k in [
        "find information",
        "who is",
        "tell me about",
        "search about"
    ]):
        return "research"

    #  Onboarding trigger
    if any(k in last_message for k in [
        "onboard",
        "create employee",
        "setup employee",
        "hire",
        "new employee"
    ]):
        return "onboarding"

    if state["current_step"] == "tech":
        return "tech"

    return END



async def run_graph(user_input: str, user_id: str, chat_id: str, username: str):
    graph = StateGraph(State)

    graph.add_node("interview", interview_node)
    graph.add_node("tech", tech_node)
    graph.add_node("research", research_node)
    graph.add_node("onboarding", onboarding_node)

    graph.set_conditional_entry_point(
        router,
        {
            "research": "research",
            "tech": "tech",
            "onboarding": "onboarding",
            END: "interview"
        }
    )

    graph.add_conditional_edges(
        "interview",
        router,
        {
            "research": "research",
            "tech": "tech",
            "onboarding": "onboarding",
            END: END
        }
    )

    graph.set_finish_point("tech")
    graph.set_finish_point("research")
    graph.set_finish_point("onboarding")

    app = graph.compile()

    result = await app.ainvoke({
        "messages": [user_input],
        "current_step": "interview",
        "candidate_data": {},
        "user_id": user_id,
        "chat_id": chat_id,
        "skills": [],
        "username": username   
    })

    return result["messages"][-1]