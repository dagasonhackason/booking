const express = require("express");
const router = express.Router();
const mg = require("mongoose");
const Schema = mg.Schema, ObjectId = Schema.ObjectId;
const Seats = require('../models/seats');


const dbStringSanitizer = function dbStringSanitizer(arg) {
    return arg.replace(/\\/g, "\\\\")
            .replace(/\$/g, "\\$")
            .replace(/'/g, "\\'")
            .replace(/"/g, "\\\"");
};

router.get("/:id", (req,res,next)=>{
    var id = req.params.id;
    let dataPassed = {};

    console.log("hitting confirm view route with", req.params);

    mg.connect("mongodb://127.0.0.1:27017/seatbooking");

    Seats.findOne({_id: dbStringSanitizer(id), isDeleted: false, isActivated: true}, function(getError,dataGot) {
        if (!getError && dataGot) {
            console.log("From mongo get one booking using confirm view", dataGot);
            
            res.render("confirm.ejs", {
                _id: dataGot._id, 
                seatNumber: dataGot.seatNumber, 
                status: dataGot.status
            });
            
            mg.disconnect();

            return;
        } else {   
            console.error("Unknown error acquiring confirm view data!", getError);

            var error = {};
            error.status = 500

            res.render("error.ejs", {
                message: "Unknown error show acquiring confirm view data!",
                status: error.status
            });

            mg.disconnect();

            return;
        }
    });
})

module.exports = router;