import jwt
import datetime
from bson import ObjectId
from flask import request
from werkzeug.security import generate_password_hash, check_password_hash

SECRET_KEY = "mhdsf vcne fj  vs dvhehrhujqiwja  j   hfhwhbs  shbfu92bhwisvf9"

def hash_password(password):
    """Hashes a password using Werkzeug's security module."""
    return generate_password_hash(password)

def verify_password(password, hashed_password):
    """Verifies a password against its hashed version."""
    return check_password_hash(hashed_password, password)
    
def generate_jwt_token(user_id):
    """Generates a JWT token storing user_id instead of email."""
    return jwt.encode(
        {"user_id": str(user_id), "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
        SECRET_KEY,
        algorithm="HS256"
    )

def decode_jwt_token(token):
    """Decodes a JWT token and extracts user_id."""
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded_token.get("user_id")  # This Returns user_id instead of email
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
def get_token_from_cookies():
    token = request.cookies.get("jwt")
    if not token:
        return None
    return decode_jwt_token(token)
    
      


