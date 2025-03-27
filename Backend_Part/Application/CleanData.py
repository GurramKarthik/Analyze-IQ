import os
import json
import pandas as pd
import numpy as np
from scipy.stats import shapiro




def is_normal(series):
    stat, p = shapiro(series.dropna())
    return p > 0.05  


def cleanData(df):

    print("entered clean dataset")

    # removing columns with >= 30% missing values
    missing_percentage = (df.isnull().sum() / len(df)) * 100
    columns_to_keep = missing_percentage[missing_percentage < 30].index
    df = df[columns_to_keep]

    # for the columns have missing values 
    # - if numarical columns and normally diributed then replace missing with mean value, 
    # - if numarical and data is skewd or having outliers then replace with median,
    # - if categorical then replace it with mode 
    for col in df.columns:
        if df[col].isnull().sum() > 0:
            if df[col].dtype == 'object': 
                mode_value = df[col].mode().iloc[0]
                df[col].fillna(mode_value, inplace=True)
            else:  
                if is_normal(df[col]):
                    mean_value = df[col].mean()
                    df[col].fillna(mean_value, inplace=True)
                else:
                    median_value = df[col].median()
                    df[col].fillna(median_value, inplace=True)
    
    return df

    