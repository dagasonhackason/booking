const { validationResult } = require('express-validator/check');
const { respondWithError } = require('../utilities/responder');

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const messages = [];
        errors.array().forEach(error => messages.push(error.msg));
        respondWithError(res, "There was an error with your request", {errors: messages}, "222");
    }
    else {
        console.log("No errors with required params");
        next();
    }
}