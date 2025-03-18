from flask import  jsonify
from langchain_groq import ChatGroq
from pandasai import SmartDataframe
from dotenv import load_dotenv
load_dotenv()
import pandas as pd
import os
from .Dataframe import setDataframe



def chatWithLLM(user, request, instances):
    try:
        data = request.json
        if instances['df'] is None:
            setDataframe(user, request, instances)

        if instances["llm"] is None:
            instances["llm"] = ChatGroq(temperature=0, groq_api_key=os.getenv("GROQ_API_KEY"), model_name="llama-3.3-70b-versatile")    

        if  instances["engine"] is None:
            instances["engine"] = SmartDataframe(instances['df'], config={"llm": instances["llm"] , "enable_cache": False})

        query = data.get("query")
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

        print('+=======================+')
        print(type(answer))
        print('+=======================+')
        print(answer_json)

        return jsonify({"success":True, "query": query, "answerFormat": answerFormat , "answer": answer_json}), 200
    
    except Exception as e:
        print(str(e))
        return jsonify({"success":False, "message": str(e)}), 500

    