#!/home/ubuntu/IDC/bin/python

# Author: Ehsan Sherkat
import sys
import cgi, cgitb 
import json
import os
from sklearn.manifold import TSNE

try:
	cgitb.enable()

	form = cgi.FieldStorage()

	userDirectory = eval(form.getvalue('userDirectory'))
	userID = eval(form.getvalue('userID'))
	perplexityNew = eval(form.getvalue('perplexityNew'))

	# run tsne
	tsneFile = userDirectory + "tsne"	
	os.system("cat "+ userDirectory + "out" + userID + ".Matrix"+" | tr ',' '\t' | ./bhtsne.py -d 2 -p "+perplexityNew+" > "+tsneFile)


	# #save perplexity number
	# perplexity_File = open(userDirectory + "perplexity", 'w')
	# perplexity_File.write(perplexityNew)
	# perplexity_File.close()

	print("Content-type:application/json\r\n\r\n")	
	print(json.dumps({'status':'success'}))
except Exception as e:
	print("Content-type:application/json\r\n\r\n")
	print(json.dumps({'status':'error', 'except':json.dumps(str(e))}))