var model = require('../../lib/model');
var async = require('async');

var SUCCESS = require('../../lib/constants').api.SUCCESS;
var FAILURE = require('../../lib/constants').api.FAILURE;
var util = require(__dirname+"/../../lib/util")

module.exports = {
  get : function(id, callback) {
    model.Tournament.find({
      attributes : ['year', 'id', 'name'],
      where : { id : id }
    }).success(function(tournament) {
      if (!tournament) {
        callback({ code : "Tournament not found" }, null);
        return;
      } else {
        callback(null, tournament)
      }
    }).failure(function(err) {
      callback(err, null);
    });
  },
  all : function(callback) {
    model.Tournament.findAll({
      attributes : ['year', 'id', 'name']
    }).success(function(tournaments) {
      callback(null, tournaments);
    }).failure(function(err) {
      callback(err, null);
    });
  },
  update : function(req, res) {
    //TODO implement this
  }
}
