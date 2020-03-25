const express = require("express");
const router = express.Router();

/* GET configureBookings View. */
router.get("/",(req,res,next)=>{
    console.log("hitting configureBookings view route with", req.params);
    res.render("configureBookings.ejs");
})

module.exports=router