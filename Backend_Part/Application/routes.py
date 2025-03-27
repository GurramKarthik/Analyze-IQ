from flask import request, jsonify
from controllers.user_Controllers import register_user, login_user, logout_user, update_user, FileUpload
from utils.Auth import authenticate
from .Chat import chatWithLLM
from .Dataframe import setDataframe
from .Dashboard import Dashborad
from .GetData import getData

instances = {
    "df": None,
    'llm' :None,
    "engine" : None,
    "file_url" :None
}

analysis_results = {}

#  to csv//getFile url
getFiledata = {"tempDf":None , "file_url" : None}

def setup_routes(app):
    @app.route("/CSV", methods=["GET"])
    def home():
        return jsonify({"success":True, "message": "Welcome to CSV Analyzer"})

    @app.route("/CSV/register", methods=["POST"])
    def register():
        return register_user(request)

    @app.route("/CSV/login", methods=["POST"])
    def login():
        return login_user(request)
    
    @app.route("/CSV/logout", methods=["GET"])
    def logout():
        return logout_user()
    
    @app.route("/CSV/update" , methods=["PUT"])
    @authenticate
    def update(user):
        return update_user(request , user)
    
    # requries file 
    @app.route("/CSV/upload", methods=["POST"])
    @authenticate
    def upload(user):
        print("upload")
        return FileUpload(request, user , instances )
    
    @app.route("/CSV/files", methods=["GET"])
    @authenticate
    def files(user):
        return jsonify({ "success":True ,"files": user["files"]}), 200
    
    # requries file url
    @app.route("/CSV/setfile", methods=["POST"])
    @authenticate
    def setFile(user):
        return setDataframe(user, request, instances, analysis_results)
    


    
    # requries file url
    @app.route("/CSV/getFile", methods=["POST"])
    @authenticate
    def getFileData(user):
        return getData(user, request, getFiledata)

    # requries file url
    @app.route("/CSV/dashboard", methods=["POST"])
    @authenticate
    def dashboard(user):
        return Dashborad(user,request, instances, analysis_results)
    

    # required query
    @app.route("/CSV/chat", methods=["POST"])
    @authenticate
    def chat(user):
        return chatWithLLM(user, request, instances, analysis_results)
    
    if __name__ == "__main__":
        app.run(debug=True)