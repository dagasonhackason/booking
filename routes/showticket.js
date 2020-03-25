require('dotenv').config();
const express = require("express");
const router = express.Router();
const mg = require("mongoose");
const Schema = mg.Schema, ObjectId = Schema.ObjectId;
const Bookings = require('../models/bookings');
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

const dbStringSanitizer = function dbStringSanitizer(arg) {
    return arg.replace(/\\/g, "\\\\")
            .replace(/\$/g, "\\$")
            .replace(/'/g, "\\'")
            .replace(/"/g, "\\\"");
};

/* GET showticket View. */
router.get("/:id", (req,res,next) => {
    var id = req.params.id;
    
    console.log("hitting showticket view route with", req.params);

    mg.connect(MONGODB_CONNECTION_STRING);

    Bookings.findOne({_id: dbStringSanitizer(id)}, function(getError,dataGot) {
        if (!getError && dataGot) {
            console.log("From mongo get one booking using showticket view", dataGot);

            mg.disconnect(); 
        
            res.render("showticket.ejs", {
                _id: dataGot._id, 
                seatId: dataGot.seatId, 
                bookedByName: dataGot.bookedByName, 
                ticketCode: dataGot.ticketCode, 
                bookedOn: dataGot.bookedOn, 
                isTicketCodeUsed: ((dataGot.isTicketCodeUsed) ? "USED" : "NOT_USED"), 
                ticketCodeUsedOn: dataGot.ticketCodeUsedOn 
            });
            
            return;
        } else {   
            console.error("Unknown error show acquiring showticket view data!", getError);

            mg.disconnect();
            
            var error = {};
            error.status = 500

            res.render("error.ejs");

            return;
        }
    });
})

module.exports = router;