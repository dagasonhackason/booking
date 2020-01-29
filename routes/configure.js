const express = require("express");
const router = express.Router();

router.get("/", (req,res,next)=>{
    console.log("hitting configure view route with", req.params);
    res.render("configure");
})

module.exports=router