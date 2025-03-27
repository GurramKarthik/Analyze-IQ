from flask import  jsonify
from langchain_groq import ChatGroq
from pandasai import SmartDataframe
from dotenv import load_dotenv
load_dotenv()
import pandas as pd
import os
from .Dataframe import setDataframe
import plotly
import plotly.express as px
from langchain_core.prompts import ChatPromptTemplate
import json
from .PlotData import filter_valid_plotly_params
from plotly.utils import PlotlyJSONEncoder
import plotly.graph_objects as go
from io import StringIO
import sys


def plotGrpah( query, instances):
    try:

        dfInfo = f"Shape: {instances['df'].shape}\n{instances['df'].dtypes.to_string()}"

        graphPrompt = """  
            Instruction:
                - Your are a data analysit expert. 
            Task:
                - Your task is to understand the data info {dfInfo}. 
                - suggest a single graph type that helps in visuvalising the graph.
                - A title for this graph.
            output:
                - return a json object having graphType and title for this graph. 
                - graphType should be suitable for plotly.
            No preamble required. just return a json object with no code.
            """
        

        prompt = ChatPromptTemplate.from_messages([
                ('system', "{graphPrompt}"),
                ('human', "{plot}"),
        ])

        chain = prompt | instances.get("llm")
        print("llm query")
        answer = chain.invoke({"graphPrompt": graphPrompt, "dfInfo": dfInfo , "plot": query})
        print("meta Data for graph: ", answer)
        metaData = json.loads(answer.content)
        print("meta Data for graph: ", answer)

        print("final meta query")
        response = instances["engine"].chat(f"return the parameters in a json object that need to be passed for px.{metaData['graphType']} for {metaData['title']}")
        if isinstance(response, dict):
            data_dict = response
        else:
            response_str = str(response).strip()
            if isinstance(response, dict) and 'value' in response and 'type' in response and response['type'] == 'string':
                json_str = response['value']
                data_dict = json.loads(json_str)
            else:
                data_dict = json.loads(response_str)

        print("dataframe query")
        result = instances["engine"].chat(f"return the dataframe for {metaData['title']}")
        if isinstance(result, SmartDataframe):
            result = pd.DataFrame(result, columns=result.columns)
            params = {**data_dict, 'x': result.columns[0]}
            filtered_params = filter_valid_plotly_params(metaData['graphType'], params, result)
            fig = getattr(px, metaData['graphType'])(result, **filtered_params)
        else:
            filtered_params = filter_valid_plotly_params(metaData['graphType'], data_dict , instances.get('df'))
            fig = getattr(px, metaData['graphType'])(instances.get('df'), **filtered_params)
            fig.show()
        graph_json = plotly.utils.PlotlyJSONEncoder().encode(fig)
        return jsonify({"success":True, "query": query, "answerFormat": "Plot" , "answer": graph_json}), 200
    except Exception as e:
        print("Chat plot error: ", str(e))
        return jsonify({"success":False, "message": str(e)}), 500





def chatWithLLM(user, request, instances, analysis_results):
    try:
        data = request.json
        if instances['df'] is None:
            setDataframe(user, request, instances, analysis_results)

        if instances["llm"] is None:
            instances["llm"] = ChatGroq(temperature=0, groq_api_key=os.getenv("GROQ_API_KEY"), model_name="llama-3.3-70b-versatile")    

        if  instances["engine"] is None:
            instances["engine"] = SmartDataframe(instances['df'], config={"llm": instances["llm"] , "enable_cache": False})

        query = data.get("query")
        chatType = data.get("chatType")

        if chatType == 'Plot':
             return plotGrpah(query, instances)   
        else:            
            answer = instances["engine"].chat(query)
            if isinstance(answer, SmartDataframe):
                answer_json = answer.to_dict(orient="records")  
                answerFormat = "table"
            elif isinstance(answer, dict) or isinstance(answer, list):
                answer_json = answer  
                answerFormat = "list"
            else:
                answer_json = str(answer)  
                answerFormat = "string"

        
            return jsonify({"success":True, "query": query, "answerFormat": answerFormat , "answer": answer_json}), 200
        
    except Exception as e:
        print(str(e))
        return jsonify({"success":False, "message": str(e)}), 500

    