const mg = require("mongoose");
const Schema = mg.Schema, ObjectId = Schema.ObjectId;
const moment = require("moment");

const { respondWithError, responderException } = require('../utilities/responder');
const { dbStringSanitizer } = require('../utilities/supportFunctions');

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
            mg.model("users").findOne({ username: dbStringSanitizer(userData.username_extract), isDeleted: false }, function(errUser, existingUser) {
                console.log("middleware data on user existence check", existingUser);

                if (!errUser && existingUser) {
                    userData.users = existingUser;

                    mg.model("loginSessions").findOne({ userId: mg.Types.ObjectId(userData.users._id), sessionId: dbStringSanitizer(userData.sessionId_extract), isExpired: false}, function(err, existingSession){
                        console.log("middleware data on sessionId existence check", existingSession);

                        if (!err && existingSession) {
                            const date = moment(existingSession.expiresOn, 'YYYY-MM-DD HH:mm:ss');
                            const now = moment();

                            if(!date.isAfter(now)) {
                                userData.loginSessions = existingSession;
                                req.userData = userData;
                                next();
                            } else {
                                // Update session expired update it
                                mg.model("loginSessions").updateOne({userId: mg.Types.ObjectId(userData.users._id)}, {isExpired: false, expiresOn: moment(dateTime).format("YYYY-MM-DD HH:mm:ss")}, function(expiredError, expired){
                                    if (expiredError || !expired){
                                        console.log('User Session @ ' + existingSession._id + ' expiration failed', expired);
                                        mg.disconnect();

                                        // throw new responderException("Login sessionId has expired... Error!", null, "209");
                                        respondWithError(res, "Encounted an Unknown Error... Problem with SessionId!", expiredError, "202");
                                    } else {
                                        console.log('User Session @ ' + existingSession._id + ' was expired succesfully', expired);
                                        mg.disconnect();

                                        // throw new responderException("Login sessionId has expired... Error!", null, "209");
                                        respondWithError(res, "Login SessionId has expired... Error!", null, "209");
                                    }
                                });

                                mg.disconnect();
                                // throw new responderException("Login sessionId has expired... Error!", null, "209");
                                respondWithError(res, "Login SessionId has expired... Error!", null, "209");
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
            respondWithError(res, error.message, error.data, error.responseCode);
        }
    } else {
        console.log("No middleware needed for this route", req.originalUrl);
        next();
    }
}