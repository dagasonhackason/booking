var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("hitting index view route with", req.params);
  res.render('index.ejs', { title: 'test' });
});

module.exports = router;
