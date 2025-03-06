from flask import request, jsonify
from controllers.user_Controllers import register_user, login_user, logout_user, update_user

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
    
    @app.route("/CSV/logout", methods=["POST"])
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
        user_email = request.args.get("email")

        if not user_email:
            return jsonify({"error": "Email is required"}), 400

        user = db["users"].find_one({"email": user_email})

        if not user or "files" not in user or len(user["files"]) == 0:
            return jsonify({"error": "No files found for this user"}), 404

        return jsonify({"files": user["files"]}), 200
    
    
    # @app.route("/CSV/chat", methods=["GET"])
    # def chat():
    #     return jsonify({"message": "Welcome to CSV Analyzer Chat"})

    
    # @app.route("/CSV/upload" , methods = ["GET"])
    # def upload():
    #     return jsonify({"message" : "File uploaded Successfully",
    #                     "Asked Query is" : query,
    #                     "answer to Query" : answer})
    #     #return jsonify(df.to_dict(orient="records"))
    #     # Load CSV file
    # df = pd.read_csv("drug200.csv")
    
    # # Retrieve API key from environment variable
    # groq_api_key = os.getenv("GROQ_API_KEY")
    # if not groq_api_key:
    #     raise ValueError("GROQ_API_KEY is not set in the environment variables.")
    
    # # Initialize LLM
    # llm = ChatGroq(temperature=0, groq_api_key=groq_api_key, model_name="llama-3.3-70b-versatile")
    
    # # Create SmartDataframe instance
    # query_engine = SmartDataframe(df, config={"llm": llm, "enable_cache": False})
    # # Example query
    # query = "Show the top 5 rows of the dataset"
    # # Check if query exists
    # if query.strip():
    #     answer = query_engine.chat(query)
    #     print(answer)
    # else:
    #     print("No query provided. Please enter a valid query.")
    
    @app.route("/CSV/upload", methods=["POST"])
    def upload():
        print("Received request with content type:", request.content_type)  # Debugging

        if "multipart/form-data" not in request.content_type:
            return jsonify({"error": "Invalid content type, expected multipart/form-data"}), 415

        user_email = request.form.get("email")  # Removed request.json.get("email")
        print("User email:", user_email)  # Debugging

        if not user_email:
            return jsonify({"error": "Email is required"}), 400

        user = db["users"].find_one({"email": user_email})
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
            upload_result = cloudinary.uploader.upload(file, resource_type="raw")
            file_url = upload_result.get("secure_url")
            if not file_url:
                raise ValueError("Cloudinary did not return a file URL")
        except cloudinary.exceptions.Error as e:
            return jsonify({"error": "Cloudinary upload failed", "details": str(e)}), 500
        except Exception as e:
            return jsonify({"error": "Unexpected error during file upload", "details": str(e)}), 500

        db["users"].update_one(
            {"email": user_email},
            {"$push": {"files": {"filename": file.filename, "url": file_url}}}
        )

        return jsonify({"message": "File uploaded successfully", "file_url": file_url}), 200


    @app.route("/CSV/chat", methods=["POST"])
    def chat():
        data = request.json
        user_email = data.get("email")
        query = data.get("query")

        # Fetch user's latest file from MongoDB
        user = db["users"].find_one({"email": user_email})
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

        # Initialize LLM
        llm = ChatGroq(temperature=0, groq_api_key=os.getenv("GROQ_API_KEY"), model_name="llama-3.3-70b-versatile")
        
        # Process query
        query_engine = SmartDataframe(df, config={"llm": llm, "enable_cache": False})
        answer = query_engine.chat(query)

        return jsonify({"query": query, "answer": answer}), 200
    
    if __name__ == "__main__":
        app.run(debug=True)