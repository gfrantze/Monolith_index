var express = require('express');
var router = express.Router();
var db = require('../connection').db;
var intersection = require('../intersection');


user_selection = "";
var dataset = {};


/* GET home page. */
router.get('/', function(req, res) {
res.render('index');
});


//load default
router.post('/loadList',function(req,res){
  var o = req.body.option;

  console.log(o);
  console.log('a');
  
  db.open(function(err,db1){

    console.log('b');
  	db1.collection('files',function(err,files){
        files.distinct('projectRun',{'collectionDb':o,insertsCount:{'$gte':1}},function(err,d){

            db1.close();
            res.json(d);
            
        });
    });
  });

  


});


router.get('/loadDb',function(req,res,next){
  console.log('c');

  db.open(function(err,db2){
    console.log('d');
    db2.collectionNames(function(err,names){
      db2.close();

      res.json(names);
    });
  });
});



/*
Passes the users selection
 (gene,effect,biomarker,aberration type) 
 as well as samples and passes to intersection algorithm
*/

router.post('/',function(req,res,next){

var data = {
user_selection:req.body.key,
s1: req.body.s1,
s2: req.body.s2,
s3: req.body.s3,
s4: req.body.s4,
u_db: req.body.u_db
};

console.log(data);

var myIntersection = intersection(data.user_selection,data.s1,data.s2,data.s3,data.s4,data.u_db);

myIntersection.aggregateF(

//callback function called from intersection.js

  function(){
	dataset=myIntersection.vals();


	if(!dataset){
    console.log("error returning dataset");
		res.json({error:1})
	}
	else if(dataset){
    console.log("working");
		res.json(dataset);
	}

});

});





module.exports = router;
