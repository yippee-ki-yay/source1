require('dotenv').load();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var uglifyJs = require("uglify-js");
var fs = require('fs');
var passport = require('passport');

require('./app_api/models/db');
require('./app_api/config/passport');

// (commented out because routes in the server are not used)
// var routes = require('./app_server/routes/index');
var routesApi = require('./app_api/routes/index');

var app = express();

// (commented out because not using jade to display anything in app_server/views)
// view engine setup
// app.set('views', path.join(__dirname, 'app_server', 'views'));
// app.set('view engine', 'jade');

// (commented out to debug better.  these are now in app_client/index.html)
var appClientFiles = [
  'app_client/app.js',
  'app_client/home/home.controller.js',
  'app_client/addLocationModal/addLocationModal.controller.js',
  'app_client/issues/issueHome/issueHome.controller.js',
  'app_client/issues/issueDetail/issueDetail.controller.js',
  'app_client/issues/newIssueModal/newIssueModal.controller.js',
  'app_client/issues/issueCommentModal/issueCommentModal.controller.js',
  'app_client/appointments/appointmentHome/appointmentHome.controller.js',
  'app_client/appointments/appointmentDetail/appointmentDetail.controller.js',
  'app_client/about/about.controller.js',
  'app_client/auth/login/login.controller.js',
  'app_client/auth/register/register.controller.js',
  'app_client/locationDetail/locationDetail.controller.js',
  'app_client/reviewModal/reviewModal.controller.js',
  'app_client/common/services/authentication.service.js',
  'app_client/common/services/geolocation.service.js',
  'app_client/common/services/loc8rData.service.js',
  'app_client/common/filters/formatDistance.filter.js',
  'app_client/common/filters/addHtmlLineBreaks.filter.js',
  'app_client/common/directives/navigation/navigation.controller.js',
  'app_client/common/directives/navigation/navigation.directive.js',
  'app_client/common/directives/footerGeneric/footerGeneric.directive.js',
  'app_client/common/directives/pageHeader/pageHeader.directive.js',
  'app_client/common/directives/ratingStars/ratingStars.directive.js'
];
var uglified = uglifyJs.minify(appClientFiles, { compress : false });

fs.writeFile('public/angular/loc8r.min.js', uglified.code, function (err){
  if(err) {
    console.log(err);
  } else {
    console.log("Script generated and saved:", 'loc8r.min.js');
  }
});

// (uncomment after placing your favicon in /public)
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));

// (commented out because ...)
//app.use(passport.initialize());

// (commented out because not using any routing from app_server/routes)
// app.use('/', routes);
app.use('/api', routesApi);

// says the next place to go?
app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
});


/* !!!! ERROR HANDLERS !!!! */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

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

// exports all the app. stuff (to where?)
module.exports = app;