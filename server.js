var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('VWiC:server');
var users = require('./routes/users');
var stories = require('./routes/story');
var events = require('./routes/event');

var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:vwic15@ds061984.mongolab.com:61984/vwic');

var passport = require('passport');
var flash    = require('connect-flash');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname + '/css'));
app.use('/fonts', express.static(__dirname + '/fonts'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/js', express.static(__dirname + '/js'));

require('./config/passport')(passport); // pass passport for configuration
// required for passport
var expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

var routes = require('./routes/index')(passport);
app.use('/', routes);
app.use('/user', users);
app.use('/story', stories);
app.use('/event', events);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var http = require('http');

/**
 * Get port from environment and store in Express.
 */

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
 var server_port = process.env.OPENSHIFT_NODEJS_PORT
 var server_ip_address = process.env.OPENSHIFT_NODEJS_IP

 server.listen(server_port, server_ip_address, function () {
   console.log( 'Listening on ' + server_ip_address + ', server_port ' + server_port )
 });

module.exports = app;
