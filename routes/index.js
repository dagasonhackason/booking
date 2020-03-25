var express = require('express');
var router = express.Router();

/* GET index View. */
router.get('/', function(req, res, next) {
  console.log("hitting index view route with", req.params);
  res.render('index.ejs', { title: 'test' });
});

module.exports = router;
