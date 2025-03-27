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


def save_data_locally(metaData, finalMeta, error_message):
    """Save metaData and finalMeta locally in case of an error."""
    error_dir = "error_logs"
    os.makedirs(error_dir, exist_ok=True)

    error_count = len([f for f in os.listdir(error_dir) if f.startswith("error_log")])

    file_name = f"{error_dir}/error_log_{error_count + 1}.json"

    data = {
        "error_message": error_message,
        "metaData": metaData,
        "finalMeta": finalMeta
    }

    with open(file_name, "w") as f:
        json.dump(data, f, indent=4)
    
    print(f"Error data saved locally in {file_name}")


def plotGraphs(instances, analysis_results):
    try:

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

        
        # metaData:  [{'graphType': 'bar', 'title': 'Top 10 Countries by Sales'}, {'graphType': 'scatter', 'title': 'Relationship between Quantity Ordered and Sales'}, {'graphType': 'pie', 'title': 'Distribution of Sales by Product Line'}, {'graphType': 'line', 'title': 'Monthly Sales Trend'}, {'graphType': 'histogram', 'title': 'Distribution of Order Quantity'}, {'graphType': 'box', 'title': 'Sales Distribution by Deal Size'}, {'graphType': 'sunburst', 'title': 'Sales by Country and Product Line'}, {'graphType': 'treemap', 'title': 'Sales by Country, Product Line, and Deal Size'}]
        # metaData =[{'graphType': 'bar', 'title': 'Expenses by Region'}, {'graphType': 'histogram', 'title': 'Distribution of Expenses'}, {'graphType': 'box', 'title': 'Expenses by Sex'}, {'graphType': 'scatter', 'title': 'Expenses vs Age'}, {'graphType': 'scatter', 'title': 'Expenses vs BMI'}, {'graphType': 'bar', 'title': 'Expenses by Smoker Status'}, {'graphType': 'violin', 'title': 'Expenses Distribution by Region'}, {'graphType': 'histogram', 'title': 'Distribution of Age'}, {'graphType': 'histogram', 'title': 'Distribution of BMI'}, {'graphType': 'pie', 'title': 'Smoker Status Distribution'}, {'graphType': 'bar', 'title': 'Average Expenses by Number of Children'}]

        try:
            print('setting metaData ')
            chain = prompt | instances.get("llm")
            answer = chain.invoke({"dashbordPrompt": dashbordPrompt, "data": first10rows})
            metaData = json.loads(answer.content)
            print('metaData set')
        except Exception as e:
            save_data_locally([], [], f"LLM invocation error: {str(e)}")
            print("LLM invocation failed:", str(e))
            return

        print('metaData: ',metaData)

        if instances["engine"] is None:
            print('seting engine')
            instances["engine"] = SmartDataframe(instances.get('df'), config={"llm": instances.get("llm"), "enable_cache": False})

        # Final Meta: [{'x': 'COUNTRY', 'y': 'SALES', 'data': [{'COUNTRY': 'USA', 'SALES': 3627982.83}, {'COUNTRY': 'Spain', 'SALES': 1215686.92}, {'COUNTRY': 'France', 'SALES': 1110916.52}, {'COUNTRY': 'Australia', 'SALES': 630623.1}, {'COUNTRY': 'UK', 'SALES': 478880.46}, {'COUNTRY': 'Italy', 'SALES': 374674.31}, {'COUNTRY': 'Finland', 'SALES': 329581.91}, {'COUNTRY': 'Norway', 'SALES': 307463.7}, {'COUNTRY': 'Singapore', 'SALES': 288488.41}, {'COUNTRY': 'Denmark', 'SALES': 245637.15}]}, {'x': 'QUANTITYORDERED', 'y': 'SALES', 'title': 'Relationship between Quantity Ordered and Sales'}, {'values': [3919615.66, 1166388.34, 975003.57, 714437.13, 226243.47, 1127789.84, 1903150.84], 'names': ['Classic Cars', 'Motorcycles', 'Planes', 'Ships', 'Trains', 'Trucks and Buses', 'Vintage Cars'], 'title': 'Distribution of Sales by Product Line'}, {'x': 'MONTH', 'y': 'SALES', 'title': 'Monthly Sales Trend'}, {'x': 'QUANTITYORDERED', 'title': 'Distribution of Order Quantity', 'color_discrete_sequence': ['blue'], 'template': 'plotly_white'}, {'x': 'DEALSIZE', 'y': 'SALES', 'title': 'Sales Distribution by Deal Size'}, {'path': ['COUNTRY', 'PRODUCTLINE'], 'values': 'SALES'}, {'names': 'PRODUCTLINE', 'parents': 'COUNTRY', 'values': 'SALES', 'color': 'DEALSIZE'}]
        # finalMeta = [{'x': 'region', 'y': 'expenses', 'title': 'Expenses by Region', 'color_discrete_sequence': ['blue']}, {'x': 'expenses', 'title': 'Distribution of Expenses', 'color_discrete_sequence': ['blue'], 'template': 'plotly_white'}, {'x': 'sex', 'y': 'expenses'}, {'x': 'age', 'y': 'expenses', 'title': 'Expenses vs Age'}, {'x': 'bmi', 'y': 'expenses', 'title': 'Expenses vs BMI'}, {'x': 'smoker', 'y': 'expenses', 'title': 'Expenses by Smoker Status'}, {'x': 'region', 'y': 'expenses'}, {'x': 'age', 'title': 'Distribution of Age', 'color_discrete_sequence': ['blue'], 'template': 'plotly_white'}, {'x': 'bmi', 'title': 'Distribution of BMI', 'color_discrete_sequence': ['blue'], 'template': 'plotly_white'}, {'values': [1064, 274], 'names': ['no', 'yes'], 'title': 'Smoker Status Distribution'}, {'x': 'children', 'y': 'expenses', 'title': 'Average Expenses by Number of Children', 'color_discrete_sequence': ['blue'], 'template': 'plotly_white'}]
        
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
                    save_data_locally(metaData, finalMeta, f"Failed to extract JSON: {str(inner_e)}")
            except Exception as e:
                print(f"General error for {graph['title']}: {str(e)}")
                print(f"Raw response: {response}")
                save_data_locally(metaData, finalMeta, f"SmartDataframe chat error: {str(e)}")

        print("Final Meta:", finalMeta)
        plots = []

        for i in range(len(finalMeta)):
            try:
                print("Chating....")
                result = instances["engine"].chat(f"return the dataframe for {metaData[i]['title']}")
                
                if isinstance(result, SmartDataframe):
                    result = pd.DataFrame(result, columns=result.columns)
                    params = {**finalMeta[i], 'x': result.columns[0]}
                    filtered_params = filter_valid_plotly_params(metaData[i]['graphType'], params, result)
                    fig = getattr(px, metaData[i]['graphType'])(result, **filtered_params)
                else:
                    filtered_params = filter_valid_plotly_params(metaData[i]['graphType'], finalMeta[i], instances.get('df'))
                    fig = getattr(px, metaData[i]['graphType'])(instances.get('df'), **filtered_params)
                
                graph_json = plotly.utils.PlotlyJSONEncoder().encode(fig)
                plots.append(graph_json)
            except Exception as e:
                save_data_locally(metaData, finalMeta, f"Plotting error: {str(e)}")
                print("Plotting error:", str(e))
        
        analysis_results['results']['plots'] = plots
    except Exception as e:
        print("Error in plots: ", str(e))



