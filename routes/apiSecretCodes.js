require('dotenv').config();
const express = require("express");
const router = express.Router();
const mg = require("mongoose");
const Schema = mg.Schema, ObjectId = Schema.ObjectId;
const moment = require("moment");

const APISecretCodesRequestValidator = require('../validators/APISecretCodesRequestValidator');
const validate = require('../middlewares/validateMiddleware');
const auth = require('../middlewares/authMiddleware');

const { dbStringSanitizer } = require('../utilities/supportFunctions');
const { respondWithSuccess, respondWithError } = require('../utilities/responder');
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

const SecretCodes = require('../models/secretCodes');

router.use(auth);

router.post("/create", (req, res, next)=>{
    console.log("New Incoming create secretCode Request", req.body);
    mg.connect(MONGODB_CONNECTION_STRING);
    var dateTime = new Date();

    if(req.body.secretCode) {
        SecretCodes.findOne({ secretCode: dbStringSanitizer(req.body.secretCode), isDeleted: false }, function(err,existingsecretCode) {
            if (!err && !existingsecretCode) {
                console.log("SecretCode data on existence check", existingsecretCode);
                SecretCodes.create({_id: mg.Types.ObjectId(), secretCode: dbStringSanitizer(req.body.secretCode), createdBy: mg.Types.ObjectId(req.userData.users._id), createdOn: moment(dateTime).format("YYYY-MM-DD HH:mm:ss"), updatedOn: "", updatedBy: null, isDeleted: false}, function (error,insertResponse) {
                    if(error) {
                        res.status(200).json({
                            status: "error",
                            responseCode: "202",
                            responseMessage: "SecretCode Creation Failed with an Unknown Error!",
                            data: error
                        });

                        mg.disconnect();
            
                        return;
                    }
                    else{
                        console.log("From mongo insert secretCode", insertResponse);
                    
                        res.status(200).json({
                            status: "success",
                            responseCode: "201",
                            responseMessage: "SecretCode Creation was Successful!",
                            data: insertResponse
                        });
                        
                        mg.disconnect();
    
                        return;
                    }
                });
            } else {
                res.status(200).json({
                    status: "error",
                    responseCode: "205",
                    responseMessage: "SecretCode Already exist... Error!",
                    data: err
                });

                mg.disconnect();
    
                return;
            }
        });
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

    console.log("New get one secretCode request", req.body);
    mg.connect(MONGODB_CONNECTION_STRING);

    SecretCodes.find({_id: mg.Types.ObjectId(dbStringSanitizer(id)), isDeleted: false}, function(getError,dataGot) {
        if (!getError && dataGot) {
            console.log("From mongo get one secretCode", dataGot);
                        
            res.status(200).json({
                status: "success",
                responseCode: "201",
                responseMessage: "Single secretCode Data Acquired Successful!",
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
    });
});

router.get("/", (req,res,next)=>{
    console.log("new get all secretCodes request", req.body);
    mg.connect(MONGODB_CONNECTION_STRING);

    SecretCodes.find({}, (getError,dataGot) => {
        if (!getError && dataGot) {
            console.log("From mongo get all secretCodes", dataGot);
            
            dataGot.sort((a, b) => (parseInt(a.secretCode) > parseInt(b.secretCode)) ? 1 : -1);

            res.status(200).json({
                status: "success",
                responseCode: "201",
                responseMessage: "All secretCode Data Acquired Successful!",
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
    });
});

router.get("/populate", (req,res,next)=>{
    console.log("new get all secretCodes populate request", req.body);
    mg.connect(MONGODB_CONNECTION_STRING);

    SecretCodes.find({}).populate('Users', 'username -_id').exec((getError, dataGot) => {
        if (!getError && dataGot) {
            console.log("From mongo get all populate secretCodes", dataGot);
            
            dataGot.sort((a, b) => (parseInt(a.secretCode) > parseInt(b.secretCode)) ? 1 : -1);

            res.status(200).json({
                status: "success",
                responseCode: "201",
                responseMessage: "All secretCode Data Acquired Successful!",
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
    });
});

router.post("/update/:id", (req,res,next)=>{
    var id = req.params.id;

    console.log("New secretCode update request", req.body);
    mg.connect("mongodb://127.0.0.1:27017/secretCodebooking");
    var dateTime = new Date();
    
    if(req.body.id) {
        delete req.body.id;
    } 
    
    if(req.body._id) {
        delete req.body._id;
    }
    
    if(req.body.createdOn) {
        delete req.body.createdOn;
    }
    
    if(req.body.createdBy) {
        delete req.body.createdBy;
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

    SecretCodes.findById(dbStringSanitizer(id), function(existError, exist) {
        if (!existError && exist) {
            req.body.updatedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
            SecretCodes.updateOne({_id: mg.Types.ObjectId(dbStringSanitizer(id)), isDeleted: false}, {$set: req.body}, {upsert: true}, function(updateError,updated) {
                if (updateError || !updated){
                    res.status(200).json({
                        status: "error",
                        responseCode: "202",
                        responseMessage: "Single secretCode Update failed with an Unknown Error!",
                        data: updateError
                    });
        
                    mg.disconnect();
        
                    return;
                } else {
                    console.log('Single secretCode updated: ', updated);
                    
                    res.status(200).json({
                        status: "success",
                        responseCode: "201",
                        responseMessage: "Single secretCode Update was Successful!",
                        data: updated
                    });
                    
                    mg.disconnect();

                    return;
                }
     
            });
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
    console.log("New secretCodes find customized request", req.body);
    mg.connect(MONGODB_CONNECTION_STRING);
    var dateTime = new Date();

    SecretCodes.find(req.body, (getError,dataGot) => {
        if (!getError && dataGot) {
            console.log("from mongo find customized secretCodes", dataGot);
            dataGot.sort((a, b) => (parseInt(a.secretCode) > parseInt(b.secretCode)) ? 1 : -1);
            
            res.status(200).json({
                status: "success",
                responseCode: "201",
                responseMessage: "All Find Customized secretCodes Data Acquired Successful!",
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
    });
});

router.post("/delete", (req,res,next)=> {
    console.log("Delete secretCode request", req.body);
    mg.connect(MONGODB_CONNECTION_STRING);
    var dateTime = new Date();
    
    req.body.updatedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
    req.body.updatedBy = req.userData.users._id;

    SecretCodes.find({_id: mg.Types.ObjectId(dbStringSanitizer(req.body._id)), isDeleted: false}, function(existError, exist) {
        if (!existError && exist) {
            if(exist.length > 0) {
                req.body.updatedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
                SecretCodes.updateOne({_id: mg.Types.ObjectId(dbStringSanitizer(req.body._id)), isDeleted: false}, {$set:  {isDeleted: true, updatedBy: mg.Types.ObjectId(req.userData.users._id), updatedOn: req.body.updatedOn}}, {upsert: true}, function(deleteError,deleted){
                    if (deleteError || !deleted){
                        res.status(200).json({
                            status: "error",
                            responseCode: "202",
                            responseMessage: "SecretCode Deletion encounted an Unknown Error!",
                            data: deleteError
                        });
            
                        mg.disconnect();
            
                        return;
                    } else {
                        console.log('secretCode Deleted', deleted);
                        
                        res.status(200).json({
                            status: "success",
                            responseCode: "201",
                            responseMessage: "secretCode Deletion was Successful!",
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
                    responseMessage: "The Selected SecretCode wasnt't found!",
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
    console.log("Restore secretCode request", req.body);
    mg.connect(MONGODB_CONNECTION_STRING);
    var dateTime = new Date();

    req.body.updatedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
    req.body.updatedBy = req.userData.users._id;

    SecretCodes.find({_id: mg.Types.ObjectId(dbStringSanitizer(req.body._id)), isDeleted: true}, function(existError, exist) {
        if (!existError && exist) {
            if(exist.length > 0) {
                req.body.updatedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
                SecretCodes.updateOne({_id: mg.Types.ObjectId(dbStringSanitizer(req.body._id)), isDeleted: true}, {$set: {isDeleted: false, updatedBy: mg.Types.ObjectId(req.userData.users._id), updatedOn: req.body.updatedOn}}, {upsert: true}, function(restoreError,restored){
                    if (restoreError || !restored){
                        res.status(200).json({
                            status: "error",
                            responseCode: "202",
                            responseMessage: "SecretCode Restoration encounted an Unknown Error!",
                            data: restoreError
                        });
            
                        mg.disconnect();
            
                        return;
                    } else {
                        console.log('SecretCode Restored', restored);
                        
                        res.status(200).json({
                            status: "success",
                            responseCode: "201",
                            responseMessage: "secretCode Restoration was Successful!",
                            data: restored
                        });
                        
                        mg.disconnect();
    
                        return;
                    }
         
                });
            } else {
                res.status(200).json({
                    status: "error",
                    responseCode: "202",
                    responseMessage: "The Selected SecretCode wasnt't found!",
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

module.exports = router;