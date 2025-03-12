from flask import Flask
from database.mongo import init_db  # Import the function to initialize the database
from Application.routes import setup_routes  # Import the route setup function

app = Flask(__name__)

# Initialize MongoDB
db = init_db(app)

# Register routes
setup_routes(app, db)

@app.route("/")
def home_page():
    return "MongoDB Connection Successful!"

if __name__ == "__main__":
    app.run(debug=True)
