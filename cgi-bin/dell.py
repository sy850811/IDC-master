import numpy as np
from numpy import genfromtxt

file_path = f"../users/baqia/documentDistance"
data = genfromtxt(file_path, delimiter=',')[:,:100]
# Convert list to string

with open(file_path, "w") as fin:
    for row in data:
        row = ','.join([str(elem) for elem in row])
        fin.write(row)
        fin.write('\n')

    fin.close() 





