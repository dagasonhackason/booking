const express = require("express");
const router = express.Router();
const mg = require("mongoose");
const Schema = mg.Schema, ObjectId = Schema.ObjectId;
const moment = require("moment");
const uuid = require("uuid");


const dbStringSanitizer = function dbStringSanitizer(arg) {
    return arg.replace(/\\/g, "\\\\")
            .replace(/\$/g, "\\$")
            .replace(/'/g, "\\'")
            .replace(/"/g, "\\\"");
};

const generateTicket = function generateTicket(uuidPassed) {
    return ('xyx-9x-x30y-' + uuidPassed + 'yx5x').replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

router.post("/create", (req, res, next)=>{
    console.log("New Incoming create booking Request", req.body);
    mg.connect("mongodb://127.0.0.1:27017/bookingbooking");
    var dateTime = new Date();
    let ticketCode = generateTicket(uuid());

    if(req.body.seatId && req.body.bookedByName ) {
        mg.model("bookings").create({seatId: dbStringSanitizer(req.body.seatId), bookedByName: dbStringSanitizer(req.body.bookedByName), ticketCode: ticketCode, bookedOn: moment(dateTime).format("YYYY-MM-DD HH:mm:ss"), isTicketCodeUsed: false, ticketCodeUsedOn: ""}, function (error,insertResponse) {
            if(error) {
                res.status(200).json({
                    status: "error",
                    responseCode: "202",
                    responseMessage: "Booking Creation Failed with an Unknown Error!",
                    data: null
                });
                
                console.error("Booking Creation Failed with an Unknown Error!", error);
                
                mg.disconnect();
    
                return;
            }
            else{
                mg.model("bookings").updateOne({seatId: dbStringSanitizer(req.body.seatId)}, {status: "BOOKED"},function(updateError,updated){
                    if (updated){
                        console.log("updated seatId " + req.body.seatId + " status to booked BOOKED by " + req.body.bookedByName, updated);
                        console.log("From mongo insert booking", insertResponse);
                    
                        res.status(200).json({
                            status: "success",
                            responseCode: "201",
                            responseMessage: "Booking Creation was Successful!",
                            data: insertResponse
                        });
                        
                        mg.disconnect();
        
                        return;
                    } else {
                        res.status(200).json({
                            status: "error",
                            responseCode: "208",
                            responseMessage: "Unknown Error!",
                            data: null
                        });
                
                        console.error("Unknown Error!", updateError);
                        
                        mg.disconnect();
                
                        return;
                    }
                });
            }
        });
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
    mg.connect("mongodb://127.0.0.1:27017/bookingbooking");

    mg.model("bookings").find({_id: dbStringSanitizer(id)}, function(getError,dataGot) {
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
                data: null
            });
                
            console.error("Unknown error acquiring data!", getError);

            mg.disconnect();

            return;
        }
    });
});

router.get("/", (req,res,next)=>{
    console.log("new get all bookings request", req.body);
    mg.connect("mongodb://127.0.0.1:27017/bookingbooking");

    mg.model("bookings").find({isDeleted: false}, (getError,dataGot) => {
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
                data: null
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
    mg.connect("mongodb://127.0.0.1:27017/bookingbooking");
    var dateTime = new Date();
    
    if(req.body.id) {
        delete req.body.id;
    } 
    
    if(req.body._id) {
        delete req.body._id;
    }

    mg.model("bookings").findById(dbStringSanitizer(id), function(existError, exist) {
        if (!existError && exist) {
            isTicketCodeUsed = true;
            ticketCodeUsedOn = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
            
            if(exist.id == id && !exist.isTicketCodeUsed && exist.ticketCode == ticketCode) {
                mg.model("bookings").updateOne({_id: dbStringSanitizer(id)}, {isTicketCodeUsed: isTicketCodeUsed},function(updateError,updated){
                    if (updateError || !updated){
                        res.status(200).json({
                            status: "error",
                            responseCode: "202",
                            responseMessage: "Setting booking ticket code encounted Unknown Error!",
                            data: null
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
                data: null
            });

            mg.disconnect();

            return;
        }
    });
});

router.post("/findcustomized", (req,res,next)=>{
    console.log("New bookings find customized request", req.body);
    mg.connect("mongodb://127.0.0.1:27017/seatbooking");
    var dateTime = new Date();

    mg.model("bookings").find(req.body, (getError,dataGot) => {
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