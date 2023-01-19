const createError = require('http-errors')
const express = require('express');
const ejs = require('ejs');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv').config();
const nocache = require('nocache');
const session = require('express-session');
const multer = require('multer');
const onHeaders = require('on-headers');


//importing all routes
var indexRoute = require('./routes/index-route');
var usersRoute = require('./routes/users-route');
var adminRoute = require('./routes/admin-route');


//connecting to database
const dbConnection = require('./database/connection');
dbConnection.connectDB();


const app = express();

app.locals.email;
app.locals.user;

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(logger('dev'));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));

//session cookie and nocache
app.use(nocache());
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));
app.disable('view cache');



// view engine setup
app.set('view engine','ejs');
app.set('views', [path.join(__dirname,'views'),path.join(__dirname,'views/admin'),path.join(__dirname,'views/users')]);

//configuring routes
app.use('/',indexRoute);
app.use('/users',usersRoute)
app.use('/admin',adminRoute);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
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

const port = process.env.PORT || 3001;
app.listen(port,()=>console.log(`Server started listening at ${port}`));

