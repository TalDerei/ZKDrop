/** 
 * REST APIs based on Node.js, Express.js and MongoDB
 */

// load and cache javascript modules stored in node_modules directory
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// set up routes
var indexRoute = require('./routes/index')
// var merkleTreeRoute = require('./routes/merkleTree');
const { ppid } = require('process');

// store MongoDB URI connection in .env file
dotenv.config({ path : '.env'});

// express instantiates server instance 
var app = express();

// connect to MongoDB database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true});
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

// HTML engine templating
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// middleware functions
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes 
app.use('/', indexRoute);
// app.use('/merkleTree', merkleTreeRoute);

// error handling
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;