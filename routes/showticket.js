const express = require("express");
const router = express.Router();
const mg = require("mongoose");
const Schema = mg.Schema, ObjectId = Schema.ObjectId;
const Bookings = require('../models/bookings');


const dbStringSanitizer = function dbStringSanitizer(arg) {
    return arg.replace(/\\/g, "\\\\")
            .replace(/\$/g, "\\$")
            .replace(/'/g, "\\'")
            .replace(/"/g, "\\\"");
};

router.get("/:id", (req,res,next) => {
    var id = req.params.id;
    let dataGot = {};

    console.log("hitting showticket view route with", req.params);

    mg.connect("mongodb://127.0.0.1:27017/seatbooking");

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

            res.render("error.ejs", {
                message: "Unknown error show acquiring showticket view data!",
                status: error.status
            });

            return;
        }
    });
})

module.exports = router;