#!/Applications/miniconda3/envs/IDC/bin/python
import cgi
import cgitb
import json

cgitb.enable()

form = cgi.FieldStorage()
# Reading POST data

user_id = form.getvalue('userID')


#read userSubset.json
with open('../users/userSubset.json') as json_file:
    data = json.load(json_file)

# Return the data as CSV
print("Content-type:application/json\r\n\r\n")
print(json.dumps({"userSubset":data}))