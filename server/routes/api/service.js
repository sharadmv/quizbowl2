var search = require('../../services/search');
var async = require('async');

var SUCCESS = require('../../lib/constants').api.SUCCESS;
var FAILURE = require('../../lib/constants').api.FAILURE;

var util = require(__dirname+"/../../lib/util")
module.exports = {
  search : function(options, callback) {
    search(options, callback);
  }
}
