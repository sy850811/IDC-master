import numpy as np
from numpy import genfromtxt

import os
script_dir = os.path.dirname(os.path.realpath(__file__))
project_root = os.path.join(script_dir, "..") 
file_path = project_root + f"/../users/baqia/documentDistance"
data = genfromtxt(file_path, delimiter=',')[:,:100]
# Convert list to string

with open(file_path, "w") as fin:
    for row in data:
        row = ','.join([str(elem) for elem in row])
        fin.write(row)
        fin.write('\n')

    fin.close() 





