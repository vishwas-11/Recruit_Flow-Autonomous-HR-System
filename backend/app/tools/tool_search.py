def tool_search(task: str):
    
    # Decides which tool to use
    

    if "schedule" in task or "book" in task:
        return "computer_use"

    return "none"