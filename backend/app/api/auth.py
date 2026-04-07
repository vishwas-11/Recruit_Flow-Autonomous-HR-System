# from fastapi import APIRouter, HTTPException
# from passlib.context import CryptContext
# from jose import jwt
# import os
# from bson import ObjectId

# from app.models.auth import UserCreate, UserLogin
# from app.db.connection import users_collection

# from dotenv import load_dotenv

# load_dotenv()

# router = APIRouter()

# SECRET = os.getenv("JWT_SECRET")
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# def hash_password(password: str):
#     return pwd_context.hash(password)


# def verify_password(password: str, hashed: str):
#     return pwd_context.verify(password, hashed)


# def create_token(data: dict):
#     return jwt.encode(data, SECRET, algorithm="HS256")


# @router.post("/register")
# async def register(user: UserCreate):
#     existing_user = await users_collection.find_one({"username": user.username})

#     if existing_user:
#         raise HTTPException(status_code=400, detail="User already exists")

#     new_user = {
#         "username": user.username,
#         "password": hash_password(user.password)
#     }

#     result = await users_collection.insert_one(new_user)

#     return {"message": "User created", "user_id": str(result.inserted_id)}


# @router.post("/login")
# async def login(user: UserLogin):
#     db_user = await users_collection.find_one({"username": user.username})

#     if not db_user:
#         raise HTTPException(status_code=404, detail="User not found")

#     if not verify_password(user.password, db_user["password"]):
#         raise HTTPException(status_code=401, detail="Invalid credentials")

#     token = create_token({
#         "sub": user.username,
#         "user_id": str(db_user["_id"])
#     })

#     return {"access_token": token}







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


# ------------------------
# REGISTER
# ------------------------
@router.post("/register")
async def register(user: UserCreate):

    #  Check if email already exists
    existing_user = await users_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    #  Optional: ensure username is unique
    existing_username = await users_collection.find_one({"username": user.username})

    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")

    new_user = {
        "username": user.username,   #  used later in onboarding
        "email": user.email,
        "password": hash_password(user.password)
    }

    result = await users_collection.insert_one(new_user)

    return {
        "message": "User created successfully",
        "user_id": str(result.inserted_id)
    }


# ------------------------
# LOGIN (EMAIL BASED)
# ------------------------
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
        "username": db_user["username"]   #  IMPORTANT for onboarding
    })

    return {"access_token": token}