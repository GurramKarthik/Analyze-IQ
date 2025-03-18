import os
import json
import io
from flask import jsonify
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from .Dataframe import setDataframe
from .Prompts_text import dashbordPrompt

load_dotenv()

def Dashborad(user, request, instances):
    try:
        # Ensure DataFrame is set
        if instances.get('df') is None or instances['df'].empty:
            setDataframe(user, request, instances)

        # Ensure LLM instance is initialized
        if instances.get("llm") is None:
            instances["llm"] = ChatGroq(
                temperature=0,
                groq_api_key=os.getenv("GROQ_API_KEY"),
                model_name="llama-3.3-70b-versatile"
            )

        df = instances.get('df')

        # Check if DataFrame is still None or empty
        if df is None or df.empty:
            return jsonify({"success": False, "message": "DataFrame is empty or not set"}), 400

        # Convert df.head(10) to a string
        df_str = df.head(10).to_string(index=False)

        # Capture df.info() output
        buf = io.StringIO()
        df.info(buf=buf)
        df_info_str = buf.getvalue()

        # Create the prompt
        prompt = ChatPromptTemplate.from_messages([
            ('system', "{dashbordPrompt}\n\nHere is the dataset information:\n{dfInfo}"),
            ('human', "{data}"),
        ])

        # Create the LLM chain and invoke it
        chain = prompt | instances['llm']
        answer = chain.invoke({"dashbordPrompt": dashbordPrompt, "data": df_str, "dfInfo": df_info_str})

        # Validate JSON response
        try:
            graphs_metadata = json.loads(answer.content)
        except json.JSONDecodeError as e:
            print("error")
            return jsonify({"success": False, "message": f"Invalid JSON response from LLM: {str(e)}"}), 500

        # Modify Pie Chart Data
        for graph in graphs_metadata:
            if graph.get("graph_type") == "pie":
                column = graph.get("x")  # Assume `x` holds the column name
                if column and column in df.columns:
                    # Check if column is categorical
                    if df[column].dtype == 'object' or df[column].dtype.name == 'category':
                        value_counts = df[column].value_counts()
                        graph["labels"] = value_counts.index.tolist()
                        graph["values"] = value_counts.values.tolist()

        return jsonify({
            "success": True,
            "message": "Dashboard created successfully",
            "graphsMetaData": graphs_metadata
        }), 200

    except Exception as e:
        print("Dashboard error:", str(e))
        return jsonify({"success": False, "message": str(e)}), 500
