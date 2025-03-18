from functools import wraps
from flask import request, jsonify
from .jwt_utils import decode_jwt_token 
from bson import ObjectId
from database.mongo import mongo

def authenticate(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):

         

        token = request.cookies.get("jwt") 

        if not token:
            return jsonify({"success":False, "message": "Please Login."}), 401
        
        try:
            user_id = decode_jwt_token(token) 
            if not user_id:
                print("No user ID ")
                return jsonify({"success":False, "message": "Please Login."}), 401
            db = mongo.db
            users = db["users"]
            user = users.find_one(
                {"_id": ObjectId(user_id)},
                {"_id": 0, "name": 1, "email": 1, "phone": 1, "files": 1} 
            )
            if not user:
                print("No user")
                return jsonify({"success":False,"message": "User not found"}), 404
        except Exception as e:
            print("Exceptionc")
            return jsonify({"success":False, "message": "Please Login."}), 401
        
        return f(user,  *args, **kwargs)
    
    return decorated_function