var express = require('express');
var router = express.Router();
var db = require('../connection').db;
var intersection = require('../intersection');
var _ = require("lodash");


user_selection = "";
var dataset = {};



/* GET home page. */
router.get('/', function(req, res) {
    res.render('ia');
});


//load default
router.post('/loadList', function(req, res) {


    db.open(function(err, db1) {

        if (err) {
            console.log("oops");
            db.close();
        } else {

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
                        $group: {
                            _id: null,
                            projectRun: {
                                $addToSet: "$projectRun"
                            }
                        }
                    }

                ], function(err, result) {



                    var col = db1.collection('tumor');


                    col.distinct('projectRun', {projectRun:{$in:result[0].projectRun}}, function(err,dist){

                       /* if (result && result.length > 0 && result[0]) {
                            db1.close();
                            var sorted = [];
                            for (var i = 0; i < result[0].projectRun.length; i++) {
                                sorted.push(result[0].projectRun[i].toLowerCase());
                            }
                            sorted.sort();
                            console.log(sorted);
                            res.json(   sorted    );
                        }*/

                        res.json(dist);


                    });

                    

                }); //end aggregate
            });
        }
    });


});



router.get('/loadDb', function(req, res, next) {

    db.open(function(err, db2) {

        if (err) {
            console.log("error");
            db.close();
        } else {

            db2.listCollections({name:{$in:['tumor']} }).toArray(function(err, names) {
                console.log(names);
                console.log("a");

                if(!err){
                    console.log("k");
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