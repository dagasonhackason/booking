require('dotenv').config();
const mg = require("mongoose");
const Schema = mg.Schema, ObjectId = Schema.ObjectId;
const moment = require("moment");

const { respondWithError, responderException } = require('../utilities/responder');
const { dbStringSanitizer, jwtVerifyToken } = require('../utilities/supportFunctions');
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

const Users = require('../models/users');
const LoginSessions = require('../models/loginSessions');

module.exports = (req, res, next) => {
    let dontUseMiddleWare = true;
    let disallowed = [
        "/api/users/login", 
        "/api/users/create",
        "/api/bookings/create",
        "/api/seats",
        "/api/users/login/", 
        "/api/users/create/",
        "/api/bookings/create/",
        "/api/seats/"
    ];
    
    console.log("current authMiddleware route hitting req.originalUrl ", req.originalUrl);

    for(let i = 0; i < disallowed.length; i++) {
        if(req.originalUrl === disallowed[i]) {
            dontUseMiddleWare = false;
        }
    };

    if(dontUseMiddleWare) {
        mg.connect(MONGODB_CONNECTION_STRING);

        const sessionId_extract = req.get("sessionId") || req.body.sessionId || req.query.sessionId;
        const username_extract = ("" + req.get("username")).toLocaleLowerCase() || ("" + req.query.username).toLocaleLowerCase();

        if(!sessionId_extract && !username_extract) {
            return respondWithError(res, "You must provide a sessionId!", null, "209");
        }

        console.log("current username extracted", username_extract);
        console.log("current sessionId extracted", sessionId_extract);

        let wasJWTVerified = jwtVerifyToken(sessionId_extract);

        let userData = {};
        userData.sessionId_extract = sessionId_extract;
        userData.username_extract = ("" + username_extract).toLocaleLowerCase();

        console.log("userData.sessionId_extract", userData.sessionId_extract);
        console.log("userData.username_extract", ("" + userData.username_extract).toLocaleLowerCase());

        if(wasJWTVerified !== null) {
            console.log("wasJWTVerified! decoded token " + sessionId_extract + " to ::: ", wasJWTVerified);
            wasJWTVerified = JSON.parse(JSON.stringify(jwtVerifyToken(sessionId_extract)));
            console.log("getting jwt token passed " + !moment(moment(moment.unix(wasJWTVerified.exp).utc()).format("YYYY-MM-DD HH:mm:ss")).isAfter() + " expirey time", moment(moment.unix(wasJWTVerified.exp).utc()).format("YYYY-MM-DD HH:mm:ss"));

            if(moment(moment.unix(wasJWTVerified.exp).utc().format("YYYY-MM-DD HH:mm:ss")).isAfter()) {
                try {
                    Users.findOne({ username: dbStringSanitizer(("" + userData.username_extract).toLocaleLowerCase()), isDeleted: false }, function(errUser, existingUser) {
                        console.log("middleware data on user existence check", existingUser);
    
                        if (!errUser && existingUser) {
                            userData.users = existingUser;
    
                            LoginSessions.findOne({ userId: mg.Types.ObjectId(userData.users._id), sessionId: dbStringSanitizer(userData.sessionId_extract), isExpired: false}, function(err, existingSession){
                                console.log("middleware data on sessionId existence check", existingSession);
    
                                if (!err && existingSession) {
                                    const date = moment(existingSession.expiresOn, 'YYYY-MM-DD HH:mm:ss');
                                    let dateTime = new Date();
                                    const now = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
    
                                    if(moment(date.format("YYYY-MM-DD HH:mm:ss")).isAfter()) {
                                        userData.loginSessions = existingSession;
                                        req.userData = userData;
                                        next();
                                    } else {
                                        // Update session expired update it
                                        console.log("the loginexpiry date of " + moment(date).format("YYYY-MM-DD HH:mm:ss") + " is after " + now);
                                        LoginSessions.updateOne({_id: mg.Types.ObjectId(existingSession._id)}, {$set: {isExpired: true, loggedOutOn: moment(dateTime).format("YYYY-MM-DD HH:mm:ss"), loggedOutBy: mg.Types.ObjectId(userData.users._id)}}, {upsert: true}, function(expiredError, expired){
                                            if (expiredError){
                                                console.log('User Session @ ' + existingSession._id + ' expiration failed', expired);
                                                mg.disconnect();
    
                                                // throw new responderException("Login sessionId has expired... Error!", null, "209");
                                                respondWithError(res, "Encounted an Unknown Error... Problem with SessionId!", expiredError, "202");
                                            } else {
                                                console.log('User Session @ ' + existingSession._id + ' was expired succesfully', expired);
                                                mg.disconnect();
    
                                                // throw new responderException("Login sessionId has expired... Error!", null, "209");
                                                respondWithError(res, "Login SessionId has expired... Error!", expiredError, "209");
                                            }
                                        });
    
                                        mg.disconnect();
                                        // throw new responderException("Login sessionId has expired... Error!", null, "209");
                                        respondWithError(res, "Login SessionId has expired..... Error!", err, "209");
                                    }
                                } else {
                                    mg.disconnect();
    
                                    // throw new responderException("No such sessionId... Error!", null, "202");
                                    respondWithError(res, "No such SessionId... Error!", err, "202");
                                }
                            });
                        } else {
                            mg.disconnect();
    
                            // throw new responderException("The Problem with ur sessionId Auth Details... Please try again!", null, "205");
                            respondWithError(res, "The Problem with ur SessionId Auth Details... Please try again!", errUser, "205");
                        }
                    });
                } catch(error) {
                    mg.disconnect();
                    console.log("SessionId Middleware Proccessing Failed!", error);
                    respondWithError(res, "SessionId Middleware Proccessing Failed!", null, "205");
                }
            } else {
                mg.disconnect();
                console.log("SessionId Middleware Proccessing Failed! Token expired!", wasJWTVerified);
                respondWithError(res, "SessionId Middleware Proccessing Failed! Token expired!", null, "205");
            }
        } else {
            mg.disconnect();
            console.log("SessionId Middleware Proccessing Failed! Invalid Token Passed!", wasJWTVerified);
            respondWithError(res, "SessionId Middleware Proccessing Failed! Invalid Token Passed!", null, "205");
        }
    } else {
        console.log("No middleware needed for this route", req.originalUrl);
        next();
    }
}