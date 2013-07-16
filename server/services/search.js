var mysql = require('mysql');
var util = require('../lib/util');
var CONFIG = require('../config').DB.sphinx;

var TAG = "SEARCH"

var conn = mysql.createConnection({
  host : CONFIG.host,
  port : CONFIG.port,
});

var QUERY = "select * from tossup";

var defaults = {
  limit : 10
}
var search = function(options, callback) {
  util.log(TAG, options);
  var query = QUERY;
  var args = [];
  for (var key in options) {
  }
  if (options.sort) {
    if (options.sort == "random") {
      query += " order by rand()";
    } else {
      query += " order by ? desc";
      args.push(options.sort);
    }
  }

  var limit = options.limit || defaults.limit;
  limit = parseInt(limit);
  query += " limit ?";
  args.push(limit);
  query = util.query(query, args);
  util.log(TAG, query);
  conn.query(query, function(err, rows) {
    callback(err, rows)
  });
}

module.exports = search;
