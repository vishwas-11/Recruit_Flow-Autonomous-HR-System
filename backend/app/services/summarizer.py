from app.agents.nodes.llm import llm


def _to_text(doc):
    if isinstance(doc, str):
        return doc
    if hasattr(doc, "page_content"):
        return doc.page_content
    if hasattr(doc, "content"):
        return doc.content
    return str(doc)


def _chunk_texts(texts, max_chars=3000):
    chunks = []
    current = []
    current_len = 0

    for text in texts:
        if not text:
            continue

        if current_len + len(text) + 2 > max_chars and current:
            chunks.append("\n\n".join(current))
            current = [text]
            current_len = len(text)
        else:
            current.append(text)
            current_len += len(text) + 2

    if current:
        chunks.append("\n\n".join(current))

    return chunks


def _summarize_text(text):
    prompt = f"""
You are a helpful assistant. Summarize the following text into a concise summary that captures the main points and important details.

{text}

Summary:
"""

    response = llm.invoke(prompt)
    return getattr(response, "content", "").strip()


def summarize_docs(docs):
    if not docs:
        return ""

    texts = [_to_text(doc).strip() for doc in docs if _to_text(doc).strip()]
    if not texts:
        return ""

    chunks = _chunk_texts(texts)
    partial_summaries = [_summarize_text(chunk) for chunk in chunks]

    if len(partial_summaries) == 1:
        return partial_summaries[0]

    return _summarize_text("\n\n".join(partial_summaries))