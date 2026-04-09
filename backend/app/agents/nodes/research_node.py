import json
import re

from app.services.web_search import search_web
from app.services.web_scraper import fetch_pages
from app.services.text_processor import process_docs
from app.agents.nodes.llm import llm


def extract_json(text: str):
    """
    Extract JSON safely from LLM output
    """
    try:
        # Direct parse (best case)
        return json.loads(text)
    except:
        pass

    try:
        # Remove ```json ``` wrappers if present
        text = re.sub(r"```json|```", "", text).strip()

        # Extract first JSON object
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group())
    except Exception as e:
        print("JSON extraction failed:", e)

    return None


async def research_node(state):
    print("RESEARCH NODE TRIGGERED")

    user_query = state["messages"][-1]

    # 1. Web Search
    urls = search_web(user_query)[:3]
    print("URLs:", urls)

    if not urls:
        return {
            "messages": state["messages"] + ["No relevant information found."],
            "current_step": "research",
            "research_data": {}
        }

    # 2. Scraping
    pages = fetch_pages(urls)

    if not pages:
        return {
            "messages": state["messages"] + ["Failed to fetch data from sources."],
            "current_step": "research",
            "research_data": {}
        }

    # 3. Processing
    docs = process_docs(pages)

    if not docs:
        return {
            "messages": state["messages"] + ["No usable content found."],
            "current_step": "research",
            "research_data": {}
        }

    #  LIMIT CONTENT (VERY IMPORTANT FOR SPEED)
    limited_text = "\n\n".join([
        doc.page_content for doc in docs if hasattr(doc, "page_content")
    ])[:4000]

    # 4. LLM CALL (STRICT)
    prompt = f"""
You are an AI recruiter assistant.

Extract structured candidate/company info from the data.

Return ONLY valid JSON. No explanation.

FORMAT:
{{
  "name": "",
  "current_company": "",
  "skills": [],
  "experience_summary": "",
  "notable_information": "",
  "sources": {urls}
}}

Rules:
- If info not found → keep empty
- Do NOT hallucinate
- Ignore navigation/menu content
- Keep summary short and useful for HR

DATA:
{limited_text}
"""

    res = llm.invoke(prompt)

    print("LLM RAW OUTPUT:", res.content)  #  DEBUG

    structured = extract_json(str(res.content))

    if not structured:
        print(" Falling back due to invalid JSON")

        structured = {
            "name": "",
            "current_company": "",
            "skills": [],
            "experience_summary": limited_text[:800],
            "notable_information": "Unable to structure properly. Check sources.",
            "sources": urls
        }

    # ✅ RETURN CLEAN DICT (NOT STRING)
    return {
        "messages": state["messages"] + [structured],
        "current_step": "research",
        "research_data": structured
    }