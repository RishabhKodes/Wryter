var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest:'./public/images'});
var mongoose =require('mongoose');
var monk =require('monk');
const url = 'localhost:27017/nodeblog';
const db = monk(url);
var mongo = require('mongodb');


router.get('/add', function(req, res, next) {

    var categories = db.get('categories');

    categories.find({},{},function(err, categories){
        res.render('addpost',{
            'title': 'Add Post',
            'categories':categories
        })        
    })
    
});

// router.get('/show/:id', function(req, res, next) {
//     var posts = db.get('posts');

//     posts.findById(req.params.id,function(err, post){
//         res.render('show',{
//             'post':post
//         });        
//     });
    
// });


router.get('/show/:id', function(req, res, next) {
    var posts = db.get('posts');

    posts.findOne(req.params.id,function(err,post){ 
        res.render('show',{
            'post':post
        });
    });        
    
});

router.post('/add',upload.single('mainimage'),function(req, res, next) {
    //to get form values
    var title = req.body.title;
    var category = req.body.category;
    var body = req.body.body;
    var author = req.body.author;

    //to check if file is loaded correctly
    if(req.file){
            var mainimage =req.file.filename;
    }else{
        var mainimage='no-image.jpg'
    }

    //form validation
    req.checkBody('title','Title is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();

    //to check errors
    var errors =req.validationErrors();

    if(errors){
        res.render('addpost',{
            "errors":errors,
        });
    }else{
        var posts=db.get('posts');
        posts.insert({
            "title":title,
            "body":body,
            "category":category,
            "author":author,
            "image":mainimage 
        }, function(err, post){
              if(err){
                  res.send(err);
                  console.log('Post not added')
              }else{
                  req.flash('success','Post Added');
                  //for redirecting back to homepage
                  res.location('/');
                  res.redirect('/')
              }  
        })
    }

});


router.post('/addcomment',function(req, res, next) {
    //to get form values
    var name = req.body.name;
    var email = req.body.email;
    var body = req.body.body;
    var postid = req.body.postid;
    var date = new Date();

    //to check errors
    var errors =req.validationErrors();

    if(errors){
        var posts=db.get('posts');
        posts.findOne(postid, function(err, post){
            res.render('show',{
                "errors":errors,
                "post":post
            });
        });
        
    }else{
    var comment = {
        "name":name,
        "email":email,
        "body":body,
        "commentdate":date
    }
     
    var posts=db.get('posts');
    posts.update({
        "_id":postid,   
    },{
        $push:{
            "comments":comment
        }
    }, function(err, doc){
        if(err){
            throw err;
        }else{
            req.flash('success','Comment Added');
            res.location('/posts/show/'+postid);
            res.redirect('/posts/show/'+postid);
        }
    })

}})


module.exports = router;