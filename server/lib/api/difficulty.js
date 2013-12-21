var model = require('../../lib/model');
var async = require('async');

var SUCCESS = require('../../lib/constants').api.SUCCESS;
var FAILURE = require('../../lib/constants').api.FAILURE;
var util = require(__dirname+"/../../lib/util")

module.exports = {
  get : function(id, callback) {
    model.Difficulty.find({
      attributes : ['id', 'name'],
      where : { id : id }
    }).success(function(difficulty) {
      if (!difficulty) {
        callback({ code : "Difficulty not found" }, null);
        return;
      } else {
        callback(null, difficulty)
      }
    }).failure(function(err) {
      callback(err, null);
    });
  },
  all : function(callback) {
    model.Difficulty.findAll({
      attributes : ['id', 'name']
    }).success(function(difficulties) {
      callback(null, difficulties);
    }).failure(function(err) {
      callback(err, null);
    });
  },
  update : function(req, res) {
    //TODO implement this
  }
}
