var express = require('express');
var router = express.Router();

/* GET configureUsers View. */
router.get('/', function(req, res, next) {
  console.log("hitting configureUsers view route with", req.params);
  res.render("configureUsers.ejs");
});

module.exports = router;
