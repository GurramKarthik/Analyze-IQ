from .Dataframe import setDataframe
from flask import jsonify
import requests
import pandas as pd
from io import StringIO

def getData(user, request, getFileData):
    try:
        data = request.json
        file_url = data.get("file_url")
        if getFileData['file_url'] is None or  file_url != getFileData['file_url']:
               response = requests.get(file_url)
               if response.status_code != 200:
                    return jsonify({"success":False, "message": "File is not present"}), 401
               getFileData["tempDf"] =  pd.read_csv(StringIO(response.text))
          
        
        startRow = data.get("startRow")
        endRow = startRow + 100
        columns  = getFileData["tempDf"].columns.tolist()
        rows = getFileData["tempDf"].iloc[startRow:endRow, :].values.tolist() 
        totalRows = getFileData["tempDf"].shape[0]
        if endRow+1 <= totalRows:
             next= True
        else:
             next=False

        return jsonify({"success":True, "message": "retrived data", "columns": columns, "rows":rows, "next": next}), 200
    except Exception as e:
         print(str(e))
         return jsonify({"success":False, "message": str(e)}), 500



