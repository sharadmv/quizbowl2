var fs = require('fs');
var DB_CONFIG = JSON.parse(fs.readFileSync(__dirname+'/../config/config.json'));
var EMAIL_CONFIG = JSON.parse(fs.readFileSync(__dirname+'/../config/email.json'));

module.exports = {
  DB : DB_CONFIG,
  EMAIL : EMAIL_CONFIG
}
