var fs = require('fs');

var DB_CONFIG = JSON.parse(fs.readFileSync(__dirname+'/../config/db.json'));
var EMAIL_CONFIG = JSON.parse(fs.readFileSync(__dirname+'/../config/email.json'));
var MEMCACHED_CONFIG = JSON.parse(fs.readFileSync(__dirname+'/../config/memcached.json'));

module.exports = {
  DB : DB_CONFIG,
  EMAIL : EMAIL_CONFIG,
  MEMCACHED : MEMCACHED_CONFIG
}
