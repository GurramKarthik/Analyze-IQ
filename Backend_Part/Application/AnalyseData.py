from flask import Flask, render_template, jsonify
import pandas as pd
import numpy as np
import plotly
import plotly.express as px
import plotly.graph_objects as go
import json
import os
from .CleanData import cleanData
from dateutil.parser import parse


# Helper function to convert int32 to int recursively
def convert_int32(obj):
    """Recursively convert all int32 values to Python int"""
    if isinstance(obj, np.int32) or isinstance(obj, np.int64):
        return int(obj)
    elif isinstance(obj, list):
        return [convert_int32(item) for item in obj]
    elif isinstance(obj, dict):
        return {key: convert_int32(value) for key, value in obj.items()}
    else:
        return obj


def is_date_series(series):
    """Check if a series contains date-like values."""
    try:
        pd.to_datetime(series.dropna(), errors='raise')
        return True
    except (ValueError, TypeError):
        return False


def analyze_dataset(df):
    """Analyze a pandas DataFrame and return insights"""
    results = {}

    print("entered analyze_dataset")
    
    # Basic dataset information
    results['dataInfo'] = {
        'name': 'Your Dataset',
        'shape': df.shape,
        'memoryUsage': f"{df.memory_usage(deep=True).sum() / (1024 * 1024):.2f} MB",
        'numNumerical': len(df.select_dtypes(include=['number']).columns),
        'numCategorical': len(df.select_dtypes(exclude=['number']).columns)
    }
    
    # Column types
    results['columnTypes'] = []
    for col in df.columns:
        results['columnTypes'].append({
            'name': col,
            'dtype': str(df[col].dtype),
            'isNumerical': pd.api.types.is_numeric_dtype(df[col])
        })
    
    # Missing values analysis
    missing_values = []
    for col in df.columns:
        missing_count = df[col].isna().sum()
        if missing_count > 0:
            missing_values.append({
                'name': col,
                'count': int(missing_count),
                'percentage': round((missing_count / len(df)) * 100, 2)
            })
    results['missingValues'] = missing_values
    
    # Descriptive statistics for numerical columns
    numerical_cols = df.select_dtypes(include=['number']).columns
    
    describe_results = []
    for col in numerical_cols:
        col_stats = {
            'column': col,
            'count': int(df[col].count()),
            'mean': round(float(df[col].mean()), 4) if not pd.isna(df[col].mean()) else 'N/A',
            'std': round(float(df[col].std()), 4) if not pd.isna(df[col].std()) else 'N/A',
            'min': round(float(df[col].min()), 4) if not pd.isna(df[col].min()) else 'N/A',
            '25%': round(float(df[col].quantile(0.25)), 4) if not pd.isna(df[col].quantile(0.25)) else 'N/A',
            '50%': round(float(df[col].quantile(0.5)), 4) if not pd.isna(df[col].quantile(0.5)) else 'N/A',
            '75%': round(float(df[col].quantile(0.75)), 4) if not pd.isna(df[col].quantile(0.75)) else 'N/A',
            'max': round(float(df[col].max()), 4) if not pd.isna(df[col].max()) else 'N/A'
        }
        describe_results.append(col_stats)
    
    results['describe'] = describe_results
    
    # Kurtosis analysis for numerical columns
    kurtosis_results = []
    for col in numerical_cols:
        try:
            kurt_value = df[col].kurtosis()
            kurtosis_results.append({
                'column': col,
                'value': float(kurt_value)
            })
        except:
            pass
    
    results['kurtosis'] = kurtosis_results
    
    # Categorical columns analysis
    categorical_cols = df.select_dtypes(exclude=['number']).columns
    categorical_results = []
    
    for col in categorical_cols:
        if is_date_series(df[col]): 
            continue
        value_counts = df[col].value_counts().reset_index()
        value_counts.columns = ['value', 'count']
        value_counts['percentage'] = round((value_counts['count'] / len(df)) * 100, 2)
        
        values_list = []
        for _, row in value_counts.iterrows():
            values_list.append({
                'value': str(row['value']),
                'count': int(row['count']),
                'percentage': float(row['percentage'])
            })
        
        categorical_results.append({
            'name': col,
            'uniqueCount': int(df[col].nunique()),
            'values': values_list
        })
    
    results['categoricalColumns'] = categorical_results

    return convert_int32(results)
