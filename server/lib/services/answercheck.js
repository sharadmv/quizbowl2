var util = require('../util');

var TAG = "CHECK"
var MC = util.mc.init(TAG)
var LOG = util.log(TAG);

var check = function(answer, canon, callback) {
  util.check(answer, canon, function(results) {

    callback(null, results);
  });
}

module.exports = function(options, callback) {
  check(options.answer, options.canon, function(err, results) {
    callback(err, results);
  });
};
