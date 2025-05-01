import matplotlib
matplotlib.use('agg')
from .Prompts_text import dashbordPrompt
import os
import json
import pandasai as pai
import pandas as pd
from langchain_groq import ChatGroq
from pandasai import SmartDataframe
import numpy as np
from scipy.stats import shapiro
import plotly.express as px
from langchain_core.prompts import ChatPromptTemplate
import inspect
import plotly
from dotenv import load_dotenv
load_dotenv()
import plotly.graph_objects as go
from plotly.utils import PlotlyJSONEncoder



def filter_valid_plotly_params(graph_type, params, df=None):
    """
    Filters:
    - Valid Plotly parameters based on the graph type
    - Removes invalid or conflicting attributes like 'data_frame'
    - Checks for valid column names (if df is provided)
    """
    # Get valid parameters for the specific Plotly graph
    valid_params = inspect.signature(getattr(px, graph_type)).parameters

    # Filter valid parameters dynamically
    filtered_params = {k: v for k, v in params.items() if k in valid_params}

    # Remove 'data_frame' if present
    filtered_params.pop('data_frame', None)

    # Check for valid columns if df is provided
    if df is not None:
        valid_cols = df.columns.tolist()
        
        # Remove invalid column references
        for key in ['x', 'y', 'z', 'color', 'size', 'names', 'values']:
            if key in filtered_params and isinstance(filtered_params[key], str):
                if filtered_params[key] not in valid_cols:
                    print(f"⚠️ Invalid column '{filtered_params[key]}' removed.")
                    del filtered_params[key]

    return filtered_params


def plotGraphs(instances, analysis_results):
    try:
        print("Entered graphs")
        prompt = ChatPromptTemplate.from_messages([
            ('system', "{dashbordPrompt}"),
            ('human', "{data}"),
        ])



        first10rows = instances.get('df').head(10).to_string()

        groq_api_key = os.getenv("GROQ_API_KEY")
        

        if not groq_api_key:
            raise ValueError("Missing GROQ_API_KEY. Ensure it is set in the environment.")
            
        if instances.get("llm") is None:
            instances["llm"] = ChatGroq(
                temperature=0,
                groq_api_key=os.getenv("GROQ_API_KEY"),
                model_name="llama-3.3-70b-versatile"
            )

        
        if instances.get("llm") is not None:
            print("Present")
        try:
            print('setting metaData ')
            chain = prompt | instances.get("llm")
            print("chain Done")
            answer = chain.invoke({"dashbordPrompt": dashbordPrompt, "data": first10rows})
            print("asnswer Done", answer.content)
            metaData = json.loads(answer.content)
            print('metaData set')
        except Exception as e:
            print("LLM invocation failed:", str(e))
            return 

        print('metaData: ',metaData)

        if instances["engine"] is None:
            print('seting engine')
            instances["engine"] = SmartDataframe(instances.get('df'), config={"llm": instances.get("llm"), "enable_cache": False})

        
        finalMeta = []
        # correct code
        for graph in metaData:
            try:
                print('setting finalMetadata')
                response = instances["engine"].chat(f"return the parameters in a json object that need to be passed for px.{graph['graphType']} for {graph['title']}")
                
                # Handle different response formats
                if isinstance(response, dict):
                    data_dict = response
                else:
                    # If response is a string containing JSON
                    response_str = str(response).strip()
                    
                    # Check if it's in the format {'type': 'string', 'value': '{"x": "expenses"...}'}
                    if isinstance(response, dict) and 'value' in response and 'type' in response and response['type'] == 'string':
                        # Extract the JSON string from the 'value' field
                        json_str = response['value']
                        data_dict = json.loads(json_str)
                    else:
                        # Direct JSON string
                        data_dict = json.loads(response_str)
                
                print(data_dict)
                finalMeta.append(data_dict)
            except json.JSONDecodeError as je:
                print(f"JSON Decode error for {graph['title']}: {str(je)}")
                print(f"Raw response: {response}")
                # Try to extract JSON if it's embedded in text
                try:
                    if isinstance(response, str):
                        # Find JSON-like structure in the string
                        start = response.find('{')
                        end = response.rfind('}') + 1
                        if start >= 0 and end > 0:
                            json_str = response[start:end]
                            data_dict = json.loads(json_str)
                            print(f"Extracted JSON: {data_dict}")
                            finalMeta.append(data_dict)
                except Exception as inner_e:
                    print(f"Failed to extract JSON: {str(inner_e)}")
                    return
            except Exception as e:
                print(f"General error for {graph['title']}: {str(e)}")
                print(f"Raw response: {response}")
                return

        print("Final Meta:", finalMeta)
        plots = []

        for i in range(len(finalMeta)):
            try:
                print("Chating....")
                result = instances["engine"].chat(f"return the dataframe for {metaData[i]['title']}")
                print("result: ", i)
                grpahType = 'imshow' if metaData[i]['graphType'].lower() == 'heatmap' else metaData[i]['graphType'].lower()
                if isinstance(result, SmartDataframe):
                    result = pd.DataFrame(result, columns=result.columns)
                    params = {**finalMeta[i], 'x': result.columns[0]}
                    filtered_params = filter_valid_plotly_params(metaData[i]['graphType'], params, result)
                    fig = getattr(px, grpahType)(result, **filtered_params)
                else:
                    filtered_params = filter_valid_plotly_params(metaData[i]['graphType'], finalMeta[i], instances.get('df'))
                    fig = getattr(px, grpahType)(instances.get('df'), **filtered_params)
                
                graph_json = plotly.utils.PlotlyJSONEncoder().encode(fig)
                plots.append(graph_json)

            except Exception as e:
                print("Plotting error:", str(e))
                # return
        
        analysis_results['results']['plots'] = plots
    except Exception as e:
        print(analysis_results['results']['plots'])
        print("Error in plots: ", str(e))
        return 




