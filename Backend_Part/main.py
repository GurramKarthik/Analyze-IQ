from flask import Flask
from database.mongo import init_db  # Import the function to initialize the database
from Application.routes import setup_routes  # Import the route setup function
from flask_cors import CORS

app = Flask(__name__)

CORS(app, supports_credentials=True, origins=["http://localhost:5173"])


# Initialize MongoDB
init_db(app)

# Register routes
setup_routes(app)



@app.route("/")
def home_page():
    return "MongoDB Connection Successful!"

if __name__ == "__main__":
    app.run(host="localhost", port=5000, debug=False)
