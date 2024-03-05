# Author: Ehsan Sherkat - 2016

    
import os
def read_term_document_matrix(path, type="tf"):
    """
    read document-term matrix (comma separate)
    :param path: path to matrix
    :param type: if it is word count of tf/idf value (count or tf)
    :return: 2D matrix (list of list)
    """
    document_term_matrix_file = open(path, 'r')
    matrix = []
    for line in document_term_matrix_file:
        if type == "count":
            line = line.replace('\r','').replace('\n','').replace('0.0','0')
        else:
            line = line.replace('\r', '').replace('\n', '')
        columns = line.split(',')
        row = []
        for column in columns:
            row.append(column)
        matrix.append(row)
        #remove nan values
    for row in matrix:
        for i in range(len(row)):
            if row[i] == 'nan':
                row[i] = '0'
    return matrix

def read_TSNE(path):
    """
    read TSNE (tab separate)
    :param path: path to matrix
    :return: 2D matrix (list of list)
    """
    document_term_matrix_file = open(path, 'r')
    matrix = []
    for line in document_term_matrix_file:
        line = line = line.replace('\r','').replace('\n','')
        columns = line.split('\t')
        row = []
        for column in columns:
            row.append(column)
        matrix.append(row)
    return matrix

def read_single_column_data(path):
    """
    read files that have only one column. Each column is an array cell.
    :param path: path to file
    :return: 1D array, Hashmap to map id to index
    """
    single_column_file = open(path, 'r')
    array = []
    hashMap = {}
    index = 0
    for line in single_column_file:
        if len(line) > 1:
            line = line.replace('\r','').replace('\n','')
            array.append(line)
            hashMap[line] = index
            index += 1
    return array, hashMap

import json
def getMode(userID):
    currentSubset = None
    script_dir = os.path.dirname(os.path.realpath(__file__))
    project_root = os.path.join(script_dir, "..") 
    file_path = project_root + f"/../users/userSubset.json"
    with open(file_path) as json_fil:
        userSubsetDetails = json.load(json_fil)

    for key in userSubsetDetails:
        if userID in userSubsetDetails[key]:
            # Select the last character of the key string
            currentSubset = int(key[-1])  # Convert last character to integer
            print(f"For user: {str(userID)}, subset is: {str(currentSubset)}")

    if currentSubset == 3:
        return "proposed_"
    elif currentSubset == 2 or currentSubset == 1 or currentSubset == 0:
        return "baseline_"
    else:
        return "error_"