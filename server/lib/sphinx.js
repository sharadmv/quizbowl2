var mysql = require('mysql');
var util = require('../lib/util');
var CONFIG = require('../config').DB.sphinx;

var pool = mysql.createPool({
  host : CONFIG.host,
  port : CONFIG.port
});

exports.query = function(query, args, callback) {
  pool.getConnection(function(err, conn) {
    conn.query(util.query(query, args), function(err, rows) {
      callback(err, rows);
    });
  });
}
