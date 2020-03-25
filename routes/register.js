const express = require("express");
const router = express.Router();

/* GET register View. */
router.get("/", (req,res,next)=>{
    console.log("hitting register view route with", req.params);
    res.render("register.ejs");
})


module.exports = router;
