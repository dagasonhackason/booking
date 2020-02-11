
const express = require("express");
const router = express.Router();
const mg = require("mongoose");
const Schema = mg.Schema, ObjectId = Schema.ObjectId;
const moment = require("moment");

const APIUsersRequestValidator = require('../validators/APIUsersRequestValidator');
const validate = require('../middlewares/validateMiddleware');
const auth = require('../middlewares/authMiddleware');

const { 
    meetsPasswordPolicyMax, 
    meetsPasswordPolicyMin,
    dbStringSanitizer,
    getRandomInt,
    hashPassword,
    checkPassword,
    generateSalt,
    jwtSignTokenizer 
} = require('../utilities/supportFunctions');

const { respondWithSuccess, respondWithError } = require('../utilities/responder');

router.use(auth);

router.post("/create", (req, res, next)=>{
    console.log("New Incoming create user Request", req.body);
    mg.connect("mongodb://127.0.0.1:27017/seatbooking");
    var dateTime = new Date();

    if(req.body.username && req.body.password && req.body.secretCode) {
        let buff = new Buffer(req.body.password, 'base64');
        let password = buff.toString('ascii');

        var salt = generateSalt();
        var hashedPassword = hashPassword( dbStringSanitizer(password), salt );

        if(meetsPasswordPolicyMax(password) && meetsPasswordPolicyMin(password)) {
            if(checkPassword( password, salt, hashedPassword )) {
                mg.model("users").findOne({ username: dbStringSanitizer(req.body.username), isDeleted: false }, function(err,existingUser){
                    if (!err && !existingUser) {
                        console.log("user data on existence before creation check", existingUser);
                        mg.model("users").create({_id: mg.Types.ObjectId(), username: dbStringSanitizer(req.body.username), password: hashedPassword, passwordSalt: salt, createdOn: moment(dateTime).format("YYYY-MM-DD HH:mm:ss"), updatedOn: "", updatedBy: null, lastLoginOn: "", isDeleted: false}, function (error,insertResponse) {
                            if(error) {
                                res.status(200).json({
                                    status: "error",
                                    responseCode: "202",
                                    responseMessage: "User Creation Failed with an Unknown Error!",
                                    data: error
                                });

                                mg.disconnect();
                    
                                return;
                            }
                            else{
                                console.log("from mongo insert user", insertResponse);
                                insertResponse = JSON.parse(JSON.stringify(insertResponse));

                                if(insertResponse.password) {
                                    delete insertResponse.password;
                                } 
                                
                                if(insertResponse.passwordSalt) {
                                    delete insertResponse.passwordSalt;
                                }

                                res.status(200).json({
                                    status: "success",
                                    responseCode: "201",
                                    responseMessage: "User Creation was Successful!",
                                    data: insertResponse
                                });
                                
                                mg.disconnect();
            
                                return;
                            }
                        }).select('-password');
                    } else {
                        res.status(200).json({
                            status: "error",
                            responseCode: "205",
                            responseMessage: "User Already exist... Error!",
                            data: err
                        });

                        mg.disconnect();
            
                        return;
                    }
                }).select('-password');
            } else {
                res.status(200).json({
                    status: "error",
                    responseCode: "202",
                    responseMessage: "User Creation Failed with an Unknown Error!",
                    data: null
                });

                mg.disconnect();

                return;
            }
        } else {
            res.status(200).json({
                status: "error",
                responseCode: "202",
                responseMessage: "Sorry, password cannot be less than 8 charaters or more than 30 characters, its our password policy... Try again!",
                data: null
            });
            
            mg.disconnect();

            return;
        }
    } else {
        res.status(200).json({
            status: "error",
            responseCode: "208",
            responseMessage: "Please Fill all required fields and try again... Try again!",
            data: null
        });
        
        mg.disconnect();

        return;
    }
});

