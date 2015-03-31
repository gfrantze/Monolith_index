var db = require('./connection').db;



function s () {


db.open(function(err,db1){
		db1.collection(process.argv[2],function(err,du2){
			du2.find({$or:[{size:{$gte:1000000}},{size:{$exists:false}}]},{_id:0}).toArray(function(err,data){
				n(data);
				db1.close();
			})
		});
});

}



function n (_json) {



// create a name: node map
var dataMap = _json.reduce(function(map, node) {
    map[node.name] = node;
    return map;
}, {});


// create the tree array
var tree = [];
_json.forEach(function(node) {
    // add to parent
    var parent = dataMap[node.parent];
    if (parent) {
        // create child array if it doesn't exist
        (parent.children || (parent.children = []))
            // add node to child array
            .push(node);
             delete node["parent"];
        
    } else {
        // parent is null or missing
        tree.push(node);
        delete node["parent"];
    }
});


db.open(function(err,db1){
	db1.createCollection(process.argv[3], function(err,result){ 
		db1.collection(process.argv[3],function(err,du2){
			du2.remove({}, function(err,success){
				du2.insert(tree[0],function(err,success2){
					db1.close();
				});
			});
		});
	});
});



}


s();
