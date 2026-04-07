# from fastapi import Depends, HTTPException
# from fastapi.security import HTTPBearer
# from jose import jwt
# import os
# from dotenv import load_dotenv 

# load_dotenv()

# security = HTTPBearer()
# SECRET = os.getenv("JWT_SECRET")


# def get_current_user(token=Depends(security)):
#     try:
#         payload = jwt.decode(token.credentials, SECRET, algorithms=["HS256"])
#         return payload
#     except:
#         raise HTTPException(status_code=401, detail="Invalid token")




from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
import os

from dotenv import load_dotenv

load_dotenv()

security = HTTPBearer()
SECRET = os.getenv("JWT_SECRET")


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])

        return {
            "user_id": payload.get("user_id"),
            "email": payload.get("sub"),
            "username": payload.get("username")   #  ADD THIS
        }

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")