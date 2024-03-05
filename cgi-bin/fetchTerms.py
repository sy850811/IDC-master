#!/usr/bin/env python3.10
import cgi, cgitb, sys, json

cgitb.enable()
form = cgi.FieldStorage()

user_id = form.getvalue('userID')

file_path = f"../users/{user_id}/out{user_id}.Terms"
fin = open(file_path, "r")
data = fin.read()
fin.close()

# Return the data as CSV
print("Content-type: text/csv\n")
print(data)