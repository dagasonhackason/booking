const express = require("express");
const router = express.Router();

/* GET login View. */
router.get("/", (req,res,next)=>{
    console.log("hitting login view route with", req.params);
    res.render("login.ejs");
})

module.exports = router;