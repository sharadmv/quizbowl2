var mysql = require('mysql');
var util = require('../util');
var sphinx = require('../sphinx');
var mc = require('../memcached');

var TAG = "SEARCH"
var MC = util.mc.init(TAG)
var LOG = util.log(TAG);

var QUERY = "select * from tossup";

var defaults = {
  limit : 10,
  offset : 0,
  sort : "year"
}

var OPTIONS = ['difficulty','category','tournament','question','answer','tossup','year','sort','limit','offset']
var search = function(options, callback) {
  var query = QUERY;
  var args = [];
  var match = "";
  var matchArgs = []
  var other = "";
  var otherArgs = [];
  LOG.d(getKey(options));
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
  sphinx.query(query, args, function(err, rows) {
    callback(err, rows);
  });
}

var getKey = function(options) {
    var key = [];
    for (var i in OPTIONS) {
      var option = OPTIONS[i];
      key.push(option+":"+options[option]);
    }
    return key.join("&");
}

module.exports = function(options, callback) {
  if (options.sort != "random") {
    mc.get(MC.serialize(options, OPTIONS), function(err, data) {
      if (data) {
        callback(null, data);
      } else {
        search(options, function(err, data) {
          mc.set(MC.serialize(options, OPTIONS), data);
          callback(err, data);
        });
      }
    })
  } else {
    search(options, callback);
  }
};
