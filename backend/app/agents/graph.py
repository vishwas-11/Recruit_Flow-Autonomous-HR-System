# from langgraph.graph import StateGraph
# from app.agents.state import State
# from app.agents.nodes.interview_node import interview_node
# from app.agents.nodes.tech_node import tech_node


# def router(state: State):
#     if state["current_step"] == "tech":
#         return "tech"
#     return "interview"


# def run_graph(user_input: str, user_id: str):
#     graph = StateGraph(State)

#     graph.add_node("interview", interview_node)
#     graph.add_node("tech", tech_node)

#     graph.set_entry_point("interview")

#     graph.add_conditional_edges(
#         "interview",
#         router,
#         {
#             "interview": "interview",
#             "tech": "tech"
#         }
#     )

#     #  END FLOW HERE
#     graph.set_finish_point("interview")
#     graph.set_finish_point("tech")

#     app = graph.compile()

#     result = app.invoke({
#         "messages": [user_input],
#         "current_step": "interview",
#         "candidate_data": {},
#         "user_id": user_id
#     })

#     return result["messages"][-1]






from langgraph.graph import StateGraph, END
from app.agents.state import State
from app.agents.nodes.interview_node import interview_node
from app.agents.nodes.tech_node import tech_node


def router(state: State):
    if state["current_step"] == "tech":
        return "tech"
    return END


async def run_graph(user_input: str, user_id: str, chat_id: str):
    graph = StateGraph(State)

    graph.add_node("interview", interview_node)
    graph.add_node("tech", tech_node)

    graph.set_entry_point("interview")

    graph.add_conditional_edges(
        "interview",
        router,
        {
            "tech": "tech",
            END: END
        }
    )

    graph.set_finish_point("tech")

    app = graph.compile()

    result = await app.ainvoke({
        "messages": [user_input],
        "current_step": "interview",
        "candidate_data": {},
        "user_id": user_id,
        "chat_id": chat_id,   # ✅ ADD THIS
        "skills": []
    })

    return result["messages"][-1]