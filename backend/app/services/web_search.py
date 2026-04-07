from tavily import TavilyClient
import os
from dotenv import load_dotenv

load_dotenv()

tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

def search_web(query: str, max_results: int = 3):
    try:
        results = tavily.search(query=query, max_results=max_results)
        urls = [r["url"] for r in results.get("results", [])]
        return urls[:5]
    except Exception as e:
        print("Search error:", e)
        return []