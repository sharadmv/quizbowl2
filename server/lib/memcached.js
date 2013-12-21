var util = require('./util');
var Memcached = require('memcached');
var CONFIG = require('../config').MEMCACHED;

var TAG = "MEMCACHED";
var LOG = util.log(TAG);

var location = CONFIG.hostname+":"+CONFIG.port;
var mc = new Memcached(location);

exports.get = function(key, callback) {
  callback = callback || function(){};
  LOG.d("GET", key);
  mc.get(key, function(err, data) {
      if (data) {
          LOG.d("HIT", key);
      } else {
          LOG.d("MISS", key);
      }
      callback(err, data);
  });
}

exports.set = function(key, value, callback) {
  callback = callback || function(){};
  if (!value) {
    callback();
    return;
  }
  LOG.d("SET", key);
  mc.set(key, value, CONFIG.timeout, callback);
}
