var model = require('../lib/model');
var util = require('../lib/util');
var async = require('async');

var SUCCESS = require('../lib/constants').api.SUCCESS;
var FAILURE = require('../lib/constants').api.FAILURE;

exports.user = {
  me : function(req, res) {
    if (req.user) {
      req.params.id = req.user.id;
      exports.user.get(req, res);
    } else {
      res = res.wrap(res);
      res.json(new util.api.Message(null, "Not logged in", FAILURE));
    }
  },
  get : function(req, res) {
    res = res.wrap(res);
    model.User.find({
      attributes : ['username', 'id'],
      where : { id : req.params.id }
    }).success(function(user) {
      if (user) {
        res.json(new util.api.Message(user, null, SUCCESS));
      } else {
        res.json(new util.api.Message(null, "User not found", FAILURE));
      }
    }).failure(function(err) {
      res.json(new util.api.Message(null, error.code, FAILURE));
    });
  },
  all : function(req, res) {
    res = res.wrap(res);
    model.User.findAll({
      attributes : ['username', 'id']
    }).success(function(users) {
      res.json(new util.api.Message(users, null, SUCCESS));
    }).failure(function(error) {
      res.json(new util.api.Message(null, error.code, FAILURE));
    });
  },
  update : function(req, res) {
    //TODO implement this
  },
  create : function(req, res) {
    res = res.wrap(res);
    async.auto({
      email: function(callback) {
        callback(null, req.body.email);
      },
      username : function(callback) {
        callback(null, req.body.username);
      },
      password : function(callback) {
        util.generateHex(12, function(string) {
          callback(null, string);
        });
      },
      create : ['email', 'username', 'password', function(callback, results) {
        var user = model.User.buildUser(results.username, results.password, results.email, false, function(){});
        user.save()
        .success(function(user) {
          res.json(new util.api.Message(user.id, null, SUCCESS));
          util.sendEmail(
             user,
            "Your account has been created",
            "Username: "+user.username+"\nPassword: "+results.password
          );
        })
        .failure(function(error) {
          res.json(new util.api.Message(null, error.code, FAILURE));
        });
      }]
    });
  }
}

exports.post = {
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
