import subprocess


def run_bash(command: str):
    try:
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True
        )

        return {
            "success": result.returncode == 0,
            "output": result.stdout.strip(),
            "error": result.stderr.strip()
        }

    except Exception as e:
        return {
            "success": False,
            "output": "",
            "error": str(e)
        }