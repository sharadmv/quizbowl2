var model = require('../../lib/model');
var async = require('async');

var SUCCESS = require('../../lib/constants').api.SUCCESS;
var FAILURE = require('../../lib/constants').api.FAILURE;

var util = require(__dirname+"/../../lib/util")
module.exports = {
  get : function(id, callback) {
    async.auto({
      post : function(callback) {
        model.Post.find({
          where : { id : id },
        }).success(function(post) {
          if (post == null) {
            callback({ code : "Post not found" }, null);
          } else {
            callback(null, post);
          }
        }).failure(function(error) {
          callback(error, null);
        });
      },
      tags : ['post', function(callback, results) {
        results.post.getTags().success(function(tags) {
          callback(null, tags);
        });
      }],
      comments : ['post', function(callback, results) {
        results.post.getComments().success(function(comments) {
          callback(null, comments);
        });
      }],
      response : ['tags', 'comments', 'post', function(callback, results) {
        var post = results.post;
        post = post.values;
        post.tags = results.tags;
        post.comments = results.comments;
        callback(null, post);
      }]
    }, function(err, post) {
      callback(err, post.response);
    })
  },
  all : function(callback) {
    model.Post.findAll({
      include : [model.Tag]
    }).success(function(posts) {
      callback(null, posts);
    }).failure(function(err) {
      callback(err, null);
    });
  }
}
