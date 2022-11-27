var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOverride = require('method-override');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();
// route ke admin
const adminRouter = require('./routes/admin');
const apiRouter = require("./routes/api");
let localDB =  process.env.LOCAL_DB;
let deployDB =  process.env.DEPLOY_DB;


//import mongoose
const mongoose = require("mongoose");
mongoose.connect(localDB, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

// mongoose.connect('mongodb://localhost:27017/nusa', {
//   useNewUrlParser: true, 
//   useUnifiedTopology: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// })
.then(() => console.log("DB NUSA is connected"))
.catch((err) => console.log("NOT CONNECT " , err));

// ini route ke index.ejs (login)

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // ini nanti di uncomment buat max time session nya
  cookie: { maxAge: 500000 }
}))
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//admin
app.use('/admin', adminRouter);
app.use("/api/v1", apiRouter);

//ini init static untuk arahin path css dari sb admin
app.use(
  "/sb-admin-2",
  express.static(path.join(__dirname, "node_modules/startbootstrap-sb-admin-2"))
);
app.use(
  "/fullcalendar",
  express.static(path.join(__dirname, "node_modules/fullcalendar"))
);
app.use(
  "/dayjs",
  express.static(path.join(__dirname, "node_modules/dayjs"))
);

app.use(
  "/isBetween",
  express.static(path.join(__dirname, "node_modules/dayjs/plugin/isBetween"))
  
);





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
app.locals.moment = require('moment');
app.locals.dayjs = require('dayjs');
app.locals.isBetween = require('dayjs/plugin/isBetween');
module.exports = app;
