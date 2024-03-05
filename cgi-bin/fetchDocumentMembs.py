#!/usr/bin/env python3.10
import cgi, cgitb
from dotenv import load_dotenv

import utility
# Load environment variables from .env file
load_dotenv()
cgitb.enable()

form = cgi.FieldStorage()
# Reading POST data

user_id = form.getvalue('userID')

# Fetch documentMembs data based on userID
# Implement your logic here to retrieve data
# For example, reading from a file:
file_path = f"../users/{user_id}/{utility.getMode(user_id)}documentMembers"
fin = open(file_path, "r")
data = fin.read()
fin.close()
# Return the data as CSV
print("Content-type: text/csv\n")
print(data)
