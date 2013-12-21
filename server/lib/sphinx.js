var mysql = require('mysql');
var util = require('../lib/util');
var CONFIG = require('../config').DB.sphinx;

var TAG = "SPHINX";
var LOG = util.log(TAG);

var pool = mysql.createPool({
  host : CONFIG.host,
  port : CONFIG.port,
  database: "quizbowl"
});

exports.query = function(query, args, callback) {
  var query = util.query(query, args);
  LOG.d("Getting MySQL connection");
  pool.getConnection(function(err, conn) {
    LOG.d("Executing (sphinx):", query);
    conn.query(query, function(err, rows) {
      callback(err, rows);
      conn.release();
    });
  });
}
