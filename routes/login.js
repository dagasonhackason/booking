const express = require("express");
const router = express.Router();

router.get("/", (req,res,next)=>{
    console.log("hitting login view route with", req.params);
    res.render("login.ejs");
})

module.exports = router;