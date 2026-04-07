from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = AsyncIOMotorClient(MONGO_URI)
db = client["recruit_flow"]

users_collection = db["users"]
chats_collection = db["chats"]
memory_collection = db["memory"]
employees_collection = db["employees"]