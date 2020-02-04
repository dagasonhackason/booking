const express = require("express");
const router = express.Router();
const mg = require("mongoose");
const Schema = mg.Schema, ObjectId = Schema.ObjectId;


const dbStringSanitizer = function dbStringSanitizer(arg) {
    return arg.replace(/\\/g, "\\\\")
            .replace(/\$/g, "\\$")
            .replace(/'/g, "\\'")
            .replace(/"/g, "\\\"");
};

router.get("/:id", (req,res,next) => {
    var id = req.params.id;
    let dataPassed = {};

    console.log("hitting showticket view route with", req.params);

    mg.connect("mongodb://127.0.0.1:27017/bookingbooking");

    mg.model("bookings").find({_id: dbStringSanitizer(id)}, function(getError,dataGot) {
        if (!getError && dataGot) {
            console.log("From mongo get one booking using showticket view", dataGot);
                        
            dataPassed = dataGot;

            mg.disconnect();
        
            res.render("showticket.ejs", {
                _id: dataPassed._id, 
                seatId: dataPassed.seatId, 
                bookedByName: dataPassed.bookedByName, 
                ticketCode: dataPassed.ticketCode, 
                bookedOn: dataPassed.bookedOn, 
                isTicketCodeUsed: ((dataPassed.isTicketCodeUsed) ? "USED" : "NOT_USED"), 
                ticketCodeUsedOn: dataPassed.ticketCodeUsedOn 
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