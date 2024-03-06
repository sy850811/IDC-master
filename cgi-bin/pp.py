#!/home/ubuntu/IDC/bin/python

import cgi, cgitb, os
import json

cgitb.enable()

form = cgi.FieldStorage()
user_id = eval(form.getvalue('user_id'))

status = eval(form.getvalue('status'))
script_dir = os.path.dirname(os.path.realpath(__file__))
project_root = os.path.join(script_dir, "..") 
file_path = project_root + f"/../users/{user_id}/pp.status"

statusFile = file_path

if (status == '+1'):
    fo = open(statusFile, "w")
    fo.write('yes')
    fo.close()
    print("Content-type:application/json\r\n\r\n")
    print(json.dumps({'status':'yes'}))
elif (status == '-1'):
    fo = open(statusFile, "w")
    fo.write('no')
    fo.close()
    print("Content-type:application/json\r\n\r\n")
    print(json.dumps({'status':'no'}))
elif (status == '0'):
    try:
        fin = open(statusFile, "r")
        currentSatus = fin.read().replace('\n','')
        fin.close()
        print("Content-type:application/json\r\n\r\n")
        print(json.dumps({'status':currentSatus}))
    except:
        print("Content-type:application/json\r\n\r\n")
        print(json.dumps({'status':'yes'}))
