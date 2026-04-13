from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from jose import jwt
import os

from app.models.auth import UserCreate, UserLogin
from app.db.connection import users_collection

from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

SECRET = os.getenv("JWT_SECRET")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ------------------------
# Password Helpers
# ------------------------
def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str):
    return pwd_context.verify(password, hashed)


# ------------------------
# JWT Token
# ------------------------
def create_token(data: dict):
    return jwt.encode(data, SECRET, algorithm="HS256")




@router.post("/register")
async def register(user: UserCreate):

    existing_user = await users_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    if user.role not in ["admin", "user"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    new_user = {
        "username": user.username,
        "email": user.email,
        "password": hash_password(user.password),
        "role": user.role   # ✅ STORE ROLE
    }

    result = await users_collection.insert_one(new_user)

    return {
        "message": "User created",
        "user_id": str(result.inserted_id)
    }


@router.post("/login")
async def login(user: UserLogin):

    db_user = await users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({
        "sub": user.email,
        "user_id": str(db_user["_id"]),
        "username": db_user["username"],
        "role": db_user["role"]   # ✅ INCLUDE ROLE
    })

    return {"access_token": token}