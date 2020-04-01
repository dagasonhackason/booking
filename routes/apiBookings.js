require('dotenv').config();
const express = require("express");
const router = express.Router();
const mg = require("mongoose");

const Schema = mg.Schema, ObjectId = Schema.ObjectId;
const moment = require("moment");

const APIBookingsRequestValidator = require('../validators/APIBookingsRequestValidator');
const validate = require('../middlewares/validateMiddleware');
const auth = require('../middlewares/authMiddleware');

const { dbStringSanitizer, generateTicket, updateSeatsCollection } = require('../utilities/supportFunctions');
const { respondWithSuccess, respondWithError } = require('../utilities/responder');
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

const Seats = require('../models/seats');
const Bookings = require('../models/bookings');

router.use(auth);

router.post("/create", (req, res, next)=>{
    console.log("New Incoming create booking Request", req.body);
    mg.connect(MONGODB_CONNECTION_STRING);

    var dateTime = new Date();
    let ticketCode = generateTicket();
    var seatId = req.body.seatId;

    console.log("selecting seatID from seats", req.body.seatId);

    if(req.body.seatId && req.body.bookedByName ) {
        Seats.findOne({_id: dbStringSanitizer(req.body.seatId), status: false, isDeleted: false, isActivated: true}, function(getError, dataGot) {
            if(dataGot) {
                console.log("From mongo isn't seated booked already!", dataGot);
                let bookingsObject = new Bookings({_id: mg.Types.ObjectId(), seatId: mg.Types.ObjectId(dbStringSanitizer(seatId)), bookedByName: dbStringSanitizer(req.body.bookedByName), ticketCode: ticketCode, bookedOn: moment(dateTime).format("YYYY-MM-DD HH:mm:ss"), isTicketCodeUsed: false, ticketCodeUsedOn: ""});
                
                let updateData = {};

                updateData.updatedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
                updateData.status = true;

                Seats.updateOne({_id: mg.Types.ObjectId(dbStringSanitizer(req.body.seatId)), isDeleted: false}, {$set: updateData}, {upsert: true}, function(updateError,updated) {
                    if (updateError || !updated){
                        console.log("update failed for seatId " + seatId + " status to booked BOOKED by " + req.body.bookedByName, updateError);
                        
                        res.status(200).json({
                            status: "error",
                            responseCode: "208",
                            responseMessage: "Unknown Error!",
                            data: updateError
                        });
                
                        console.error("Unknown Error!", updateError);
                        
                        mg.disconnect();
    
                        return;
                    } else {
                        console.log("updated seatId " + dataGot._id + " status to booked BOOKED by " + req.body.bookedByName, updated);
                        // res.status(200).json({
                        //     status: "success",
                        //     responseCode: "201",
                        //     responseMessage: "Booking Updated Successful!",
                        //     data: updated
                        // });
            
                        // mg.disconnect();
            
                        // return;
                    }
         
                });

                bookingsObject.save( (error, insertResponse) => {
                    if(error) {
                        res.status(200).json({
                            status: "error",
                            responseCode: "202",
                            responseMessage: "Booking Creation Failed with an Unknown Error!",
                            data: error
                        });
                        
                        console.error("Booking Creation Failed with an Unknown Error!", error);
                        
                        mg.disconnect();
            
                        return;
                    } else {
                        console.log("for create insert booking", insertResponse);
                        delete req.body.seatId;
                        res.status(200).json({
                            status: "success",
                            responseCode: "201",
                            responseMessage: "Booking Creation was Successful!",
                            data: insertResponse
                        });
            
                        mg.disconnect();
            
                        return;
                    }
                });
            } else {
                res.status(200).json({
                    status: "error",
                    responseCode: "206",
                    responseMessage: "The Selected Seat has Already been booked!",
                    data: getError
                });
                    
                console.error("The Selected Seat has Already been booked!", getError);
    
                mg.disconnect();
    
                return;
            }
        }).select('-__v');;
    } else {
        res.status(200).json({
            status: "error",
            responseCode: "208",
            responseMessage: "Please Fill all required fields and try again... Try again!",
            data: null
        });

        console.error("Please Fill all required fields and try again... Try again!");
        
        mg.disconnect();

        return;
    }
});

