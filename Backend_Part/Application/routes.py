from flask import request, jsonify
from controllers.user_Controllers import register_user, login_user, logout_user, update_user , SECRET_KEY
from utils.jwt_utils import decode_jwt_token , ObjectId
import jwt
# Hai
import os
import pandas as pd
#from langchain_community.chat_models import ChatGroq
from langchain_groq import ChatGroq
from pandasai import SmartDataframe
import duckdb
duckdb.close()  # Force DuckDB to close before starting
import requests
import cloudinary.uploader
from dotenv import load_dotenv
# Load environment variables from .env file
load_dotenv()
#print("GROQ_API_KEY:", os.getenv("GROQ_API_KEY"))

groq_api_key = os.getenv("GROQ_API_KEY")
llm = ChatGroq(temperature=0, groq_api_key=groq_api_key, model_name="llama-3.3-70b-versatile")

def setup_routes(app, db):
    @app.route("/CSV", methods=["GET"])
    def home():
        return jsonify({"message": "Welcome to CSV Analyzer"})

    @app.route("/CSV/register", methods=["POST"])
    def register():
        return register_user(request, db)

    @app.route("/CSV/login", methods=["POST"])
    def login():
        return login_user(request, db)
    
    @app.route("/CSV/logout", methods=["GET"])
    def logout():
        return logout_user()
    
    @app.route("/CSV/update" , methods=["PUT"])
    def update():
        return update_user(request , db)
    
    
    @app.route("/CSV/dashboard", methods=["GET"])
    def dashboard():
        return jsonify({"message": "Welcome to CSV Analyzer Dashboard"})
    
    @app.route("/CSV/files", methods=["GET"])
    def files():
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": " Unauthorization🫸 Header. Token Required "}), 401
        user_id = decode_jwt_token(token)
        if not user_id:
            return jsonify({"error": "Invalid Token🙈"}), 401
        
        user = db["users"].find_one({"_id": ObjectId(user_id)})
        
        if not user or "files" not in user or len(user["files"]) == 0:
            return jsonify({"error": "No files uploaded by user"}), 404
        
        return jsonify({"files": user["files"]}), 200
    
     

    @app.route("/CSV/upload", methods=["POST"])
    def upload():
        print("Received request with content type:", request.content_type)  # Debugging

        if "multipart/form-data" not in request.content_type:
            return jsonify({"error": "Invalid content type, expected multipart/form-data"}), 415

        # Get JWT token from headers
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Authentication token is missing"}), 401

        try:
            decoded_token = jwt.decode(token.split("Bearer ")[-1], SECRET_KEY, algorithms=["HS256"])
            user_id = decoded_token.get("user_id")
            if not user_id:
                return jsonify({"error": "Invalid token"}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        # Find user by ObjectId
        user = db["users"].find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        if "file" not in request.files:
            print("No file part in request")  # Debugging
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        print("File received:", file.filename)  # Debugging

        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        try:
            # Upload file to Cloudinary
            upload_result = cloudinary.uploader.upload(file, resource_type="raw")
            file_url = upload_result.get("secure_url")
            if not file_url:
                raise ValueError("Cloudinary did not return a file URL")
        except cloudinary.exceptions.Error as e:
            return jsonify({"error": "Cloudinary upload failed", "details": str(e)}), 500
        except Exception as e:
            return jsonify({"error": "Unexpected error during file upload", "details": str(e)}), 500

        # Store file details in MongoDB
        db["users"].update_one(
            {"_id": ObjectId(user_id)},
            {"$push": {"files": {"filename": file.filename, "url": file_url}}}
        )

        return jsonify({"message": "File uploaded successfully", "file_url": file_url}), 200

    
    
    @app.route("/CSV/chat", methods=["POST"])
    def chat():

        # Get JWT token from request headers
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Unauthorized. Token required"}), 401

        # Decode JWT token to get user_id
        user_id = decode_jwt_token(token)
        if not user_id:
            return jsonify({"error": "Invalid or expired token"}), 401

        # Fetch user's latest file from MongoDB using user_id
        user = db["users"].find_one({"_id": ObjectId(user_id)})

        if not user or "files" not in user or len(user["files"]) == 0:
            return jsonify({"error": "No files uploaded"}), 400

        file_url = user["files"][-1]["url"]  # Get the latest file

        # Download the CSV file from Cloudinary
        response = requests.get(file_url)
        if response.status_code != 200:
            return jsonify({"error": "Failed to download file"}), 500

        # Save it temporarily
        temp_file_path = "temp.csv"
        with open(temp_file_path, "wb") as f:
            f.write(response.content)

        # Read CSV into DataFrame
        df = pd.read_csv(temp_file_path)

        # Process user query
        data = request.json
        query = data.get("query")

        # Initialize LLM
        llm = ChatGroq(temperature=0, groq_api_key=os.getenv("GROQ_API_KEY"), model_name="llama-3.3-70b-versatile")
        
        query_engine = SmartDataframe(df, config={"llm": llm, "enable_cache": False})
        answer = query_engine.chat(query)
        
        return jsonify({"query": query, "answer": answer}), 200
    
    if __name__ == "__main__":
        app.run(debug=True)
