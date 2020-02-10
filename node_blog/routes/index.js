var express = require('express');
var router = express.Router();
var db=require('monk')('localhost/nodeblog');
var mongo = require('mongodb');


/* GET home page. */
router.get('/', function(req, res, next) {
    var db = req.db;
    var posts = db.get('posts');
    posts.find({},{},function(err, posts){
      res.render('index', { title: posts });  
    });
});


module.exports = router;