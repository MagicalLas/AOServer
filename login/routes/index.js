var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'ika.today',
  port     : 4000,
  user     : 'root',
  password : 'jin123',
  database : 'Heroes'
});

connection.connect();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});



module.exports = router;