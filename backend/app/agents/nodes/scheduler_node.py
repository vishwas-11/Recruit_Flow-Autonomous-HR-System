from app.tools.calendar_tools import create_event_tool
from app.agents.nodes.llm import llm
import json
import re


def _extract_json_text(text: str) -> str:
    if not isinstance(text, str):
        return ""

    clean_text = text.strip()
    fence_match = re.search(r"```(?:json)?\s*(\{.*\})\s*```", clean_text, re.DOTALL)
    if fence_match:
        return fence_match.group(1)

    return clean_text


async def scheduler_node(state):
    print("🗓️ SCHEDULER NODE TRIGGERED")

    user_message = state["messages"][-1]
    user_id = state.get("user_id")

    #  Extract date/time
    prompt = f"""
Extract scheduling info.

Return ONLY JSON:
{{
  "date": "",
  "time": ""
}}

Message:
{user_message}
"""

    res = await llm.ainvoke(prompt)

    content = getattr(res, "content", "")
    raw_json = _extract_json_text(content)

    try:
        data = json.loads(raw_json)
        date = data.get("date")
        time = data.get("time")
    except (json.JSONDecodeError, TypeError) as e:
        print("scheduler_node JSON parse failed:", e)
        print("raw response content:", repr(content))
        return {
            "messages": state["messages"] + [
                "❌ Could not understand date/time. Please provide a clear date and time."
            ]
        }

    if not date or not time:
        return {
            "messages": state["messages"] + ["❌ Please provide both date and time."]
        }

    print("Extracted:", date, time)

    #  Create event
    result = await create_event_tool(user_id, date, time)

    if not result["success"]:
        return {
            "messages": state["messages"] + [f"❌ {result['message']}"]
        }

    return {
        "messages": state["messages"] + [
            f"✅ Interview scheduled on {date} at {time}"
        ]
    }