var model = require('../../lib/model');
var sphinx = require('../../lib/sphinx');
var async = require('async');

module.exports = {
  get : function(id, callback) {
    var query = "select * from tossup where id = ?";
    sphinx.query(query, [id], callback);
  },
}
