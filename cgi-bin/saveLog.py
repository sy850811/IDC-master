#!/home/ubuntu/IDC/bin/python

import cgi, cgitb, os

cgitb.enable()
form = cgi.FieldStorage()

try:
    userID = eval(form.getvalue('userDirectory'))
    command = eval(form.getvalue('command'))
    script_dir = os.path.dirname(os.path.realpath(__file__))
    project_root = os.path.join(script_dir, "..") 
    logFileName = project_root + f"/../log/{userID}"
    
    # logFileName = "../log/"+userID

    with open(logFileName, "a") as logFile:
        logFile.write(command)
        logFile.write('\n')

    logFile.close()

    print("Content-type:application/json\r\n\r\n")
    print("yes")
except:
    print("Content-type:application/json\r\n\r\n")
    print("no")
