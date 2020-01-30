var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mg = require("mongoose");
let fs =require("fs");
const cors = require('cors');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const moment = require("moment");

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
let apiVersionRouter = require("./routes/apiVersion");

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
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '300mb',
}));
app.use(bodyParser.json({limit: '300mb'}));
app.use(validator());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//database connection
mg.connect("mongodb://127.0.0.1:27017/seatbooking");

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
//Let's Log app usage full trace
app.use((req, res, next) => {
  console.log("Calling app logger");
  res.on('finish', () => {
      console.log("Finishing")
      if(req.user) {
          //valid and existing api key usage
          console.log("Valid sessionId, logging");
          const data = {
              req_sessionId_extract: req.userData.sessionId_extract,
              req_username_extract: req.userData.username_extract,
              req_loginSession: req.userData.loginSessions,
              req_user: req.userData.users,
              req_route: req.route.path,
              req_ip_address: req.ip,
              req_location: req.location,
              request_payload: JSON.stringify({
                  headers: req.headers,
                  params: req.params,
                  body: req.body,
                  query: req.query
              }),
              res_status_code: res.statusCode,
              res_status_message: res.statusMessage,
              response_payload: JSON.stringify({
                  headers: res._header,
                  body: res.__body,
              }),
              created_at: new Date(),
          };

          // Let's Keep taps with our file logs
          fs.exists((path.join(__dirname, 'logs_to_file_generated') + "/" + moment(new Date).format("YYYY-MM-DD") + ".log"), function(exists) {
            if(exists) {
              fs.appendFile((path.join(__dirname, 'logs_to_file_generated') + "/" + moment(new Date).format("YYYY-MM-DD") + ".log"), ":::::" + moment(new Date).format("YYYY-MM-DD HH:mm:ss") + " :: NEW APP USAGE \n___________________________________________________\n"
                    + "\n" + JSON.stringify(data) + "\n"
                    + "\n___________________________________________________\n", function (err) {
                if (err) console.error("Could not file log app usage! - " + moment(new Date).format("YYYY-MM-DD HH:mm:ss"), data);
                console.log("App usage logged! - " + moment(new Date).format("YYYY-MM-DD HH:mm:ss"), data);
              }).catch(error => {
                  console.error("Could not file log app usage! - " + moment(new Date).format("YYYY-MM-DD HH:mm:ss"), data);
              }); 
            } else {
              fs.writeFile((path.join(__dirname, 'logs_to_file_generated') + "/" + moment(new Date).format("YYYY-MM-DD") + ".log"), ":::::" + moment(new Date).format("YYYY-MM-DD HH:mm:ss") + " :: NEW APP USAGE \n___________________________________________________\n"
                    + "\n" + JSON.stringify(data) + "\n"
                    + "\n___________________________________________________\n", function (err) {
                if (err) console.error("Could not file log app usage! - " + moment(new Date).format("YYYY-MM-DD HH:mm:ss"), data);
                console.log("App usage logged! - " + moment(new Date).format("YYYY-MM-DD HH:mm:ss"), data);
              }).catch(error => {
                  console.error("Could not file log app usage! - " + moment(new Date).format("YYYY-MM-DD HH:mm:ss"), data);
              }); 
            }
          });
      }
      else {
          console.log("Not a sessionId used");
      }
  });
  next();
});
app.use("/api/seats", apiSeatRouter);
app.use("/api/users", apiUsersRouter);
app.use("/api/bookings", apiBookingsRouter);
app.use("/api", apiVersionRouter);

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
