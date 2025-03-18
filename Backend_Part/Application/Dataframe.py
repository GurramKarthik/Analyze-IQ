import requests
import pandas as pd
from io import StringIO
from flask import  jsonify

def setDataframe(user, request, instances):
    data = request.json
    file_url = data.get("file_url")
    
    if instances["file_url"] is None: 
        instances['file_url'] = file_url
    elif instances['file_url'] == file_url:
        return jsonify({"success":True, "message": "File set Successfully"}), 200


    response = requests.get(file_url)
    if response.status_code != 200:
        return jsonify({"success":False, "message": "File is not present"}), 401
    instances["df"] =  pd.read_csv(StringIO(response.text))
    return jsonify({"success":True, "message": "File set Successfully"}), 200
    
