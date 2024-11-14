let createError = require('http-errors');
let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let session = require('express-session')
let logger = require('morgan');

let indexRouter = require('./routes/index');
let hospitalRouter = require('./routes/hospitals');
let devicesRouter = require('./routes/devices');
let versionRouter = require('./routes/version');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//set session
app.use(session({
  secret:'Hello#1234@',
  resave:false,
  saveUninitialized:true,
  cookie:{secure:false}
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/hospital',hospitalRouter)
app.use('/devices',devicesRouter)
app.use('/version',versionRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
//session user

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
