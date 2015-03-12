var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res) {
res.render('index');
});

/* GET ia app page. */
router.get('/ia', function(req, res) {
res.render('ia');
});


/* get tree map page */
router.get('/tmworking', function(req, res) {
res.render('tmworking');
});

/* get tree map page */
router.get('/tm', function(req, res) {
res.render('tm');
});



router.get('/tml',function(req,res){
res.render('tml');
});


module.exports = router;
