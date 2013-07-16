var model = require('../../lib/model');
var async = require('async');

var SUCCESS = require('../../lib/constants').api.SUCCESS;
var FAILURE = require('../../lib/constants').api.FAILURE;

var util = require(__dirname+"/../../lib/util")
module.exports = {
  get : function(req, res) {
    res = res.wrap(res);
    async.auto({
      post : function(callback) {
        model.Post.find({
          where : { id : req.params.id },
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
        res.json(new util.api.Message(post, null, SUCCESS));
      }]
    }, function(error) {
      res.json(new util.api.Message(null, error.code, FAILURE));
    })
  },
  all : function(req, res) {
    res = res.wrap(res);
    model.Post.findAll({
      include : [model.Tag]
    }).success(function(posts) {
      res.json(new util.api.Message(posts, null, SUCCESS));
    }).failure(function(error) {
      res.json(new util.api.Message(null, error.code, SUCCESS));
    });
  }
}
