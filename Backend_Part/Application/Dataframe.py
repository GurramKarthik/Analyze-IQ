import requests
import pandas as pd
from io import StringIO
from flask import  jsonify
from .AnalyseData import analyze_dataset
from .CleanData import cleanData

def setDataframe(user, request, instances, analysis_results):
    print("entered setDaraframe")
    data = request.json
    file_url = data.get("file_url")
    
    if instances["file_url"] is None or instances['file_url'] != file_url : 
        instances['file_url'] = file_url
    elif instances['file_url'] == file_url:
        return jsonify({"success":True, "message": "File set Successfully"}), 200

    if file_url != "large":
        response = requests.get(file_url)
        if response.status_code != 200:
            return jsonify({"success":False, "message": "File is not present"}), 401
        instances["df"] =  pd.read_csv(StringIO(response.text))
    
    # if file is large then df is set at file upload. User can analyse this temporarirly
    analysis_results['results'] = analyze_dataset(instances.get('df'))
    instances['df'] = cleanData(instances.get('df'))
    print("leaved setDataframe")


    # return jsonify({"success":True, "message": "File set Successfully"}), 200
    
