#!/home/ubuntu/IDC/bin/python
import cgi, cgitb, os, json
import pandas as pd

def initialize_clusters(num_clusters = 4):
    print("Hello from initialize_clusters")
    # Initialize the file with default cluster names
    clusters = [f"cluster{i}" for i in range(num_clusters)]
    df = pd.DataFrame(clusters, columns=["ClusterName"])
    print("Hello from initialize_clusters")
    df.to_csv(file_path, header=False, index=False)
    print("Hello from initialize_clusters")

def update_cluster_names():
    try:
        if not os.path.exists(file_path):
            initialize_clusters()
        
        df = pd.read_csv(file_path, header=None, names=["ClusterName"])
        
        row_index = df[df['ClusterName'] == old_name].index
        if not row_index.empty:
            df.at[row_index[0], 'ClusterName'] = new_name
        else:
            # Alternative way to append a new row to the DataFrame
            next_index = len(df)
            df.loc[next_index] = [new_name]  # Adds the new_name at the next index
        
        df.to_csv(file_path, header=False, index=False)
        return True
    except Exception as e:
        print(f"Error updating cluster names: {e}")
        return False

cgitb.enable()
print("Content-Type: application/json\n") 

form = cgi.FieldStorage()

# Reading POST data
user_id = form.getvalue('userID')
cluster_update_data = form.getvalue('cluster_name_update')

# Path setup
script_dir = os.path.dirname(os.path.realpath(__file__))
project_root = os.path.join(script_dir, "..")
file_path = project_root + f"/../users/{user_id}/clusterNamesFile.csv"


# script_dir = os.path.dirname(os.path.realpath(__file__))
# project_root = os.path.join(script_dir, "..")
# file_path = project_root + f"/../users/{userID}/{userID}_feedback.csv"


# Parsing the JSON data
data = json.loads(cluster_update_data)
old_name = data.get("oldName")
new_name = data.get("newName")

# Update the cluster names file or initialize if necessary
success = update_cluster_names()

response = {"status": "success" if success else "error"}
print(json.dumps(response))