# import json
# import re
# import pandas as pd
# import plotly.express as px
# from typing import Dict, Any


# def filter_valid_plotly_params(graph_type: str, params: Dict[str, Any], df=None) -> Dict[str, Any]:
#     """
#     Filters:
#     - Valid Plotly parameters based on the graph type
#     - Removes invalid or conflicting attributes like 'data_frame'
#     - Checks for valid column names (if df is provided)
#     """
#     # Get valid parameters for the specific Plotly graph
#     valid_params = inspect.signature(getattr(px, graph_type)).parameters

#     # Filter valid parameters dynamically
#     filtered_params = {k: v for k, v in params.items() if k in valid_params}

#     # Remove 'data_frame' if present
#     filtered_params.pop('data_frame', None)

#     # Check for valid columns if df is provided
#     if df is not None:
#         valid_cols = df.columns.tolist()
        
#         # Remove invalid column references
#         for key in ['x', 'y', 'z', 'color', 'size', 'names', 'values']:
#             if key in filtered_params and isinstance(filtered_params[key], str):
#                 if filtered_params[key] not in valid_cols:
#                     print(f"⚠️ Invalid column '{filtered_params[key]}' removed.")
#                     del filtered_params[key]

#     return filtered_params


# def extract_json_from_response(response: Any) -> Dict[str, Any]:
#     """
#     Attempts to extract a valid JSON object from a raw response.
#     Handles cases where JSON is embedded in text or partially malformed.
#     """
#     try:
#         # If the response is already a dictionary, return it directly
#         if isinstance(response, dict):
#             return response
        
#         # Convert the response to a string if it isn't already
#         response_str = str(response).strip()

#         # Attempt to parse the entire string as JSON
#         try:
#             return json.loads(response_str)
#         except json.JSONDecodeError:
#             pass

#         # Extract JSON-like structure using regex
#         match = re.search(r'\{.*\}', response_str, re.DOTALL)
#         if match:
#             json_str = match.group(0)
#             return json.loads(json_str)

#         # If no JSON-like structure is found, raise an error
#         raise ValueError("No valid JSON found in the response.")
#     except Exception as e:
#         print(f"Failed to extract JSON: {str(e)}")
#         return {}


# def plotGraphs(instances, analysis_results):
#     try:
#         print("Entered graphs")
#         prompt = ChatPromptTemplate.from_messages([
#             ('system', "{dashbordPrompt}"),
#             ('human', "{data}"),
#         ])

#         first10rows = instances.get('df').head(10).to_string()

