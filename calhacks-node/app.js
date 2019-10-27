var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var locationRouter = require('./routes/locationRouter');
//var smsRouter = require('./routes/smsRouter');

const mongoose = require('mongoose');

const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });

//TWILIO COMMUNICATION START
const http = require('http');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const { urlencoded } = require('body-parser');
var request = require("request");

var users_dictionary = {};

var app = express();
app.use(urlencoded({ extended: false }));

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  msg = ''
  console.log(`Incoming message from ${req.body.From}: ${req.body.Body}`);
  if (req.body.Body.toLowerCase() === 'food'){
    twiml.message('Please enter your zip code.')
    users_dictionary[req.body.From] = [];
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  } else if (parseInt(req.body.Body, 10) >= 10000 && parseInt(req.body.Body, 10) < 100000 && req.body.From in users_dictionary){ //doesn't account for 0 as first integer
    request("http://localhost:3001/find-locations/"+req.body.Body, function(error, response, body) {
      var i = 1;
      console.log(body);
      for (item of JSON.parse(body)){
        console.log(i.toString() + ") " + item.name + ", " + item.streetAddress + "\n" + item.accomodations[0].description);
        twiml.message(i.toString() + ") " + item.name + ", " + item.streetAddress + " " + item.accomodations[0].description);
        users_dictionary[req.body.From].push(item._id);
        i = i + 1;
      }
      twiml.message('Please return the number corresponding to your desired choice for a MealStop.')
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    });
  } else if (req.body.From in users_dictionary && users_dictionary[req.body.From] !== [] && parseInt(req.body.Body, 10) <= users_dictionary[req.body.From].length) {
    final_location = users_dictionary[req.body.From][parseInt(req.body.Body, 10) - 1];
    twiml.message('You are welcome at that MealStop!');
    request({
      uri: "http://localhost:3001/decrement/"+final_location.toString(),
      method: "PUT"
    }, function(error, response, body) {});
    delete users_dictionary[req.body.From];
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  } else {
    twiml.message('Not a valid message.')
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  }
  
});
//TWILIO COMMUNICATION END

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', locationRouter);
//app.use('/sms', smsRouter);
//app.use('/', indexRouter);
app.use('/users', usersRouter);

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

module.exports = app;


const sms = express();


app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();

  twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});
