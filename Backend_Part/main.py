from flask import Flask
from flask_cors import CORS  # Import CORS
from database.mongo import init_db  # Import the function to initialize the database
from Application.routes import setup_routes  # Import the route setup function
from flask import jsonify , make_response


app = Flask(__name__)

# Enable CORS for all routes
CORS(app, supports_credentials=True, origins=["http://localhost:5173", "null"])

# Initialize MongoDB
db = init_db(app)

# Register routes
setup_routes(app, db)

@app.route("/")
def home_page():
    return "MongoDB Connection Successful!"


@app.route("/CSV/dummy", methods=["POST"])
def dummy_page():
    response = make_response(jsonify({"success":True, "message": "dummy successful"}))
    return response, 200                                      


if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
