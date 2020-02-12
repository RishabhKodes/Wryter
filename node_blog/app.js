var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongo = require('mongodb');
var session = require('express-session');
var multer = require('multer');
var flash = require('connect-flash');
var upload = multer({dest:'uploads/'})
var moment = require('moment');
var expressValidator = require('express-validator');
var monk =require('monk');
const url = 'localhost:27017/nodeblog';
const db = monk(url);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
//middleware

//express-session
app.use(session({
  secret:'secret',
  saveUninitialized:true,
  resave:true
}));

//express-validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length){
      formParam += '[' +namespace.shift() +']';
    }
    return{
      param:formParam,
      msg:msg,
      value:value 
    };
  }
}));
//connect-flash
app.use(flash());
app.use(function(req,res,next){
  res.locals.messages=require('express-messages')(req,res);
  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//making db accessible to our router
app.use(function(req,res,next){
  req.db=db;
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
  // throw err;
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
