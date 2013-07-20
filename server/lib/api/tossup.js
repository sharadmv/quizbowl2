var model = require('../../lib/model');
var sphinx = require('../../lib/sphinx');
var async = require('async');

module.exports = {
  get : function(id, callback) {
    var query = "SELECT * FROM `tossup` WHERE id = ?";
    sphinx.query(query, [id], function(err, tossup) {
      if (tossup && tossup.length > 0) {
        callback(null, tossup[0]);
      } else {
        callback(err, null);
      }
    });
  },
}
