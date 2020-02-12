var express = require('express');
var router = express.Router();

var monk =require('monk');
const url = 'localhost:27017/nodeblog';
const db = monk(url);
var mongo = require('mongodb');
router.get('/add', function(req, res, next) {

        res.render('addcategory',{
            'title': 'Add Category'
        })        
    
});

router.post('/add', function(req, res, next) {
    //to get form values
    var name = req.body.name;   

    //form validation
    req.checkBody('name','Name is required').notEmpty();

    //to check errors
    var errors =req.validationErrors();

    if(errors){
        res.render('addpost',{
            "errors":errors,
        });
    }else{
        var categories=db.get('categories');
        categories.insert({
            "name":name,
        }, function(err, post){
              if(err){
                  res.send(err);
              }else{
                  req.flash('success','Category Added');
                  //for redirecting back to homepage
                  res.location('/');
                  res.redirect('/')
              }  
        })
    }

});


module.exports = router;
