from app.tools.calendar_tools import create_event_tool
from app.agents.nodes.llm import llm
import json


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

    try:
        data = json.loads(res.content)
        date = data.get("date")
        time = data.get("time")
    except:
        return {
            "messages": state["messages"] + ["❌ Could not understand date/time."]
        }

    if not date or not time:
        return {
            "messages": state["messages"] + ["❌ Please provide both date and time."]
        }

    print("Extracted:", date, time)

    # 🔧 Create event
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