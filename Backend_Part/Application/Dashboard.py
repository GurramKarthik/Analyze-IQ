from flask import jsonify
from .Dataframe import setDataframe
from .AnalyseData import analyze_dataset
from .PlotData import plotGraphs

def Dashborad(user, request, instances, analysis_results):
    try:
        print("entered Dashboard")
        # setting dataframe and cleaning the data
        if instances.get('df') is None or instances['df'].empty:
            print("setDta")
            setDataframe(user, request, instances, analysis_results)

        plotGraphs(instances, analysis_results)
    
        # Now jsonify will work
        response = jsonify( {"success":True, "results" : analysis_results.get('results')})
        return response
    
    except Exception as e:
        print("error in dash: ", str(e))
        return jsonify({"success":False,"error": str(e)})

