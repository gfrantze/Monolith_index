var express = require('express');
var router = express.Router();
var db = require('../connection').db;


router.get('/tm_flat', function(req, res) {

console.log('hi');


	db.open(function(err,db1){
		db1.collection('du1',function(err,du1){
			du1.find({group:{$in:["1","2","3","4","5","6"] } },{_id:0}).toArray(function(err,data){
				console.log(data);
				res.json(data);
				db1.close();

			})
		});
	});

});


router.post('/redraw', function(req, res) {

var query = req.body.i;
console.log(query);


var g = req.body.g;
var g1 = req.body.g1;
var g2 = req.body.g2;
var g3 = req.body.g3;
var g4 = req.body.g4;

console.log(g);
console.log(g1);
console.log(g2);

	db.open(function(err,db1){
		db1.collection('du1',function(err,du1){
			du1.find({"name":{$regex:query},"group":{$in:[g,g1,g2,g3,g4]}  }).toArray(function(err,data){
				console.log("further data is");
				console.log(data);
				db1.close();
				res.json(data);
				
			})
		});
	});

	

});

module.exports = router;
