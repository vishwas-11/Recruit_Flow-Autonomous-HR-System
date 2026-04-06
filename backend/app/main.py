from fastapi import FastAPI
from app.api import chat, auth
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.include_router(auth.router, prefix="/auth")
app.include_router(chat.router, prefix="/chat")


@app.get("/")
def root():
    return {"message": "RecruitFlow Backend Running"}