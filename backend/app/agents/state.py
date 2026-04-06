from typing import TypedDict, List, Dict

class State(TypedDict):
    messages: List[str]
    current_step: str
    candidate_data: Dict
    user_id: str   
    skills: List[str]
    chat_id: str