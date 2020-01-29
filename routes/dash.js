const express = require("express");
const router = express.Router();

router.get("/", (req,res,next)=>{
    console.log("hitting dash view route with", req.params);
    res.render("dash.ejs");
})


module.exports=router;