#!/Applications/miniconda3/envs/IDC/bin/python
import cgi
import cgitb
import pandas as pd
import json

cgitb.enable()

# Retrieve data from the POST request
form = cgi.FieldStorage()
feedback = form.getvalue('feedback')
support = form.getvalue('support')
satisfaction = form.getvalue('satisfaction')
userID = form.getvalue('userID')
documentname = form.getvalue('documentname')
datetime_received = form.getvalue('datetime')

# Create a DataFrame
df = pd.DataFrame({
    'Feedback': [feedback],
    'Support': [support],
    'Satisfaction': [satisfaction],
    'UserID': [userID],
    'DocumentName': [documentname],
    'DateTime': [datetime_received]
})

# Save the DataFrame to a CSV file
# Check if the file exists to append or create a new one
filename = f"../users/{userID}/{userID}_feedback.csv"
try:
    df_existing = pd.read_csv(filename)
    df = pd.concat([df_existing, df], ignore_index=True)
except FileNotFoundError:
    pass  # File does not exist, will create a new one

df.to_csv(filename, index=False)

# Send a response back to the client
print("Content-type:application/json\r\n\r\n")
response = {'status': 'success', 'message': 'Feedback submitted successfully'}
print(json.dumps(response))
