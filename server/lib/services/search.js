var mysql = require('mysql');
var util = require('../util');
var sphinx = require('../sphinx');
var mc = require('../memcached');
var async = require('async');

var TAG = "SEARCH"
var MC = util.mc.init(TAG)
var LOG = util.log(TAG);

var QUERY = "select * from tossup";
var COUNT = "select 1 as c, count(*), year from tossup";

var defaults = {
  limit : 10,
  offset : 0,
  sort : "year"
}

var OPTIONS = ['difficulty','category','tournament','question','answer','tossup','year','sort','limit','offset','term']
var search = function(options, callback) {
  var query = QUERY;
  var count = COUNT;
  var args = [];
  var match = "";
  var matchArgs = []
  var other = "";
  var otherArgs = [];
  LOG.d(getKey(options));
  if (!options["condition"]) {
    options["condition"] = "answer"
  }
  if (!options["term"]) {
    options["term"] = ""
  }
  for (var key in options) {
    if (key == "difficulty") {
      match += " @difficulty ?";
      matchArgs.push(options[key]);
    } else if (key == "category") {
      match += " @category \"?\"";
      matchArgs.push(options[key]);
    } else if (key == "tournament") {
      var spl = options[key];
      var tournament = spl.substring(5);
      var year = spl.substring(0, 4);
      other += "year = ?";
      otherArgs.push(year);
      match += " @tournament \"?\"";
      matchArgs.push(tournament);
    } else if (key == "question") {
      match += " @question \"?\"";
      matchArgs.push(options[key]);
    } else if (key == "condition" && options["term"] != "") {
      if (options[key] == "answer") {
          match += " @answer \"?\"";
          matchArgs.push(options["term"]);
      } else if (options[key] == "question") {
          match += " @question \"?\"";
          matchArgs.push(options["term"]);
      } else {
          match += " (@answer \"?\" | @question \"?\")";
          matchArgs.push(options["term"]);
          matchArgs.push(options["term"]);
      }
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
    count += " WHERE " + where.join(" AND ");
  }
  count += " group by c";
  var sort = options.sort || defaults.sort;
  if (sort == "random") {
    query += " order by rand()";
  } else {
    query += " order by ? desc";
    count += " order by ? desc";
    args.push(sort);
  }

  var limit = options.limit || defaults.limit;
  var offset = options.offset || defaults.offset;
  limit = parseInt(limit);
  offset = parseInt(offset);
  query += " limit ?,?";
  args.push(offset);
  args.push(limit);
  next = {}
  previous = {}
  for (var key in options) {
      next[key] = options[key];
      previous[key] = options[key];
  }
  next["offset"] = offset + limit;
  next["limit"] = limit;
  previous["offset"] = Math.max(0, offset - limit);
  previous["limit"] = limit;
  nextstring = "";
  previousstring = "";
  delimiter = "";
  for (var key in next) {
    nextstring += delimiter + key + "=" + next[key];
    delimiter = "&";
  }
  delimiter = "";
  for (var key in previous) {
    previousstring += delimiter + key + "=" + previous[key];
    delimiter = "&";
  }
  var next = "/services/search" + "";
  async.parallel([
    function(callback) {
      sphinx.query(query, args, function(err, rows) {
        if (err) {
            LOG.d(err);
            callback(err, []);
            return;
        }
        callback(err, {
            results : rows,
            next : "/api/service/search?" + nextstring,
            previous : "/api/service/search?" + previousstring,
        });
      });
    }, function(callback) {
      sphinx.query(count, args, function(err, rows) {
        if (err) {
            callback(err, []);
            return;
        }
        var count = 0;
        if (rows.length > 0) {
          count = rows[0]['@count'];
        }
        callback(err, count);
      });
    }
  ], function(err, results) {
    if (err) {
        callback([]);
    } else {
        results[0]['count'] = results[1];
        callback(err, results[0]);
    }
  })
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
