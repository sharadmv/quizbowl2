var model = require('../../lib/model');
var async = require('async');

var SUCCESS = require('../../lib/constants').api.SUCCESS;
var FAILURE = require('../../lib/constants').api.FAILURE;
var util = require(__dirname+"/../../lib/util")
module.exports = {
  me : function(req, res) {
    if (req.user) {
      req.params.id = req.user.id;
      module.exports.get(req, res);
    } else {
      res = res.wrap(res);
      res.json(new util.api.Message(null, "Not logged in", FAILURE));
    }
  },
  get : function(req, res) {
    res = res.wrap(res);
    model.User.find({
      attributes : ['username', 'id', 'isAdmin'],
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
      attributes : ['username', 'id', 'isAdmin']
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
