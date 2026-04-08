async def unauthorized_node(state):
    return {
        "messages": state["messages"] + [
            "❌ You do not have permission to perform this action."
        ],
        "current_step": state["current_step"]
    }