from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import chat, auth
from dotenv import load_dotenv
from app.api import admin
from app.api.calendar import router as calendar_router
from app.api.employee import router as employee_router

load_dotenv()

app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],   # allow all methods (GET, POST, OPTIONS)
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/auth")
app.include_router(chat.router, prefix="/chat")
app.include_router(admin.router, prefix="/admin")   
app.include_router(calendar_router, prefix="/calendar")
app.include_router(employee_router, prefix="/employee")


@app.get("/")
def root():
    return {"message": "RecruitFlow Backend Running"}
