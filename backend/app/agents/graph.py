from langgraph.graph import StateGraph, END
from app.agents.state import State

from app.agents.nodes.interview_node import interview_node
from app.agents.nodes.tech_node import tech_node
from app.agents.nodes.research_node import research_node
from app.agents.nodes.onboarding_node import onboarding_node
from app.agents.nodes.unauthorized_node import unauthorized_node
from app.agents.nodes.scheduler_node import scheduler_node


def router(state):
    last_message = state["messages"][-1].lower()
    role = state.get("role", "user")

    #  ADMIN ONLY ACTIONS
    if any(k in last_message for k in [
        "find information",
        "who is",
        "tell me about",
        "search about"
    ]):
        if role != "admin":
            return "unauthorized"
        return "research"

    if any(k in last_message for k in [
        "onboard",
        "create employee",
        "setup employee",
        "hire",
        "new employee",
        "On board"
    ]):
        if role != "admin":
            return "unauthorized"
        return "onboarding"

    # Scheduler trigger
    if any(k in last_message for k in [
        "schedule",
        "book a slot",
        "set a meeting",
        "meeting",
        "interview schedule",
        "schedule an interview",
    ]):
        return "scheduler"

    #  USER FLOW → DO NOT RETURN "interview"
    # Let it fall back to default

    if state["current_step"] == "tech":
        return "tech"

    return END   #  THIS routes to interview automatically


async def run_graph(user_input: str, user_id: str, chat_id: str, username: str, role: str):
    graph = StateGraph(State)

    graph.add_node("interview", interview_node)
    graph.add_node("tech", tech_node)
    graph.add_node("research", research_node)
    graph.add_node("onboarding", onboarding_node)
    graph.add_node("unauthorized", unauthorized_node)
    graph.add_node("scheduler", scheduler_node)

    # ENTRY POINT
    graph.set_conditional_entry_point(
        router,
        {
            "research": "research",
            "tech": "tech",
            "onboarding": "onboarding",
            "unauthorized": "unauthorized",
            "scheduler": "scheduler",
            END: "interview"
        }
    )

    # TRANSITIONS FROM INTERVIEW
    graph.add_conditional_edges(
        "interview",
        router,
        {
            "research": "research",
            "tech": "tech",
            "onboarding": "onboarding",
            "unauthorized": "unauthorized",
            "scheduler": "scheduler",
            END: END
        }
    )

    # FINISH NODES
    graph.set_finish_point("unauthorized")
    graph.set_finish_point("tech")
    graph.set_finish_point("research")
    graph.set_finish_point("onboarding")
    graph.set_finish_point("scheduler")

    app = graph.compile()

    result = await app.ainvoke({
        "messages": [user_input],
        "current_step": "interview",
        "candidate_data": {},
        "user_id": user_id,
        "chat_id": chat_id,
        "skills": [],
        "username": username,
        "role": role
    })

    return result["messages"][-1]