import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash

SECRET_KEY = "project Kar Mah Teja"

def hash_password(password):
    """Hashes a password using Werkzeug's security module."""
    return generate_password_hash(password)

def verify_password(password, hashed_password):
    """Verifies a password against its hashed version."""
    return check_password_hash(hashed_password, password)

def generate_jwt_token(email): 
    """Generates a JWT token for a user."""
    return jwt.encode(
        {"email": email, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
        SECRET_KEY,
        algorithm="HS256"
    )

def decode_jwt_token(token):
    """Decodes a JWT token to verify user authentication."""
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

