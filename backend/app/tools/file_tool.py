import os


def write_file(path: str, content: str):
    try:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)

        return {"success": True}

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }