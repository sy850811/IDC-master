#!/Applications/miniconda3/envs/IDC/bin/python
import cgi, cgitb
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()
cgitb.enable()

form = cgi.FieldStorage()
# Reading POST data

user_id = form.getvalue('userID')

# Fetch documentMembs data based on userID
# Implement your logic here to retrieve data
# For example, reading from a file:

file_path = f"../users/{user_id}/{os.getenv('MODE')}termMembersProbabilities"
fin = open(file_path, "r")
data = fin.read()
fin.close()

print("Content-type: text/csv\n")
print(data)


