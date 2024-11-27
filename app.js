let createError = require('http-errors');
let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let session = require('express-session')
let logger = require('morgan');
const DateMixin = require('./model/date_mixin');

let indexRouter = require('./routes/index');
let hospitalRouter = require('./routes/hospitals');
let devicesRouter = require('./routes/devices');
let versionRouter = require('./routes/version');
let userRouter = require('./routes/users');
let uploadRouter = require('./routes/uploader');
let deviceRegisterRouter = require('./routes/device_register');
const {UPLOAD_PATH} = require("./model/config");

//添加日期mixin混入
Object.assign(Date.prototype,DateMixin);


let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//set session
app.use(session({
  secret:'Hello#1234@',
  resave:false,
  saveUninitialized:true,
  rolling:true,//用户每次有操作，就会刷新token的过期时间
  cookie:{secure:false,httpOnly:true,maxAge:30*60*1000},
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//配置文件访问
app.use('/file', express.static(UPLOAD_PATH));

app.use('/', indexRouter);
app.use('/hospital',hospitalRouter)
app.use('/device',devicesRouter)
app.use('/version',versionRouter)
app.use('/user',userRouter)
app.use('/upload',uploadRouter)
app.use('/pro',deviceRegisterRouter)

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
