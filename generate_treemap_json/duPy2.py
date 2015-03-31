from pymongo import MongoClient
import os
import sys

client = MongoClient('leeloo.tgen.org', 27058)
db = client['markers']
collection = db[sys.argv[3]]
u = []
du = open(sys.argv[1]).readlines()
df = open(sys.argv[2]).readlines()

for item in du:
	item = item.strip("\n").split("\t")
	size = int(item[0])*1024
	path = item[1]
	ppath = path.strip(".")
	parent = ppath.rsplit("/",1)[0]
	if ppath.rsplit("/",1)[-1]=='':
		u.append({"name":ppath.strip("/"), "parent":''})
	else:
		u.append({"name":ppath, "parent":parent, "size":size})

for i in u:
	for j in u:
		if i['parent']==j['name']:
			j.pop('size',None)

ep = "/"+sys.argv[1].split(".")[0]
used = int(df[2].split()[2])*1024
doc = {"name":"empty","parent":ep,"size":used}

collection.remove({})
collection.update(doc,doc,upsert=True)

for it in u:
	if it['parent']=='':
		it['parent']=None
	collection.update(it,it,upsert=True)

