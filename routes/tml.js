var express = require('express');
var router = express.Router();
var db = require('../connection')._db2;


router.get('/', function(req, res, next) {
  res.render('tml');
});


/*

router.get('/tmdata', function(req, res) {
	db.open(function(err,db1){
		db1.collection('tma_su2c',function(err,du2){
			du2.find({$or:[{size:{$gte:1000000}},{size:{$exists:false}}]},{_id:0}).toArray(function(err,data){
				console.log(data);
				res.json(data);
				db1.close();
			})
		});
	});
});

*/

router.get('/tmdata', function(req, res) {
	console.log("in tm data");
	db.open(function(err,db1){
		db1.collection('tma_liang_nested',function(err,du2){
			du2.find({},{_id:0}).toArray(function(err,data){
				res.json(data);
				db1.close();
			})
		});
	});
});



router.post('/tmdata_update', function(req,res,next) {

console.log(req.body.item);

var o = req.body.item;

db.open(function(err,db1){
		db1.collection(o,function(err,du2){
			du2.find({},{_id:0}).toArray(function(err,data){
				console.log(data);
				res.json(data);
				db1.close();
			})
		});
});



});

module.exports = router;



