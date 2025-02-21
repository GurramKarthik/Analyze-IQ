from flask_pymongo import PyMongo

mongo = PyMongo()

def init_db(app):
    """Initialize MongoDB with Flask app."""
    app.config["MONGO_URI"] = "mongodb+srv://csv:csv123@csvanalyzer.cfplz.mongodb.net/csv_analyzer?retryWrites=true&w=majority"
    mongo.init_app(app)
    return mongo.db  # Return the database instance

