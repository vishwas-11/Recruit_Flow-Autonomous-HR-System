SKILLS = [
    "python", "django", "fastapi",
    "react", "node", "mongodb",
    "java", "spring", "spring boot",
    "snowflake", "sql", "aws", "javascript",
    "js", "typescript", "docker", "kubernetes",
    "LLM", "NLP", "computer vision", "deep learning",
    "Langchain", "LangGraph", "transformers", "pytorch", "tensorflow",
]


def extract_skills(text: str):
    found = []

    for skill in SKILLS:
        if skill.lower() in text.lower():
            found.append(skill)

    return found