# Final Meta: [{'x': 'region', 'y': 'expenses', 'title': 'Expenses by Region', 'color_discrete_sequence': ['blue']}, {'x': 'expenses', 'title': 'Distribution of Expenses', 'color_discrete_sequence': ['blue'], 'template': 'plotly_white'}, {'x': 'sex', 'y': 'expenses'}, {'x': 'age', 'y': 'expenses', 'title': 'Expenses vs Age'}, {'x': 'bmi', 'y': 'expenses', 'title': 'Expenses vs BMI'}, {'x': 'smoker', 'y': 'expenses', 'title': 'Expenses by Smoker Status'}, {'x': 'region', 'y': 'expenses'}, {'x': 'age', 'title': 'Distribution of Age', 'color_discrete_sequence': ['blue'], 'template': 'plotly_white'}, {'x': 'bmi', 'title': 'Distribution of BMI', 'color_discrete_sequence': ['blue'], 'template': 'plotly_white'}, {'values': [1064, 274], 'names': ['no', 'yes'], 'title': 'Smoker Status Distribution'}, {'x': 'children', 'y': 'expenses', 'title': 'Average Expenses by Number of Children', 'color_discrete_sequence': ['blue'], 'template': 'plotly_white'}]
# metaData:  [{'graphType': 'bar', 'title': 'Expenses by Region'}, {'graphType': 'histogram', 'title': 'Distribution of Expenses'}, {'graphType': 'box', 'title': 'Expenses by Sex'}, {'graphType': 'scatter', 'title': 'Expenses vs Age'}, {'graphType': 'scatter', 'title': 'Expenses vs BMI'}, {'graphType': 'bar', 'title': 'Expenses by Smoker Status'}, {'graphType': 'violin', 'title': 'Expenses Distribution by Region'}, {'graphType': 'histogram', 'title': 'Distribution of Age'}, {'graphType': 'histogram', 'title': 'Distribution of BMI'}, {'graphType': 'pie', 'title': 'Smoker Status Distribution'}, {'graphType': 'bar', 'title': 'Average Expenses by Number of Children'}]
