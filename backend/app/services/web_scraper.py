from firecrawl import Firecrawl
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("FIRECRAWL_API_KEY")

if not api_key:
    raise ValueError("FIRECRAWL_API_KEY is not set")

firecrawl = Firecrawl(api_key=api_key)


MAX_CHARS = 3000   

def fetch_pages(urls):
    pages = []

    for url in urls:
        try:
            print(f"Scraping: {url}")

            doc = firecrawl.scrape(url, formats=["markdown"])

            content = doc.markdown if hasattr(doc, "markdown") else ""

            #  LIMIT CONTENT SIZE
            if content:
                content = content[:MAX_CHARS]

            if content:
                pages.append(content)

        except Exception as e:
            print(f"Error fetching {url}: {e}")

    print("Fetched pages:", len(pages))
    return pages