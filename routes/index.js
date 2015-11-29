var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/story/new',function(req,res){
  res.render('edit');
});

module.exports = router;
