const mg = require("mongoose");
const Schema = mg.Schema, ObjectId = Schema.ObjectId;
const moment = require("moment");

const { respondWithError, responderException } = require('../utilities/responder');
const { dbStringSanitizer } = require('../utilities/supportFunctions');

module.exports = (req, res, next) => {
    let useMiddleWare = false;
    let disallowed = [
        "/api/users/login", 
        "/api/users/create",
        "/api/bookings/create",
        "/api/seats",
    ];
    
    console.log("current authMiddleware route hitting req.originalUrl ", req.originalUrl);

    for(let i = 0; i < disallowed.length; i++) {
        if(req.originalUrl === disallowed[i]) {
            useMiddleWare = true;
        }
    };

    if(!useMiddleWare) {
        mg.connect("mongodb://127.0.0.1:27017/seatbooking");

        const sessionId_extract = req.get("sessionId") || req.body.sessionId || req.query.sessionId;
        const username_extract = req.get("username") || req.query.username;

        if(!sessionId_extract && !username_extract) {
            return respondWithError(res, "You must provide a sessionId!", null, "209");
        }

        let userData = {};
        userData.sessionId_extract = sessionId_extract;
        userData.username_extract = username_extract;

        console.log("userData.sessionId_extract", userData.sessionId_extract);
        console.log("userData.username_extract", userData.username_extract);

        try {
            mg.model("users").findOne({ username: dbStringSanitizer(userData.username_extract), isDeleted: false }, function(errUser, existingUser){
                console.log("middleware data on user existence check", existingUser);

                if (!errUser && existingUser) {
                    userData.users = existingUser;

                    mg.model("loginSessions").findOne({ userId: userData.users._id, sessionId: dbStringSanitizer(userData.sessionId_extract), isExpired: false }, function(err, existingSession){
                        console.log("middleware data on sessionId existence check", existingSession);

                        if (!err && existingSession) {
                            if(!moment(new Date()).format("YYYY-MM-DD HH:mm:ss").isAfter(existingSession.expiresOn)) {
                                userData.loginSessions = existingSession;
                                req.userData = userData;
                                next();
                            } else {
                                throw new responderException("Login sessionId has expired... Error!", null, "209");
                            }

                        } else {
                            throw new responderException("No such sessionId... Error!", null, "202");
                        }
                    });
                } else {
                    throw new responderException("User Already exist... Error!", null, "205");
                }
            });
        } catch(error) {
            console.log("SessionId Middleware Proccessing Failed!", error);
            return respondWithError(res, error.message, error.data, error.responseCode);
        }
    } else {
        console.log("No middleware needed for this route", req.path);
        next();
    }
}