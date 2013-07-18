var util = require('./util');
var Memcached = require('memcached');
var CONFIG = require('../config').MEMCACHED;

var TAG = "MEMCACHED";
var LOG = util.log(TAG);

var location = CONFIG.hostname+":"+CONFIG.port;
var mc = new Memcached(location);

exports.get = function(key, callback) {
  LOG.d("GET", key);
  mc.get(key, callback);
}

exports.set = function(key, value, callback) {
  callback = callback || function(){};
  LOG.d("SET", key);
  mc.set(key, value, CONFIG.timeout, callback);
}
