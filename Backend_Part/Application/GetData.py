from .Dataframe import setDataframe
from flask import jsonify

def getData(user, request, instances):
    data = request.json
    startRow = data.get("startRow")
    endRow = startRow + 100
    if instances.get('df') is None or instances['df'].empty:
            setDataframe(user, request, instances)
    
    rowsCount =  instances['df'].shape[0]
        
    if(startRow > rowsCount ):
          return jsonify({"success":True, "data": [] })
    else : 
        df1 = instances['df'].iloc[startRow:endRow , :]




