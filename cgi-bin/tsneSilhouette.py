#!/home/ubuntu/IDC/bin/python

# Author: Ehsan Sherkat
import sys
import numpy
import scipy
import cgi, cgitb 
import json
from sklearn.metrics import silhouette_score

cgitb.enable()

form = cgi.FieldStorage()

tsneResult = json.loads(form.getvalue('tsneResult'))
tsneLables = json.loads(form.getvalue('tsneLables'))

# try:
TsneSilhouette = -10	

#calculate avg silhouette_score
# TsneSilhouette = silhouette_score(numpy.array(tsneResult), numpy.array(tsneLables), 'euclidean')
TsneSilhouette = silhouette_score(X=numpy.array(tsneResult), labels=numpy.array(tsneLables), metric='euclidean')


if TsneSilhouette > -10 :
	print("Content-type:application/json\r\n\r\n")
	print(json.dumps({'status':'yes', 'TsneSilhouette':json.dumps(TsneSilhouette)}))

else:
	print("Content-type:application/json\r\n\r\n")
	print(json.dumps({'status':'no'}))

# except:
# 	print("Content-type:application/json\r\n\r\n")
# 	print(json.dumps({'status':'error'}))