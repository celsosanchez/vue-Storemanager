"""
This module handles the POST action for the api/products 
"""

# System modules
from datetime import datetime
import pandas as pd
import json


def getAssociations(products):
    """
    This function gets the association rules given an array of products
    :param products:  array of string with the name of the products 
    :return:       json object with the data 
    """
    rules = pd.read_csv('./rules_clean.csv')
    text = ""
    for i in range(0, len(products)): 
        text = text + f"(?=.*{products[i]}.*)"
        
    print(text)    
    a = rules["rh"][rules["lh"].str.match(rf"{text}")]
    # print(a.array)
    print(type(a))
    print(type(a.values))
    result = a.to_json(orient="split")
    parsed = json.loads(result)
    
    return parsed
   