router.get("/read/:id", (req,res,next)=>{
    var id = req.params.id;

    console.log("new get one user request", req.body);
    mg.connect("mongodb://127.0.0.1:27017/seatbooking");

    mg.model("users").find({_id: mg.Types.ObjectId(dbStringSanitizer(id)), isDeleted: false}, function(getError,dataGot) {
        if (!getError && dataGot) {
            console.log("from mongo get one user", dataGot);
                        
            res.status(200).json({
                status: "success",
                responseCode: "201",
                responseMessage: "Single User Data Acquired Successful!",
                data: dataGot
            });
            
            mg.disconnect();

            return;
        } else {
            res.status(200).json({
                status: "error",
                responseCode: "206",
                responseMessage: "Unknown error acquiring data!",
                data: getError
            });

            mg.disconnect();

            return;
        }
    }).select('-password').select('-passwordSalt');
});

router.get("/", (req,res,next)=>{
    console.log("new get all users request", req.body);
    mg.connect("mongodb://127.0.0.1:27017/seatbooking");

    mg.model("users").find({isDeleted: false}, (getError,dataGot) => {
        if (!getError && dataGot) {
            console.log("from mongo get all users", dataGot);
                        
            res.status(200).json({
                status: "success",
                responseCode: "201",
                responseMessage: "All User Data Acquired Successful!",
                data: dataGot
            });
            
            mg.disconnect();

            return;
        } else {
            res.status(200).json({
                status: "error",
                responseCode: "207",
                responseMessage: "Unknown error acquiring data!",
                data: getError
            });

            mg.disconnect();

            return;
        }
    }).select('-password').select('-passwordSalt');
});

router.post("/update/:id", (req,res,next)=>{
    var id = req.params.id;
    
    console.log("New user update request", req.body);
    mg.connect("mongodb://127.0.0.1:27017/seatbooking");
    var dateTime = new Date();
    
    if(req.body.id) {
        delete req.body.id;
    } 
    
    if(req.body._id) {
        delete req.body._id;
    } 
    
    if(req.body.password) {
        delete req.body.password;
    } 
    
    if(req.body.passwordSalt) {
        delete req.body.passwordSalt;
    }
    
    if(req.body.createdOn) {
        delete req.body.createdOn;
    }
    
    if(req.body.updatedOn) {
        delete req.body.updatedOn;
    }
    
    if(req.body.updatedBy) {
        delete req.body.updatedBy;
    }
    
    if(req.body.isDeleted) {
        delete req.body.isDeleted;
    }

    req.body.updatedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
    req.body.updatedBy = req.userData.users._id;

    mg.model("users").find({_id: mg.Types.ObjectId(dbStringSanitizer(id)), isDeleted: false}, function(existError, exist) {
        if (!existError && exist) {
            if(exist.length > 0) {
                req.body.updatedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
                mg.model("users").updateOne({_id: mg.Types.ObjectId(dbStringSanitizer(id)), isDeleted: false}, req.body,function(updateError,updated){
                    if (updateError || !updated){
                        res.status(200).json({
                            status: "error",
                            responseCode: "202",
                            responseMessage: "Single User Update failed with an Unknown Error!",
                            data: updateError
                        });
            
                        mg.disconnect();
            
                        return;
                    } else {
                        console.log('Single user updated: ', updated);
                        
                        res.status(200).json({
                            status: "success",
                            responseCode: "201",
                            responseMessage: "Single User Update was Successful!",
                            data: updated
                        });
                        
                        mg.disconnect();
    
                        return;
                    }
         
                });
            } else {
                res.status(200).json({
                    status: "error",
                    responseCode: "206",
                    responseMessage: "The Selected User wasnt't found!",
                    data: null
                });
    
                mg.disconnect();
    
                return;
            }
        } else {
            res.status(200).json({
                status: "error",
                responseCode: "207",
                responseMessage: "Unknown error processing data!",
                data: existError
            });

            mg.disconnect();

            return;
        }
    });
});

