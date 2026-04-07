from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

def process_docs(texts):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100
    )

    docs = []

    for text in texts:
        chunks = splitter.split_text(text)
        docs.extend([Document(page_content=c) for c in chunks])

    return docs