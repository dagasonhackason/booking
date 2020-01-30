const express = require('express');
const router = express.Router();
const { respondWithSuccess } = require('../utilities/responder');

router.all("/", (req, res) => {
    return respondWithSuccess(
        res, 
        "Welcome to Booking System REST API", 
        { version: '1.0' },
        "200"
    );
});

module.exports = router;