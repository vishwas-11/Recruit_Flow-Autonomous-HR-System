from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import chat, auth
from dotenv import load_dotenv
from app.api import admin
from app.api.calendar import router as calendar_router

load_dotenv()

app = FastAPI()


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],   # allow all methods (GET, POST, OPTIONS)
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/auth")
app.include_router(chat.router, prefix="/chat")
app.include_router(admin.router, prefix="/admin")   
app.include_router(calendar_router, prefix="/calendar")


@app.get("/")
def root():
    return {"message": "RecruitFlow Backend Running"}