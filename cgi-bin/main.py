#!/home/ubuntu/IDC/bin/python

#Author: Ehsan Sherkat - Aug. 2016
# import bestCmeans
import utility
import cgi, cgitb
import json
# from scipy.spatial.distance import cosine
# import numpy as np
# from sklearn.cluster import KMeans
# from sklearn import metrics
import sys, os
# import math
# env = importlib.import_module("env")
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
try:
    form = cgi.FieldStorage()
    cgitb.enable()
     

    # userDirectory = form.getvalue('userDirectory')
    user_id = eval(form.getvalue('userID'))
    userID = user_id
    firstTime = eval(form.getvalue('userU'))#if it is the first time that the algorithm is running -1:first +1:interaction
    numberOfClusters = eval(form.getvalue('clusterNumber'))# number of clusters
    confidenceUser = 50 #///////////// not sent from javascript but expected here # faulty code
    script_dir = os.path.dirname(os.path.realpath(__file__))
    project_root = os.path.join(script_dir, "..")
    userDirectory = os.path.join(project_root, f"../users/{userID}/")


    script_dir = os.path.dirname(os.path.realpath(__file__))
    project_root = os.path.join(script_dir, "..") 
    file_path = project_root + f"/../users/{user_id}/{utility.getMode(user_id)}documentClusters"
    document_clusters = []

    with open(file_path, 'r') as file:
        lines = file.readlines()
        for line in lines:
            # Split the line by comma and strip whitespace, then remove any empty strings
            cluster = [doc.strip() for doc in line.split(',') if doc.strip()]
            document_clusters.append(cluster)

    # print(document_clusters)
    # print(documentClustersArray)




    termClustersArray = []
    script_dir = os.path.dirname(os.path.realpath(__file__))
    project_root = os.path.join(script_dir, "..") 
    file_path = project_root + f"/../users/{userID}/{utility.getMode(userID)}termClusters"
    with open(file_path, "r") as file:
        for line in file:
            line = line.strip()
            terms = line.split(",")
            termClustersArray.append(terms)

    # print("Content-type:text/html\r\n\r\n")
    # print("termClustersArray",termClustersArray)





    #send data to the Visualization modules
    print("Content-type:application/json\r\n\r\n")
    # print json.dumps({'status': 'test','testMSG': json.dumps(testMSG)})
    print(json.dumps(
        {'status': 'success',
        
        'termClusters':json.dumps(termClustersArray),
        # 'documentClusters':json.dumps(documentClustersArray),
        'newdocumentClusters':json.dumps(document_clusters)
        # 'silhouette':json.dumps(AVG_silhouette)
        }))
        


except Exception as e:
    exc_type, exc_obj, exc_tb = sys.exc_info()
    fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
    print("Content-type:application/json\r\n\r\n")
    print(json.dumps({'status':'error', 'except':json.dumps(str(e) + " Error line:" + str(exc_tb.tb_lineno) + " Error type:" + str(exc_type) + " File name:" + fname)}))