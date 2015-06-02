var express = require('express');
var router = express.Router();
var db = require('../connection').db;
var url = require("url");
var queryString = require("querystring");
var request = require('request');
var _ = require('underscore')._;


/* GET home page. */
router.get('/', function(req, res, next) {



    db.open(function(err, db1) {


        if (err) {
            console.log("connection issues");
        } else {

            console.log("connected");
            var col = db1.collection('tumor');
            var pr_col = db1.collection('projectRun')

            pr_col.distinct('study', {'status':1},{
                status: 1
            }, function(err, dist) {

                console.log(dist);
                res.render('lol', {
                    dist_prs: dist
                });
                db.close();


            });

        }

    });



});



router.get('/genes', function(req, res, next) {


    var theUrl = url.parse(req.url);
    var queryObj = queryString.parse(theUrl.query);
    console.log(queryObj.qy);


    db.open(function(err, db1) {


        if (err) {
            console.log("connection issues");
        } else {

            console.log("connected");
            var pr_col = db1.collection('projectRun')
            var col = db1.collection('tumor');



            col.aggregate([{
                    $match: {
                        "variants.study": queryObj.qy,
                        "impact": "significant",
                        "snpeff": {
                            $gt: {}
                        }
                    }
                },

                {
                    $project: {
                        "gene": 1,
                        "_id": 0
                    }
                }


            ]).toArray(function(err, docs) {
                console.log(docs);
                db.close();

                var uniq_genes = [];
                for (item in docs) {
                    uniq_genes.push(docs[item].gene);
                }
                res.json(_.uniq(uniq_genes));

            });


        };



    }); //db open




});








router.get("/LOLLIPOP", function(req, res, next) {

    var theUrl = url.parse(req.url);
    var queryObj = queryString.parse(theUrl.query);

    console.log(queryObj);


    db.open(function(err, db1) {


        if (err) {
            console.log("connection issues");
        } else {

            console.log("connected");
            var pr_col = db1.collection('projectRun')
            var col = db1.collection('tumor');



            col.aggregate([{
                    $match: {
                        "variants.study": queryObj.qy,
                        "gene": queryObj.qy2,
                        "impact": "significant",
                        "snpeff": {
                            $gt: {}
                        }


                    }
                },

                {
                    $project: {
                        "gene": 1,
                        "_id": 0,
                        "snpeff": 1,
                        "variants": 1
                    }
                }


            ]).toArray(function(err, docs) {
                db.close();
                generatePop(docs);

            });


        };



    }); //db open


    var generatePop = function(docs) {

        console.log("in generate");
        console.log(docs);

        var aminoString = "";

        aminoChange = [];
        for (item in docs) {
            aminoChange.push(docs[item].snpeff.AminoAcidChange);
        }

        for (item in aminoChange) {
            aminoString += aminoChange[item] + " ";
        }


        console.log("amino string is " + aminoString);

        var url = 'http://www.uniprot.org/uniprot/?'
        var params = queryString.stringify({
            'format': 'tab',
            'query': 'gene_exact:' + queryObj.qy2 + ' AND reviewed:yes AND organism:"Homo sapiens (Human) [9606]"'
        });


        request.get(url + params, {}, function(err, res, body) {

            var acc = body.split("\n")[1].split("\t")[0];
            console.log(body.split("\n")[1].split("\t")[0]);

            runSVG(acc);

        })

        var runSVG = function(acc) {

            var execString = './lollipops -labels -U ' + acc + ' ' + aminoString + ' && ls -Art | tail -n 1 | xargs cat';
            console.log(execString);

            var exec = require('child_process').exec;
            exec(execString, function(error, stdout, stderr) {
                console.log("hi");
                var mysvg = {
                    "svg": stdout
                };
                res.json(mysvg);
                clearSVG();
            });

        }


        var clearSVG = function() {
            var exec = require('child_process').exec;
            exec('ls -Art | tail -n 1 | xargs rm', function(error, stdout, stderr) {console.log("remove successful"); });

        }




    }




});



module.exports = router;