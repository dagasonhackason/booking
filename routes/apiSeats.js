const express = require("express");
const router = express.Router();
const mg = require("mongoose");
const Schema = mg.Schema, ObjectId = Schema.ObjectId;
const moment = require("moment");

const APISeatsRequestValidator = require('../validators/APISeatsRequestValidator');
const validate = require('../middlewares/validateMiddleware');
const auth = require('../middlewares/authMiddleware');

const { dbStringSanitizer } = require('../utilities/supportFunctions');
const { respondWithSuccess, respondWithError } = require('../utilities/responder');

const Seats = require('../models/seats');

router.use(auth);

// update model name of existing seat
// router.put('/seatupdater/:id', (req, res) => {
//     console.log("New seat update request", req.body);
//     mg.connect("mongodb://127.0.0.1:27017/seatbooking");

//     Seats.findOneAndUpdate({
//         _id: req.params.id
//     }, 
//     {$set: req.body}, {upsert: true},
//           (err, seat) => {
//              if (err) {
//                 console.log('error occured while trying to update seat', err);
//                 res.status(200).send('false');
//              } else {
//                  console.log('updated seat', seat);
//                  res.status(200).send('true');
//              }
//     });
// });

router.post("/create", (req, res, next)=>{
    console.log("New Incoming create seat Request", req.body);
    mg.connect("mongodb://127.0.0.1:27017/seatbooking");
    var dateTime = new Date();

    if(req.body.seatNumber) {
        Seats.findOne({ seatNumber: dbStringSanitizer(req.body.seatNumber), isDeleted: false }, function(err,existingseat) {
            if (!err && !existingseat) {
                console.log("Seat data on existence check", existingseat);
                Seats.create({_id: mg.Types.ObjectId(), seatNumber: dbStringSanitizer(req.body.seatNumber), status: false, createdBy: mg.Types.ObjectId(req.userData.users._id), createdOn: moment(dateTime).format("YYYY-MM-DD HH:mm:ss"), updatedOn: "", updatedBy: null, isActivated: true, isDeleted: false}, function (error,insertResponse) {
                    if(error) {
                        res.status(200).json({
                            status: "error",
                            responseCode: "202",
                            responseMessage: "Seat Creation Failed with an Unknown Error!",
                            data: error
                        });

                        mg.disconnect();
            
                        return;
                    }
                    else{
                        console.log("From mongo insert seat", insertResponse);
                    
                        res.status(200).json({
                            status: "success",
                            responseCode: "201",
                            responseMessage: "Seat Creation was Successful!",
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
                    responseMessage: "Seat Already exist... Error!",
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

    console.log("New get one seat request", req.body);
    mg.connect("mongodb://127.0.0.1:27017/seatbooking");

    Seats.find({_id: mg.Types.ObjectId(dbStringSanitizer(id)), isDeleted: false, isActivated: true}, function(getError,dataGot) {
        if (!getError && dataGot) {
            console.log("From mongo get one seat", dataGot);
                        
            res.status(200).json({
                status: "success",
                responseCode: "201",
                responseMessage: "Single seat Data Acquired Successful!",
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
    console.log("new get all seats request", req.body);
    mg.connect("mongodb://127.0.0.1:27017/seatbooking");

    Seats.find({isDeleted: false, isActivated: true}, (getError,dataGot) => {
        if (!getError && dataGot) {
            console.log("From mongo get all seats", dataGot);
            
            dataGot.sort((a, b) => (parseInt(a.seatNumber) > parseInt(b.seatNumber)) ? 1 : -1);

            res.status(200).json({
                status: "success",
                responseCode: "201",
                responseMessage: "All seat Data Acquired Successful!",
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

    console.log("New seat update request", req.body);
    mg.connect("mongodb://127.0.0.1:27017/seatbooking");
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

    Seats.findById(dbStringSanitizer(id), function(existError, exist) {
        if (!existError && exist) {
            req.body.updatedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
            Seats.updateOne({_id: mg.Types.ObjectId(dbStringSanitizer(id)), isDeleted: false}, {$set: req.body}, {upsert: true}, function(updateError,updated) {
                if (updateError || !updated){
                    res.status(200).json({
                        status: "error",
                        responseCode: "202",
                        responseMessage: "Single seat Update failed with an Unknown Error!",
                        data: updateError
                    });
        
                    mg.disconnect();
        
                    return;
                } else {
                    console.log('Single seat updated: ', updated);
                    
                    res.status(200).json({
                        status: "success",
                        responseCode: "201",
                        responseMessage: "Single seat Update was Successful!",
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
    console.log("New seats find customized request", req.body);
    mg.connect("mongodb://127.0.0.1:27017/seatbooking");
    var dateTime = new Date();

    Seats.find(req.body, (getError,dataGot) => {
        if (!getError && dataGot) {
            console.log("from mongo find customized seats", dataGot);
            dataGot.sort((a, b) => (parseInt(a.seatNumber) > parseInt(b.seatNumber)) ? 1 : -1);
            
            res.status(200).json({
                status: "success",
                responseCode: "201",
                responseMessage: "All Find Customized seats Data Acquired Successful!",
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
    console.log("Delete seat request", req.body);
    mg.connect("mongodb://127.0.0.1:27017/seatbooking");
    var dateTime = new Date();
    
    req.body.updatedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
    req.body.updatedBy = req.userData.users._id;

    Seats.find({_id: mg.Types.ObjectId(dbStringSanitizer(req.body._id)), isDeleted: false}, function(existError, exist) {
        if (!existError && exist) {
            if(exist.length > 0) {
                req.body.updatedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
                Seats.updateOne({_id: mg.Types.ObjectId(dbStringSanitizer(req.body._id)), isDeleted: false}, {$set:  {isDeleted: true, updatedBy: mg.Types.ObjectId(req.userData.users._id), updatedOn: req.body.updatedOn}}, {upsert: true}, function(deleteError,deleted){
                    if (deleteError || !deleted){
                        res.status(200).json({
                            status: "error",
                            responseCode: "202",
                            responseMessage: "Seat Deletion encounted an Unknown Error!",
                            data: deleteError
                        });
            
                        mg.disconnect();
            
                        return;
                    } else {
                        console.log('seat Deleted', deleted);
                        
                        res.status(200).json({
                            status: "success",
                            responseCode: "201",
                            responseMessage: "seat Deletion was Successful!",
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
                    responseMessage: "The Selected Seat wasnt't found!",
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
    console.log("Restore seat request", req.body);
    mg.connect("mongodb://127.0.0.1:27017/seatbooking");
    var dateTime = new Date();

    req.body.updatedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
    req.body.updatedBy = req.userData.users._id;

    Seats.find({_id: mg.Types.ObjectId(dbStringSanitizer(req.body._id)), isDeleted: true}, function(existError, exist) {
        if (!existError && exist) {
            if(exist.length > 0) {
                req.body.updatedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
                Seats.updateOne({_id: mg.Types.ObjectId(dbStringSanitizer(req.body._id)), isDeleted: true}, {$set: {isDeleted: false, updatedBy: mg.Types.ObjectId(req.userData.users._id), updatedOn: req.body.updatedOn}}, {upsert: true}, function(restoreError,restored){
                    if (restoreError || !restored){
                        res.status(200).json({
                            status: "error",
                            responseCode: "202",
                            responseMessage: "Seat Restoration encounted an Unknown Error!",
                            data: restoreError
                        });
            
                        mg.disconnect();
            
                        return;
                    } else {
                        console.log('Seat Restored', restored);
                        
                        res.status(200).json({
                            status: "success",
                            responseCode: "201",
                            responseMessage: "seat Restoration was Successful!",
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
                    responseMessage: "The Selected Seat wasnt't found!",
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

router.post("/activate", (req,res,next)=> {
    console.log("Activate seat request", req.body);
    mg.connect("mongodb://127.0.0.1:27017/seatbooking");
    var dateTime = new Date();
    
    req.body.updatedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
    req.body.updatedBy = req.userData.users._id;

    Seats.find({_id: mg.Types.ObjectId(dbStringSanitizer(req.body._id)), isDeleted: false, isActivated: false}, function(existError, exist) {
        if (!existError && exist) {
            if(exist.length > 0) {
                req.body.updatedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
                Seats.updateOne({_id: mg.Types.ObjectId(dbStringSanitizer(req.body._id)), isDeleted: false, isActivated: false}, {$set: {isActivated: true, updatedBy: mg.Types.ObjectId(req.userData.users._id), updatedOn: req.body.updatedOn}}, {upsert: true}, function(activateError,activated){
                    if (activateError || !activated){
                        res.status(200).json({
                            status: "error",
                            responseCode: "202",
                            responseMessage: "Seat Activation encounted an Unknown Error!",
                            data: activateError
                        });
            
                        mg.disconnect();
            
                        return;
                    } else {
                        console.log('Seat Activated', activated);
                        
                        res.status(200).json({
                            status: "success",
                            responseCode: "201",
                            responseMessage: "Seat Activation was Successful!",
                            data: activated
                        });
                        
                        mg.disconnect();
    
                        return;
                    }
         
                });    
            } else {
                res.status(200).json({
                    status: "error",
                    responseCode: "202",
                    responseMessage: "The Selected Seat wasnt't found!",
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

router.post("/deactivate", (req,res,next)=> {
    console.log("Deactivate seat request", req.body);
    mg.connect("mongodb://127.0.0.1:27017/seatbooking");
    var dateTime = new Date();
    
    req.body.updatedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
    req.body.updatedBy = req.userData.users._id;

    Seats.find({_id: mg.Types.ObjectId(dbStringSanitizer(req.body._id)), isDeleted: false, isActivated: true}, function(existError, exist) {
        if (!existError && exist) {
            if(exist.length > 0) {
                req.body.updatedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
                Seats.updateOne({_id: mg.Types.ObjectId(dbStringSanitizer(req.body._id)), isDeleted: false, isActivated: true}, {$set: {isActivated: false, updatedBy: mg.Types.ObjectId(req.userData.users._id), updatedOn: req.body.updatedOn}}, {upsert: true}, function(deactivateError,deactivated){
                    if (deactivateError || !deactivated){
                        res.status(200).json({
                            status: "error",
                            responseCode: "202",
                            responseMessage: "Seat Deactivation encounted an Unknown Error!",
                            data: deactivateError
                        });
            
                        mg.disconnect();
            
                        return;
                    } else {
                        console.log('Seat Deactivated', deactivated);
                        
                        res.status(200).json({
                            status: "success",
                            responseCode: "201",
                            responseMessage: "Seat Deactivation was Successful!",
                            data: deactivated
                        });
                        
                        mg.disconnect();
    
                        return;
                    }
                });
            } else {
                res.status(200).json({
                    status: "error",
                    responseCode: "202",
                    responseMessage: "The Selected Seat wasnt't found!",
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