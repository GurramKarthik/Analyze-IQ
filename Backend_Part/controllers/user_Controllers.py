from flask import jsonify , make_response
from utils.jwt_utils import generate_jwt_token, hash_password, verify_password
import cloudinary.uploader
from flask import  jsonify
from database.mongo import mongo

def getDB():
    return mongo.db


def register_user(request):
    data = request.json
    db = getDB()
    users = db["users"]

    if users.find_one({"email": data.get("email")}):
        return jsonify({"success":False, "message": "User already exists"}), 400

    hashed_password = hash_password(data.get("password"))

    user = {
        "name": data.get("name"),
        "email": data.get("email"),
        "phone": data.get("phone"),
        "password": hashed_password,
        "files" : []
    }

    users.insert_one(user)

    return jsonify({"success":True, "message": "User registered successfully"}), 201

def login_user(request):
    data = request.json
    db = getDB()
    users = db["users"]

    user = users.find_one({"email": data.get("email")})
    
    if not user:
        return jsonify({"success":False, "message": "User not found"}), 404
    
    if not verify_password(data.get("password"), user["password"]):
        return jsonify({"success":False, "message": "Invalid password"}), 401
    
    token =generate_jwt_token(user["_id"])
    
    user_data = {
        "name": user.get("name"),
        "email": user.get("email"),
        "phone": user.get("phone"),
        "files": user.get("files")
    }


    
    response = make_response(jsonify({
        "success":True,"message": "Login successful","user" : user_data}))
    response.set_cookie("jwt", token, httponly=True, samesite="Lax")    # fro loaclly http req
    # response.set_cookie("jwt", token,httponly=False, secure=True, samesite="None")   # fro https reqs only


    return response, 200
    
def logout_user():
    response = make_response(jsonify({"success":True,"message": "Logged out successfully"}))
    response.set_cookie("jwt", "", expires=0)  
    return response, 200

def update_user(request, user):
    try:

        data = request.json
        new_name = data.get("name")
        new_phone = data.get("phone")
        new_password = data.get("password")
        new_email = data.get("new_email")

        update_data = {}
        update_messages = []

        db = getDB()
        users = db['user']

        if new_name and new_name.strip() and new_name != user.get("name"):
            update_data["name"] = new_name
            update_messages.append("UserName updated Successfully.")
            
        if new_phone and new_phone.strip and new_phone != user.get("phone"):
            update_data["phone"] = new_phone
            update_messages.append("Phone Number updated Successfully.")
            
        if new_password and new_password.strip():
            if not verify_password(new_password, user.get("password")):
                update_data["password"] = hash_password(new_password)
                update_messages.append("Password updated Successfully.")
            
        if new_email and new_email.strip() and new_email != user.get("email"):
            existing_user = users.find_one({"email": new_email})
            if existing_user:
                return jsonify({"success":False, "message": "Email is already registered"}), 400
            update_data["email"] = new_email
            update_messages.append("Email updated Successfully.")


        if not update_data:
            return jsonify({"success":False, "message": "No fields to update"}), 400

        users.update_one({"email": user["email"]}, {"$set": update_data})
        return jsonify({"success":True, "message": update_messages}), 200
    except Exception as e:
        return jsonify({"success":False, "message": str(e)}), 200
    

def FileUpload(request, user):  
    try:
        if "file" not in request.files:
            return jsonify({"success": False, "error": "No file part in request"}), 400

        file = request.files["file"]

        if not file or file.filename.strip() == "":
            return jsonify({ "success":False, "message": "Please provide a file in CSV format."}), 400
                
        try:
            upload_result = cloudinary.uploader.upload(file, resource_type="raw")
            file_url = upload_result.get("secure_url")
            if not file_url:
                raise ValueError("Cloudinary did not return a file URL")
        except Exception as e:
            return jsonify({"success":False, "message": "Unexpected error during file upload", "details": str(e)}), 500
        
        db = getDB()
        db["users"].update_one(
            {"email": user["email"]},
            {"$push": {"files": {"filename": file.filename, "url": file_url}}}
        )
        return jsonify({"success":True, "message": "File uploaded successfully", "file_url": file_url}), 200
    except Exception as e:
        return jsonify({"success":False, "message": str(e)}), 200

