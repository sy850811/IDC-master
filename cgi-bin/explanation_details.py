#!/Applications/miniconda3/envs/IDC/bin/python

import cgi, cgitb, json
cgitb.enable()

form = cgi.FieldStorage()

user_id = eval(form.getvalue('userID'))

fileName =f"../users/{user_id}/explaination_details.json"


with open(fileName) as json_file:
    explanation_details = json.load(json_file)

print("Content-type:application/json\r\n\r\n")
print(json.dumps({'explanation_details': explanation_details}))