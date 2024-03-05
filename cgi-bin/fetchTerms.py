#!/home/ubuntu/IDC/bin/python
import cgi, cgitb, sys, json, os

cgitb.enable()
form = cgi.FieldStorage()

user_id = form.getvalue('userID')

script_dir = os.path.dirname(os.path.realpath(__file__))
project_root = os.path.join(script_dir, "..") 
file_path = project_root + f"/../users/{user_id}/out{user_id}.Terms"
fin = open(file_path, "r")
data = fin.read()
fin.close()

# Return the data as CSV
print("Content-type: text/csv\n")
print(data)