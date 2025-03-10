import bcrypt
import jwt
import datetime
from bson.objectid import ObjectId
from flask import jsonify , make_response
from utils.jwt_utils import generate_jwt_token, decode_jwt_token, hash_password, verify_password

SECRET_KEY = "mhdsf vcne fj  vs dvhehrhujqiwja  j   hfhwhbs  shbfu92bhwisvf9"

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
    # token = generate_jwt_token(user["email"])
    token =generate_jwt_token(user["_id"])
    
    user_data = {
        "name": user.get("name"),
        "email": user.get("email"),
        "phone": user.get("phone")
    }

    # Create response and store token in HTTP-only cookie
    response = make_response(jsonify({"message": "Login successful",
                                      "token" : token,
                                      "user" : user_data}))
    response.set_cookie("jwt", token, httponly=True, secure=True, samesite="Lax")  # Secure the cookie

    return response, 200

    
def logout_user():
    """Clears the JWT token from cookies (logout)."""
    response = make_response(jsonify({"message": "Logged out successfully"}))
    response.set_cookie("jwt", "", expires=0)  # Remove the cookie by setting expiration to zero
    return response, 200


def update_user(request, db):
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error" : "Unauthorized🫸. Token Required"}), 401
    
    user_id = decode_jwt_token(token)
    if not user_id:
        return jsonify({"error": "Invalid or expired token"}), 401
    
    users = db["users"]
    user = users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.json
    new_name = data.get("name")
    new_phone = data.get("phone")
    new_password = data.get("password")
    new_email = data.get("new_email")

    update_data = {}
    update_messages = []

    # Update only provided fields
    if new_name and new_name.strip() and new_name != user.get("name"):
        update_data["name"] = new_name
        update_messages.append("UserName updated Successfully.")
        
    if new_phone and new_phone.strip and new_phone != user.get("phone"):
        update_data["phone"] = new_phone
        update_messages.append("Phone Number updated Successfully.")
         
    if new_password and new_password.strip():
        # Check if the new password is actually different
        if not verify_password(new_password, user.get("password")):
            update_data["password"] = hash_password(new_password)
            update_messages.append("Password updated Successfully.")
        
    if new_email and new_email.strip() and new_email != user.get("email"):
        existing_user = users.find_one({"email": new_email})
        if existing_user:
            return jsonify({"error": "Email is already registered"}), 400
        update_data["email"] = new_email
        update_messages.append("Email updated Successfully.")


    if not update_data:
        return jsonify({"error": "No fields to update"}), 400

    # Update the user in MongoDB
    # users.update_one({"email": email}, {"$set": update_data})
    
    users.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
    return jsonify({"message": update_messages}), 200


