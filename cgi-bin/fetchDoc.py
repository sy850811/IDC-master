#!/Applications/miniconda3/envs/IDC/bin/python
import cgi, cgitb

cgitb.enable()

form = cgi.FieldStorage()
# Reading POST data

user_id = form.getvalue('userID')
docName = form.getvalue('docName')


# Fetch documentMembs data based on userID
# Implement your logic here to retrieve data
# For example, reading from a file:
file_path = f"../users/{user_id}/{docName}"
fin = open(file_path, "r")
data = fin.read()
fin.close()

# Return the data as CSV
print("Content-type: text/csv\n")
print(data)