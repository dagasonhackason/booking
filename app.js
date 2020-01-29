var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mg = require("mongoose");
let fs =require("fs");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let loginRouter = require("./routes/login");
let registerRouter = require("./routes/register");
let confirmRouter = require("./routes/confirm");
let dashRouter = require("./routes/dash");
let configureRouter = require("./routes/configure");
let bookingsRouter = require("./routes/bookings");
let showTicketRouter = require("./routes/showticket");

///////// API ROUTES /////////
let apiSeatRouter = require("./routes/apiSeats");
let apiUsersRouter = require("./routes/apiUsers")
let apiBookingsRouter = require("./routes/apiBookings");

//load all mongoose models
fs.readdirSync(__dirname + "/models").forEach((filename)=>{
  if(~filename.indexOf(".js")){
    require(__dirname+"/models/"+filename)
  }
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//database connection
mg.connect("mongodb://127.0.0.1:27017/seatbooking");



// mg.model("seats").find((error,users)=>{
//   if(error){
//     console.error(error);
//   }
//   else{
//     console.log(users);
//     console.log("from mongo");
    
//   }
// });

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/confirm", confirmRouter);
app.use("/dash", dashRouter);
app.use("/configure", configureRouter);
app.use("/bookings", bookingsRouter);
app.use("/showticket", showTicketRouter);

///////// API ROUTES /////////
app.use("/api/seats", apiSeatRouter);
app.use("/api/users", apiUsersRouter);
app.use("/api/bookings", apiBookingsRouter);

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
