#!/home/ubuntu/IDC/bin/python
import cgi, cgitb
from dotenv import load_dotenv

import utility, os
# Load environment variables from .env file
load_dotenv()
cgitb.enable()

form = cgi.FieldStorage()
# Reading POST data

user_id = form.getvalue('userID')

# Fetch documentMembs data based on userID
# Implement your logic here to retrieve data
# For example, reading from a file:

script_dir = os.path.dirname(os.path.realpath(__file__))
project_root = os.path.join(script_dir, "..") 
file_path = project_root + f"/../users/{user_id}/{utility.getMode(user_id)}documentMembers"
fin = open(file_path, "r")
data = fin.read()
fin.close()
# Return the data as CSV
print("Content-type: text/csv\n")
print(data)
