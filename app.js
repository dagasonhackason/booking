
require('console-stamp')(console, '[HH:MM:ss.l]');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mg = require("mongoose");
const fs = require("fs");
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
app.use(logger(':date[clf] ":method :url"'));
// express.logger.format('mydate', function() {
//   var df = require('console-stamp/node_modules/dateformat');
//   return df(new Date(), 'HH:MM:ss.l');
// });
// app.use(express.logger('[:mydate] :method :url :status :res[content-length] - :remote-addr - :response-time ms'));
/*********************** LOGGING CONSOLE TO FILE STREAM ***********************/
var access = fs.createWriteStream((path.join(__dirname, 'logs_to_file_generated') + "/" + moment(new Date).format("YYYY-MM-DD") + "-") + 'node.access.bslog', { flags: 'a' });
var error = fs.createWriteStream((path.join(__dirname, 'logs_to_file_generated') + "/" + moment(new Date).format("YYYY-MM-DD") + "-") + 'node.error.bslog', { flags: 'a' });
////////////////////////////////////
process.stdout.write = access.write.bind(access);
process.stderr.write = error.write.bind(error);
////////////////////////////////////
process.on('uncaughtException', function(err) {
  console.error((err && err.stack) ? err.stack : err);
});
/******************************************************************************/
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
mg.set('debug', true);
// mg.set('debug', function (coll, method, query, doc [, options]) {
//   //TODO :
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

///////// API LOGGING /////////
//Let's Log app usage full trace
app.use((req, res, next) => {
  console.log("Calling app logger");
  res.on('finish', () => {
      console.log("Finishing")
      if(req.userData) {
        //valid and existing sessionId usage
        console.log("Valid sessionId, logging");
        const data = {
          req_sessionId_extract: req.userData.sessionId_extract,
          req_username_extract: req.userData.username_extract,
          req_loginSession: req.userData.loginSessions,
          req_user: req.userData.users,
          req_route: req.originalUrl,
          req_ip_address: req.ip,
          request_payload: {
              headers: req.headers,
              params: req.params,
              body: req.body,
              query: req.query
          },
          res_status_code: res.statusCode,
          res_status_message: res.statusMessage,
          response_payload: {
              headers: res._header,
              body: res.__body,
          },
          created_at: new Date()
        };

        // Let's Keep taps with our file logs
        fs.exists((path.join(__dirname, 'logs_to_file_generated') + "/" + moment(new Date).format("YYYY-MM-DD") + ".bslog"), function(exists) {
          if(exists) {
            fs.appendFile((path.join(__dirname, 'logs_to_file_generated') + "/" + moment(new Date).format("YYYY-MM-DD") + "-app.usage.bslog"), "\n:::::" + moment(new Date).format("YYYY-MM-DD HH:mm:ss") + " :: NEW APP USAGE \n___________________________________________________\n"
                + "\n" + JSON.stringify(data, null, 4) + "\n"
                + "\n___________________________________________________\n", function (err) {
              if (err) console.error("Could not file log app usage! - " + moment(new Date).format("YYYY-MM-DD HH:mm:ss"), data);
              console.log("App usage logged! - " + moment(new Date).format("YYYY-MM-DD HH:mm:ss"), data);
            }); 
          } else {
            fs.writeFile((path.join(__dirname, 'logs_to_file_generated') + "/" + moment(new Date).format("YYYY-MM-DD") + "-app.usage.bslog"), "\n:::::" + moment(new Date).format("YYYY-MM-DD HH:mm:ss") + " :: NEW APP USAGE \n___________________________________________________\n"
                + "\n" + JSON.stringify(data, null, 4) + "\n"
                + "\n___________________________________________________\n", function (err) {
              if (err) console.error("Could not file log app usage! - " + moment(new Date).format("YYYY-MM-DD HH:mm:ss"), data);
              console.log("App usage logged! - " + moment(new Date).format("YYYY-MM-DD HH:mm:ss"), data);
            }); 
          }
        });
      } else {
        console.log("No sessionId used");
        
        const data = {
          req_route: req.originalUrl,
          req_ip_address: req.ip,
          request_payload: {
              headers: req.headers,
              params: req.params,
              body: req.body,
              query: req.query
          },
          res_status_code: res.statusCode,
          res_status_message: res.statusMessage,
          response_payload: {
              headers: res._header,
              body: res.__body,
          },
          created_at: new Date()
        };

        // Let's Keep taps with our file logs
        fs.exists((path.join(__dirname, 'logs_to_file_generated') + "/" + moment(new Date).format("YYYY-MM-DD") + "-app.usage.bslog"), function(exists) {
          if(exists) {
            fs.appendFile((path.join(__dirname, 'logs_to_file_generated') + "/" + moment(new Date).format("YYYY-MM-DD") + "-app.usage.bslog"), "\n:::::" + moment(new Date).format("YYYY-MM-DD HH:mm:ss") + " :: NEW APP USAGE \n___________________________________________________\n"
                + "\n" + JSON.stringify(data, null, 4) + "\n"
                + "\n___________________________________________________\n", function (err) {
              if (err) console.error("Could not file log app usage! - " + moment(new Date).format("YYYY-MM-DD HH:mm:ss"), data);
              console.log("App usage logged! - " + moment(new Date).format("YYYY-MM-DD HH:mm:ss"), data);
            }); 
          } else {
            fs.writeFile((path.join(__dirname, 'logs_to_file_generated') + "/" + moment(new Date).format("YYYY-MM-DD") + "-app.usage.bslog"), "\n:::::" + moment(new Date).format("YYYY-MM-DD HH:mm:ss") + " :: NEW APP USAGE \n___________________________________________________\n"
                + "\n" + JSON.stringify(data, null, 4) + "\n"
                + "\n___________________________________________________\n", function (err) {
              if (err) console.error("Could not file log app usage! - " + moment(new Date).format("YYYY-MM-DD HH:mm:ss"), data);
              console.log("App usage logged! - " + moment(new Date).format("YYYY-MM-DD HH:mm:ss"), data);
            }); 
          }
        });
      }
  });
  next();
});

///////// API ROUTES /////////
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
