import bcrypt
import jwt
import datetime
from flask import jsonify , make_response
from utils.jwt_utils import generate_jwt_token, hash_password, verify_password

SECRET_KEY = "project Kar Mah Teja"

def register_user(request, db):
    data = request.json
    users = db["users"]

    # Check if the email already exists
    if users.find_one({"email": data.get("email")}):
        return jsonify({"error": "User already exists"}), 400

    # Hash the password
    hashed_password = hash_password(data.get("password"))

    # Store all user details
    user = {
        "name": data.get("name"),
        "email": data.get("email"),
        "phone": data.get("phone"),
        "password": hashed_password,
        
        "files" : []
    }

    # Insert into MongoDB
    users.insert_one(user)

    return jsonify({"message": "User registered successfully"}), 201


def login_user(request, db):
    data = request.json
    users = db["users"]

    # Find user by email
    user = users.find_one({"email": data.get("email")})
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Verify password (ensure correct parameter order)
    if not verify_password(data.get("password"), user["password"]):
        return jsonify({"error": "Invalid password"}), 401
    
    # Generate token
    token = generate_jwt_token(user["email"])
    
    user_data = {
        "name": user.get("name"),
        "email": user.get("email"),
        "phone": user.get("phone")
    }

    # Create response and store token in HTTP-only cookie
    response = make_response(jsonify({"message": "Login successful",
                                      "user" : user_data}))
    response.set_cookie("jwt", token, httponly=True, secure=True, samesite="Lax")  # Secure the cookie

    return response, 200

    


def logout_user():
    """Clears the JWT token from cookies (logout)."""
    response = make_response(jsonify({"message": "Logged out successfully"}))
    response.set_cookie("jwt", "", expires=0)  # Remove the cookie by setting expiration to zero
    return response, 200

