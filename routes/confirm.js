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

router.get("/:id", (req,res,next)=>{
    var id = req.params.id;
    let dataPassed = {};

    console.log("hitting confirm view route with", req.params);

    mg.connect("mongodb://127.0.0.1:27017/bookingbooking");

    mg.model("seats").find({_id: dbStringSanitizer(id)}, function(getError,dataGot) {
        if (!getError && dataGot) {
            console.log("From mongo get one booking using confirm view", dataGot);
                        
            dataPassed = dataGot;

            mg.disconnect();
            
            res.render("confirm.ejs", {
                _id: dataPassed._id, 
                seatNumber: dataPassed.seatNumber, 
                status: dataPassed.status
            });

            return;
        } else {   
            console.error("Unknown error acquiring confirm view data!", getError);

            var error = {};
            error.status = 500

            res.render("error.ejs", {
                message: "Unknown error show acquiring confirm view data!",
                status: error.status
            });

            return;
        }
    });
})

module.exports = router;