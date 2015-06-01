var express = require('express');
var router = express.Router();
var db = require('../connection').db;
var intersection = require('../intersection');


user_selection = "";
var dataset = {};

var mutex = false;


/* GET home page. */
router.get('/', function(req, res) {
    res.render('ia');
});


//load default
router.post('/loadList', function(req, res) {



    console.log('a');

    db.open(function(err, db1) {

        mutex = true; 

        if (err) {
            console.log("oops");
            db.close();
        } else {

            console.log('b');
            var o = req.body.option;

            db1.collection('files', function(err, files) {


                files.aggregate([

                    {
                        $match: {
                            'collectionDb': o,
                            insertsCount: {
                                '$gte': 1
                            }
                        }
                    }, {
                        $project: {
                            projectRun: 1,
                            _id: 0
                        }
                    }, {
                        $sort: {
                            projectRun: 1
                        }
                    }, {
                        $group: {
                            _id: null,
                            projectRun: {
                                $addToSet: "$projectRun"
                            }
                        }
                    }

                ], function(err, result) {


                    if (result && result.length > 0 && result[0].projectRun) {
                        db1.close();
                        console.log(result[0].projectRun);
                        res.json(result[0].projectRun);
                    }

                }); //end aggregate
            });
        }
    });




});



router.get('/loadDb', function(req, res, next) {
    console.log('c');

    db.open(function(err, db2) {

        if (err) {
            console.log("oops");
            db.close();
        } else {

            console.log('d');

            db2.listCollections({name:{$in:['germline','tumor']} }).toArray(function(err, names) {
                
                if(!err){
                    res.json(names);
                }
                db2.close();
            });

        }



    });
});



/*
Passes the users selection
 (gene,effect,biomarker,aberration type) 
 as well as samples and passes to intersection algorithm
*/

router.post('/', function(req, res, next) {

    var data = {
        user_selection: req.body.key,
        s1: req.body.s1,
        s2: req.body.s2,
        s3: req.body.s3,
        s4: req.body.s4,
        u_db: req.body.u_db
    };

    if (data.u_db) {

        console.log(data);

        var myIntersection = intersection(data.user_selection, data.s1, data.s2, data.s3, data.s4, data.u_db);

        myIntersection.aggregateF(

            //callback function called from intersection.js

            function() {
                dataset = myIntersection.vals();


                if (!dataset) {
                    console.log("error returning dataset");
                    res.json({
                        error: 1
                    });
                } else if (dataset) {
                    console.log("working");
                    res.json(dataset);
                }

            });

    }
    else{
        console.log("error returning dataset");
                    res.json({
                        error: 1
                    });
    }

});





module.exports = router;