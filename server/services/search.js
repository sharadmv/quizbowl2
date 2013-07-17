var mysql = require('mysql');
var util = require('../lib/util');
var CONFIG = require('../config').DB.sphinx;

var TAG = "SEARCH"
var LOG = util.log(TAG);

var conn = mysql.createConnection({
  host : CONFIG.host,
  port : CONFIG.port,
});

var QUERY = "select * from tossup";

var defaults = {
  limit : 10,
  offset : 0,
  sort : "year"
}
var search = function(options, callback) {
  var query = QUERY;
  var args = [];
  var match = "";
  var matchArgs = []
  var other = "";
  var otherArgs = [];
  for (var key in options) {
    if (key == "difficulty") {
      match += "@difficulty ?";
      matchArgs.push(options[key]);
    } else if (key == "category") {
      match += "@category ?";
      matchArgs.push(options[key]);
    } else if (key == "tournament") {
      match += "@tournament ?";
      matchArgs.push(options[key]);
    } else if (key == "question") {
      match += "@question ?";
      matchArgs.push(options[key]);
    } else if (key == "answer") {
      match += "@answer ?";
      matchArgs.push(options[key]);
    } else if (key == "tossup") {
      match += "(@answer ? | @question ?)";
      matchArgs.push(options[key]);
      matchArgs.push(options[key]);
    } else if (key == "year") {
      other += "year = ?";
      otherArgs.push(options[key]);
    }
  }
  var where = []
  if (matchArgs.length > 0) {
    match = util.query("MATCH('?')", [util.query(match, matchArgs)]);
    where.push(match);
  }
  if (otherArgs.length > 0) {
    other = util.query(other, otherArgs);
    where.push(other);
  }
  if (where.length > 0) {
    query += " WHERE " + where.join(" AND ");
  }
  var sort = options.sort || defaults.sort;
  if (sort == "random") {
    query += " order by rand()";
  } else {
    query += " order by ? desc";
    args.push(sort);
  }

  var limit = options.limit || defaults.limit;
  var offset = options.offset || defaults.offset;
  limit = parseInt(limit);
  query += " limit ?,?";
  args.push(offset);
  args.push(limit);
  query = util.query(query, args);
  conn.query(query, function(err, rows) {
    callback(err, rows)
  });
}

module.exports = search;
