const express = require("express");
const router = express.Router();

router.get("/",(req,res,next)=>{
    console.log("hitting bookings view route with", req.params);
    res.render("bookings.ejs");
})

module.exports=router