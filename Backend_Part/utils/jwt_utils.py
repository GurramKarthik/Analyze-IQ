import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
load_dotenv()
import os


SECRET_KEY = os.getenv("SECRET_KEY")

def hash_password(password):
    return generate_password_hash(password)

def verify_password(password, hashed_password):
    return check_password_hash(hashed_password, password)
    
def generate_jwt_token(user_id):
    return jwt.encode(
        {"user_id": str(user_id), "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
        SECRET_KEY,
        algorithm="HS256"
    )

def decode_jwt_token(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"]).get("user_id")
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