router.get("/read/:id", (req,res,next)=>{
    var id = req.params.id;

    console.log("New get one booking request", req.body);
    mg.connect(MONGODB_CONNECTION_STRING);

    Bookings.find({_id: mg.Types.ObjectId(dbStringSanitizer(id))}, function(getError,dataGot) {
        if (!getError && dataGot) {
            console.log("From mongo get one booking", dataGot);
                        
            res.status(200).json({
                status: "success",
                responseCode: "201",
                responseMessage: "Single booking Data Acquired Successful!",
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
                
            console.error("Unknown error acquiring data!", getError);

            mg.disconnect();

            return;
        }
    });
});

router.get("/", (req,res,next)=>{
    console.log("new get all bookings request", req.body);
    mg.connect(MONGODB_CONNECTION_STRING);

    Bookings.find({}, (getError,dataGot) => {
        if (!getError && dataGot) {
            console.log("From mongo get all bookings", dataGot);
                        
            res.status(200).json({
                status: "success",
                responseCode: "201",
                responseMessage: "All booking Data Acquired Successful!",
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
    console.log("new get all bookings populate request", req.body);
    mg.connect(MONGODB_CONNECTION_STRING);

    Bookings.find({}).populate('Users', 'username -_id').exec((getError, dataGot) => {
        if (!getError && dataGot) {
            console.log("From mongo get all populate bookings", dataGot);
                        
            res.status(200).json({
                status: "success",
                responseCode: "201",
                responseMessage: "All booking Data Acquired Successful!",
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

router.post("/useticket/:ticketCode/:id", (req,res,next)=>{
    var ticketCode = req.params.ticketCode;
    var id = req.params.id;

    console.log("New booking update request", req.body);
    mg.connect(MONGODB_CONNECTION_STRING);
    var dateTime = new Date();
    
    if(req.body.id) {
        delete req.body.id;
    } 
    
    if(req.body._id) {
        delete req.body._id;
    }

    Bookings.findById(mg.Types.ObjectId(dbStringSanitizer(id)), function(existError, exist) {
        if (!existError && exist) {
            isTicketCodeUsed = true;
            ticketCodeUsedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
            
            if(exist.id == id && !exist.isTicketCodeUsed && exist.ticketCode == ticketCode) {
                Bookings.updateOne({_id: mg.Types.ObjectId(dbStringSanitizer(id))}, {$set: {isTicketCodeUsed: isTicketCodeUsed, ticketCodeUsedOn: ticketCodeUsedOn}}, {upsert: true}, function(updateError,updated){
                    if (updateError || !updated){
                        res.status(200).json({
                            status: "error",
                            responseCode: "202",
                            responseMessage: "Setting booking ticket code encounted Unknown Error!",
                            data: updateError
                        });
            
                        mg.disconnect();
            
                        return;
                    } else {
                        console.log('Setting booking ticket to used', updated);
                        
                        res.status(200).json({
                            status: "success",
                            responseCode: "201",
                            responseMessage: "Setting booking ticket to used Successful!",
                            data: updated
                        });
                        
                        mg.disconnect();
    
                        return;
                    }
                });
            } else {
                res.status(200).json({
                    status: "error",
                    responseCode: "202",
                    responseMessage: "Ticket Code Has Already been used!",
                    data: null
                });
    
                mg.disconnect();
    
                return;
            }
        } else {
            res.status(200).json({
                status: "error",
                responseCode: "202",
                responseMessage: "Invalid Ticket Code!",
                data: existError
            });

            mg.disconnect();

            return;
        }
    });
});

router.post("/findcustomized", (req,res,next)=>{
    console.log("New bookings find customized request", req.body);
    mg.connect(MONGODB_CONNECTION_STRING);
    var dateTime = new Date();

    Bookings.find(req.body, (getError,dataGot) => {
        if (!getError && dataGot) {
            console.log("from mongo find customized bookings", dataGot);
                        
            res.status(200).json({
                status: "success",
                responseCode: "201",
                responseMessage: "All Find Customized Bookings Data Acquired Successful!",
                data: dataGot
            });
            
            mg.disconnect();

            return;
        } else {
            res.status(200).json({
                status: "error",
                responseCode: "207",
                responseMessage: "Unknown error acquiring find customized data!",
                data: null
            });

            mg.disconnect();

            return;
        }
    });
});

module.exports = router;