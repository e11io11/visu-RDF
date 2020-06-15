import rdflib
import json


fileName = "data.ttl"
#f = open(fileName, "r")
#content = f.read()
#print(content)

g = rdflib.Graph()
g.parse(fileName, format = "turtle")

data = {}

for subj, pred, obj in g:
    # check if there is at least one triple in the Graph
    if (subj, pred, obj) not in g:
        raise Exception("Error")
    else:
        current = {"source": subj, "target": obj, "label": pred}

        if not current["source"] in data:
            data[current["source"]] = {"isSourceIn":[], "isTargetIn": [], "degree": 0, }

        if not current["target"] in data:
            data[current["target"]] = {"isSourceIn":[], "isTargetIn": [], "degree": 0, }
            
        data[current["source"]]["isSourceIn"].append(current)
        data[current["source"]]["degree"] += 1
        data[current["target"]]["isTargetIn"].append(current)
        data[current["target"]]["degree"] += 1

with open('data.json', 'w') as fp:
    json.dump(data, fp)




