#!/home/ubuntu/IDC/bin/python

import cgi, cgitb, json, os
cgitb.enable()
from dotenv import load_dotenv

import utility

load_dotenv()
form = cgi.FieldStorage()

user_id = eval(form.getvalue('userID'))
script_dir = os.path.dirname(os.path.realpath(__file__))
project_root = os.path.join(script_dir, "..") 
file_path = project_root + f"/../users/{user_id}/{utility.getMode(user_id)}explaination_details.json"


with open(file_path) as json_file:
    explanation_details = json.load(json_file)

print("Content-type:application/json\r\n\r\n")
print(json.dumps({'explanation_details': explanation_details}))