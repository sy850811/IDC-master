#!/Applications/miniconda3/envs/IDC/bin/python
import json
import cgi, cgitb


cgitb.enable()
form = cgi.FieldStorage()
text = eval(form.getvalue('doc'))
# document.replace("\n"," ").replace("\t"," ")
# print("Content-type:application/json\r\n\r\n")
# print(json.dumps({'text': text}))

with open("./../users/annotation.json", 'r') as f:
    annotatedDocuments = json.load(f)
r = annotatedDocuments[text]
#r is the response from wikifier


print("Content-type:application/json\r\n\r\n")
print(json.dumps({'response': r}))
