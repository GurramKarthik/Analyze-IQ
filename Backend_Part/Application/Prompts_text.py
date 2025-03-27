dashbordPrompt = """
    Instruction:
        - Your are a data analysit expert. 
    Task:
        - Your task is to understand the columns symantically and sample data given to you. 
        - suggest some graphs that helps in finding the insigts from these data.
        - Do not repeat the graphs
    output:
        - return an array having objects where each object has graphtype and title saying about the graph for insight. 
        - graph type should be suitable for plotly.
    No preamble required. just return an array
"""