#         groq_api_key = os.getenv("GROQ_API_KEY")
#         if not groq_api_key:
#             raise ValueError("Missing GROQ_API_KEY. Ensure it is set in the environment.")
            
#         if instances.get("llm") is None:
#             instances["llm"] = ChatGroq(
#                 temperature=0,
#                 groq_api_key=os.getenv("GROQ_API_KEY"),
#                 model_name="llama-3.3-70b-versatile"
#             )

#         try:
#             print('Setting metaData')
#             chain = prompt | instances.get("llm")
#             answer = chain.invoke({"dashbordPrompt": dashbordPrompt, "data": first10rows})
#             metaData = json.loads(answer.content)
#             print('metaData set')
#         except Exception as e:
#             print("LLM invocation failed:", str(e))
#             return 

#         print('metaData:', metaData)

#         if instances["engine"] is None:
#             print('Setting engine')
#             instances["engine"] = SmartDataframe(instances.get('df'), config={"llm": instances.get("llm"), "enable_cache": False})

#         finalMeta = []
#         for graph in metaData:
#             try:
#                 print('Setting finalMetadata')
#                 response = instances["engine"].chat(f"return the parameters in a json object that need to be passed for px.{graph['graphType']} for {graph['title']}")
                
#                 # Extract JSON from the response
#                 data_dict = extract_json_from_response(response)
#                 if not data_dict:
#                     print(f"No valid JSON extracted for {graph['title']}. Skipping...")
#                     continue
                
#                 print(data_dict)
#                 finalMeta.append(data_dict)
#             except Exception as e:
#                 print(f"Error processing {graph['title']}: {str(e)}")
#                 print(f"Raw response: {response}")
#                 continue  # Skip this graph and proceed to the next one

#         print("Final Meta:", finalMeta)
#         plots = []

#         for i, meta in enumerate(finalMeta):
#             try:
#                 print("Chatting....")
#                 result = instances["engine"].chat(f"return the dataframe for {metaData[i]['title']}")
#                 print("Result:", i)
#                 graph_type = 'imshow' if metaData[i]['graphType'].lower() == 'heatmap' else metaData[i]['graphType'].lower()

#                 if isinstance(result, SmartDataframe):
#                     result = pd.DataFrame(result, columns=result.columns)
#                     params = {**finalMeta[i], 'x': result.columns[0]}
#                     filtered_params = filter_valid_plotly_params(metaData[i]['graphType'], params, result)
#                     fig = getattr(px, graph_type)(result, **filtered_params)
#                 else:
#                     filtered_params = filter_valid_plotly_params(metaData[i]['graphType'], finalMeta[i], instances.get('df'))
#                     fig = getattr(px, graph_type)(instances.get('df'), **filtered_params)
                
#                 graph_json = plotly.utils.PlotlyJSONEncoder().encode(fig)
#                 plots.append(graph_json)

#             except Exception as e:
#                 print(f"Plotting error for graph {i}: {str(e)}")
#                 continue  # Skip this graph and proceed to the next one

#         analysis_results['results']['plots'] = plots
#     except Exception as e:
#         print(analysis_results['results']['plots'])
#         print("Error in plots:", str(e))
#         return

# =============================================
# 
# 
# import os
# import json
# import pandas as pd
# import plotly.express as px
# import plotly
# import inspect
# import psutil
# import ast
# from dotenv import load_dotenv
# from plotly.utils import PlotlyJSONEncoder
# from langchain_groq import ChatGroq
# from langchain_core.prompts import ChatPromptTemplate
# from pandasai import SmartDataframe
# from .Prompts_text import dashbordPrompt

# import matplotlib
# matplotlib.use("Agg")  # Safe backend
# os.environ["DISPLAY"] = ":0"  # Prevent GUI use

# # Kill GUI attempts
# def kill_gui_processes():
#     gui_keywords = ['Xquartz', 'X11', 'Tk', 'Wish', 'pythonw']
#     for proc in psutil.process_iter(['pid', 'name']):
#         try:
#             if any(keyword.lower() in proc.info['name'].lower() for keyword in gui_keywords):
#                 print(f"Killing GUI process: {proc.info['name']} (PID: {proc.pid})")
#                 proc.kill()
#         except Exception as e:
#             print(f"Error killing process {proc.info['name']}: {e}")

