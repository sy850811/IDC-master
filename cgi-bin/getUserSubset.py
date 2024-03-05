#!/usr/bin/env python3.10
import os
import cgi
import cgitb
import json

cgitb.enable()

form = cgi.FieldStorage()
# Reading POST data

user_id = form.getvalue('userID')

script_dir = os.path.dirname(os.path.realpath(__file__))
project_root = os.path.join(script_dir, "..") 
file_path = project_root + f"/../users/userSubset.json"
#read userSubset.json
with open(file_path) as json_file:
    data = json.load(json_file)

# Return the data as CSV
print("Content-type:application/json\r\n\r\n")
print(json.dumps({"userSubset":data}))