router.post("/findcustomized", (req,res,next)=>{
    console.log("New user find customized request", req.body);
    mg.connect("mongodb://127.0.0.1:27017/seatbooking");
    var dateTime = new Date();
    
    if(req.body.id) {
        delete req.body.id;
    } 
    
    if(req.body._id) {
        delete req.body._id;
    } 
    
    if(req.body.password) {
        delete req.body.password;
    } 
    
    if(req.body.passwordSalt) {
        delete req.body.passwordSalt;
    }

    mg.model("users").find(req.body, (getError,dataGot) => {
        if (!getError && dataGot) {
            console.log("from mongo find customized  users", dataGot);
                        
            res.status(200).json({
                status: "success",
                responseCode: "201",
                responseMessage: "All Find Customized User Data Acquired Successful!",
                data: dataGot
            });
            
            mg.disconnect();

            return;
        } else {
            res.status(200).json({
                status: "error",
                responseCode: "207",
                responseMessage: "Unknown error acquiring find customized data!",
                data: getError
            });

            mg.disconnect();

            return;
        }
    }).select('-password').select('-passwordSalt').select('-_id');
});

router.post("/delete", (req,res,next)=> {
    console.log("Delete user request", req.body);
    mg.connect("mongodb://127.0.0.1:27017/seatbooking");
    var dateTime = new Date();

    req.body.updatedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
    req.body.updatedBy = req.userData.users._id;
    
    mg.model("users").find({_id: mg.Types.ObjectId(dbStringSanitizer(req.body._id)), isDeleted: false}, function(existError, exist) {
        if (!existError && exist) {
            if(exist.length > 0) {
                req.body.updatedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
                mg.model("users").updateOne({_id: mg.Types.ObjectId(dbStringSanitizer(req.body._id)), isDeleted: false}, {isDeleted: true, updatedBy: mg.Types.ObjectId(req.userData.users._id), updatedOn: req.body.updatedOn}, function(deleteError,deleted){
                    if (deleteError || !deleted){
                        res.status(200).json({
                            status: "error",
                            responseCode: "202",
                            responseMessage: "User Deletion encounted an Unknown Error!",
                            data: deleteError
                        });
            
                        mg.disconnect();
            
                        return;
                    } else {
                        console.log('User Deleted', deleted);
                        
                        res.status(200).json({
                            status: "success",
                            responseCode: "201",
                            responseMessage: "User Deletion was Successful!",
                            data: deleted
                        });
                        
                        mg.disconnect();
    
                        return;
                    }
         
                });
            } else {
                res.status(200).json({
                    status: "error",
                    responseCode: "206",
                    responseMessage: "The Selected User wasnt't found!",
                    data: null
                });
    
                mg.disconnect();
    
                return;
            }
        } else {
            res.status(200).json({
                status: "error",
                responseCode: "207",
                responseMessage: "Unknown error processing data!",
                data: existError
            });

            mg.disconnect();

            return;
        }
    });
});

router.post("/restore", (req,res,next)=> {
    console.log("Restore user request", req.body);
    mg.connect("mongodb://127.0.0.1:27017/seatbooking");
    var dateTime = new Date();

    req.body.updatedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
    req.body.updatedBy = req.userData.users._id;
    
    mg.model("users").find({_id: mg.Types.ObjectId(dbStringSanitizer(req.body._id)), isDeleted: true}, function(existError, exist) {
        if (!existError && exist) {
            if(exist.length > 0) {
                req.body.updatedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
                mg.model("users").updateOne({_id: mg.Types.ObjectId(dbStringSanitizer(req.body._id)), isDeleted: true}, {isDeleted: false, updatedBy: mg.Types.ObjectId(req.userData.users._id), updatedOn: req.body.updatedOn}, function(restoreError,restored){
                    if (restoreError || !restored) {
                        res.status(200).json({
                            status: "error",
                            responseCode: "202",
                            responseMessage: "User Restoration encounted an Unknown Error!",
                            data: restoreError
                        });
            
                        mg.disconnect();
            
                        return;
                    } else {
                        console.log('User Restore', restored);
                        
                        res.status(200).json({
                            status: "success",
                            responseCode: "201",
                            responseMessage: "User Restoration was Successful!",
                            data: restored
                        });
                        
                        mg.disconnect();
    
                        return;
                    }
         
                });
            } else {
                res.status(200).json({
                    status: "error",
                    responseCode: "206",
                    responseMessage: "The Selected User wasnt't found!",
                    data: null
                });
    
                mg.disconnect();
    
                return;
            }
        } else {
            res.status(200).json({
                status: "error",
                responseCode: "207",
                responseMessage: "Unknown error processing data!",
                data: existError
            });

            mg.disconnect();

            return;
        }
    });
});

