var express = require('express');
var router = express.Router();

/* GET configureSecretCodes View. */
router.get('/', function(req, res, next) {
  console.log("hitting configureSecretCodes view route with", req.params);
  res.render("configureSecretCodes.ejs");
});

module.exports = router;
