require('dotenv').config();
const express = require("express");
const router = express.Router();
const mg = require("mongoose");
const Schema = mg.Schema, ObjectId = Schema.ObjectId;
const Users = require('../models/users');
const Bookings = require('../models/bookings');
const Seats = require('../models/seats');
const SecretCodes = require('../models/secretCodes');
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

/* GET dash View. */
router.get("/", (req,res,next)=>{
    let dataGot = {};

    console.log("hitting dash view route with", req.params);

    mg.connect(MONGODB_CONNECTION_STRING);

    (async () => {
        try {
            await (async () => {
                try {
                    await Users.find({ isDeleted: false }, async (err, existingUsers) => {
                        if (!err && existingUsers) {
                            dataGot.totalUsers = existingUsers.length;
                        } 
                    }); 

                    await Seats.find({ isDeleted: false }, async (err, existingSeats) => {
                        if (!err && existingSeats) {
                            dataGot.totalSeats = existingSeats.length;
                        } 
                    });

                    await Bookings.find({}, async (err, existingBookings) => {
                        if (!err && existingBookings) {
                            dataGot.totalBookings = existingBookings.length;
                        } 
                    });

                    await SecretCodes.find({ isDeleted: false }, async (err, existingSecretCodes) => {
                        if (!err && existingSecretCodes) {
                            dataGot.totalSecretCodes = existingSecretCodes.length;
                        } 
                    });

                    console.log("From mongo get one booking using dash view totals", dataGot);

                    mg.disconnect();
                
                    res.render("dash.ejs", {
                        totalUsers: ((dataGot.totalUsers) ? dataGot.totalUsers : 0), 
                        totalSeats: ((dataGot.totalSeats) ? dataGot.totalSeats : 0), 
                        totalBookings: ((dataGot.totalBookings) ? dataGot.totalBookings : 0),
                        totalSecretCodes: ((dataGot.totalSecretCodes) ? dataGot.totalSecretCodes : 0)
                    });
                } catch(excptn) {
                    console.error("Unknown error show acquiring dash view data!", excptn);

                    mg.disconnect();
                    
                    var error = {};
                    error.status = 500

                    res.render("error.ejs", {
                        message: "Unknown error show acquiring dash view data!",
                        status: error.status
                    });

                    return;
                }
            })();

        } catch(exceptn) {
            console.error("Unknown error show acquiring dash view data!", exceptn);

            mg.disconnect();
            
            var error = {};
            error.status = 500

            res.render("error.ejs", {
                message: "Unknown error show acquiring dash view data!",
                status: error.status
            });

            return;
        }
    })();  
})

module.exports=router;