router.post("/login", (req,res,next)=>{
    console.log("new login user request", req.body);
    mg.connect("mongodb://127.0.0.1:27017/seatbooking");
    var dateTime = new Date();
        
    if(req.body.username && req.body.password) {
        let buff = new Buffer(req.body.password, 'base64');
        let password = buff.toString('ascii');

        // console.log("decoded base64 encoded pass", password);

        mg.model("users").find({username: dbStringSanitizer(req.body.username), isDeleted: false}, function(getError,dataGot) {
            if (!getError && dataGot) {
                if(dataGot.length > 0) {
                    console.log("from mongo login user", dataGot[0]);

                    var salt = dataGot[0].passwordSalt;
                    var hashedPassword = dataGot[0].password;
                    console.log("salt  -  " + salt + "  -  hashedPassword  -  " + hashedPassword);
    
                    if(checkPassword( password, salt, hashedPassword )){
                        dataGot = JSON.parse(JSON.stringify(dataGot[0]));
    
                        if(dataGot.password) {
                            delete dataGot.password;
                        } 
                        
                        if(dataGot.passwordSalt) {
                            delete dataGot.passwordSalt;
                        }
    
                        let payload = {
                            username: dataGot.username
                        };
                        
                        sessionId = jwtSignTokenizer(payload);
    
                        mg.model("loginSessions").create({_id: mg.Types.ObjectId(), userId: dataGot._id, loggedInOn: moment(dateTime).format("YYYY-MM-DD HH:mm:ss"), loggedOutOn: "", loggedOutBy: null, sessionId: sessionId, isExpired: false, expiresOn: moment(new Date(Date.now() + 12096e5)).format("YYYY-MM-DD HH:mm:ss")}, function (error, insertResponse) {
                            if(error) {
                                res.status(200).json({
                                    status: "error",
                                    responseCode: "202",
                                    responseMessage: "User Login Failed with an Unknown Error!",
                                    data: error
                                });
    
                                mg.disconnect();
                    
                                return;
                            }
                            else {
                                console.log("from mongo insert user", insertResponse);
                                insertResponse = JSON.parse(JSON.stringify(insertResponse));
                                
                                let responseData = {
                                    ...dataGot,
                                    ...insertResponse
                                };
    
                                res.status(200).json({
                                    status: "success",
                                    responseCode: "201",
                                    responseMessage: "User login was successful!",
                                    data: responseData
                                });
                                    
                                mg.disconnect();
                    
                                return;
                            }
                        });
                    } else {
                        res.status(200).json({
                            status: "error",
                            responseCode: "206",
                            responseMessage: "Login Failed!",
                            data: null
                        });
            
                        mg.disconnect();
            
                        return;
                    }
                } else {
                    res.status(200).json({
                        status: "error",
                        responseCode: "206",
                        responseMessage: "The Selected User wasnt't found!",
                        data: null
                    });
        
                    mg.disconnect();
        
                    return;
                }
            } else {
                res.status(200).json({
                    status: "error",
                    responseCode: "206",
                    responseMessage: "Unknown error occured!",
                    data: getError
                });
    
                mg.disconnect();
    
                return;
            }
        });
    } else {
        res.status(200).json({
            status: "error",
            responseCode: "206",
            responseMessage: "Login Failed... Please fill all required fields!",
            data: null
        });

        mg.disconnect();

        return;
    }
});

router.post("/logout", (req,res,next)=>{
    console.log("New Incoming logout user Request", req.body);
    mg.connect("mongodb://127.0.0.1:27017/seatbooking");
    var dateTime = new Date();

    req.body.updatedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
    req.body.updatedBy = req.userData.users._id;

    res.status(200).json({
        status: "success",
        responseCode: "",
        responseMessage: "",
        data: null
    });
});

module.exports = router;