# # Parse JSON or Python-style dictionary
# def parse_to_dict(response_str):
#     try:
#         return json.loads(response_str)
#     except json.JSONDecodeError:
#         try:
#             return ast.literal_eval(response_str)
#         except Exception as e:
#             print("❌ Failed to parse response as dict:", e)
#             raise e

# # Filter valid Plotly params
# def filter_valid_plotly_params(graph_type, params, df=None):
#     valid_params = inspect.signature(getattr(px, graph_type)).parameters
#     filtered_params = {k: v for k, v in params.items() if k in valid_params}
#     filtered_params.pop('data_frame', None)
#     if df is not None:
#         valid_cols = df.columns.tolist()
#         for key in ['x', 'y', 'z', 'color', 'size', 'names', 'values']:
#             if key in filtered_params and isinstance(filtered_params[key], str):
#                 if filtered_params[key] not in valid_cols:
#                     print(f"⚠️ Invalid column '{filtered_params[key]}' removed.")
#                     del filtered_params[key]
#     return filtered_params

# # Main logic
# def plotGraphs(instances, analysis_results):
#     try:
#         print("Entered graphs")
#         prompt = ChatPromptTemplate.from_messages([
#             ('system', "{dashbordPrompt}"),
#             ('human', "{data}"),
#         ])

#         first10rows = instances.get('df').head(10).to_string()
#         load_dotenv()
#         groq_api_key = os.getenv("GROQ_API_KEY")
#         if not groq_api_key:
#             raise ValueError("Missing GROQ_API_KEY. Ensure it is set in the environment.")

#         if instances.get("llm") is None:
#             instances["llm"] = ChatGroq(
#                 temperature=0,
#                 groq_api_key=groq_api_key,
#                 model_name="llama-3.3-70b-versatile"
#             )

#         try:
#             chain = prompt | instances.get("llm")
#             answer = chain.invoke({"dashbordPrompt": dashbordPrompt, "data": first10rows})
#             metaData = json.loads(answer.content)
#         except Exception as e:
#             print("LLM invocation failed:", str(e))
#             return

#         print('metaData:', metaData)

#         if instances["engine"] is None:
#             instances["engine"] = SmartDataframe(instances.get('df'), config={"llm": instances.get("llm"), "enable_cache": False})

#         finalMeta = []
#         for graph in metaData:
#             try:
#                 response = instances["engine"].chat(
#                     f"return the parameters in a json object that need to be passed for px.{graph['graphType']} for {graph['title']}"
#                 )
#                 response_str = str(response).strip()

#                 # Attempt safe parsing
#                 data_dict = parse_to_dict(response_str)
#                 print("✅ Parsed parameters:", data_dict)
#                 finalMeta.append(data_dict)

#             except Exception as e:
#                 print(f"❌ Error parsing parameters for {graph['title']}: {e}")
#                 continue

#         plots = []
#         for i in range(len(finalMeta)):
#             try:
#                 result = instances["engine"].chat(f"return the dataframe for {metaData[i]['title']}")
#                 graphType = 'imshow' if metaData[i]['graphType'].lower() == 'heatmap' else metaData[i]['graphType'].lower()

#                 if isinstance(result, SmartDataframe):
#                     result = pd.DataFrame(result, columns=result.columns)
#                     params = {**finalMeta[i], 'x': result.columns[0]}
#                     filtered_params = filter_valid_plotly_params(metaData[i]['graphType'], params, result)
#                     fig = getattr(px, graphType)(result, **filtered_params)
#                 else:
#                     filtered_params = filter_valid_plotly_params(metaData[i]['graphType'], finalMeta[i], instances.get('df'))
#                     fig = getattr(px, graphType)(instances.get('df'), **filtered_params)

#                 kill_gui_processes()  # Kill any rogue GUI apps
#                 graph_json = PlotlyJSONEncoder().encode(fig)
#                 plots.append(graph_json)

#             except Exception as e:
#                 print("Plotting error:", str(e))
#                 continue

#         analysis_results['results']['plots'] = plots

#     except Exception as e:
#         print("Fatal error in plotGraphs():", str(e))
#         return
