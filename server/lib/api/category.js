var model = require('../../lib/model');
var async = require('async');

var SUCCESS = require('../../lib/constants').api.SUCCESS;
var FAILURE = require('../../lib/constants').api.FAILURE;
var util = require(__dirname+"/../../lib/util")

module.exports = {
  get : function(id, callback) {
    model.Category.find({
      attributes : ['id', 'name'],
      where : { id : id }
    }).success(function(category) {
      if (!category) {
        callback({ code : "Category not found" }, null);
        return;
      } else {
        callback(null, category)
      }
    }).failure(function(err) {
      callback(err, null);
    });
  },
  all : function(callback) {
    model.Category.findAll({
      attributes : ['id', 'name']
    }).success(function(categories) {
      callback(null, categories);
    }).failure(function(err) {
      callback(err, null);
    });
  },
  update : function(req, res) {
    //TODO implement this
  }
}
