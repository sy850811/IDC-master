#!/home/ubuntu/IDC/bin/python


import cgi, cgitb, sys
import json

cgitb.enable()

form = cgi.FieldStorage()

status = eval(form.getvalue('status'))

userDirectory = eval(form.getvalue('userDirectory'))

statusFile = userDirectory+"pp.status"

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