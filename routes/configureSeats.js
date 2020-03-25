const express = require("express");
const router = express.Router();

/* GET configureSeats View. */
router.get("/", (req,res,next)=>{
    console.log("hitting configureSeats view route with", req.params);
    res.render("configureSeats.ejs");
})

module.exports=router