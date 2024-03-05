#!/usr/bin/env python3.10
import json, os
import cgi, cgitb


cgitb.enable()
form = cgi.FieldStorage()
text = eval(form.getvalue('doc'))
# document.replace("\n"," ").replace("\t"," ")
# print("Content-type:application/json\r\n\r\n")
# print(json.dumps({'text': text}))
script_dir = os.path.dirname(os.path.realpath(__file__))
project_root = os.path.join(script_dir, "..") 
file_path = project_root + f"/../users/annotation.json"
with open(file_path, 'r') as f:
    annotatedDocuments = json.load(f)
r = annotatedDocuments[text]
#r is the response from wikifier


print("Content-type:application/json\r\n\r\n")
print(json.dumps({'response': r}))
