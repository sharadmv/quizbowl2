var model = require('../../lib/model');
var async = require('async');

var SUCCESS = require('../../lib/constants').api.SUCCESS;
var FAILURE = require('../../lib/constants').api.FAILURE;
var util = require(__dirname+"/../../lib/util")

module.exports = {
  get : function(id, callback) {
    model.User.find({
      attributes : ['username', 'id', 'isAdmin'],
      where : { id : id }
    }).success(function(user) {
      if (!user) {
        callback({ code : "User not found" }, null);
        return;
      } else {
        callback(null, user)
      }
    }).failure(function(err) {
      callback(err, null);
    });
  },
  all : function(callback) {
    model.User.findAll({
      attributes : ['username', 'id', 'isAdmin']
    }).success(function(users) {
      callback(null, users);
    }).failure(function(err) {
      callback(err, null);
    });
  },
  update : function(req, res) {
    //TODO implement this
  },
  create : function(username, email, callback) {
    async.auto({
      email: function(callback) {
        callback(null, email);
      },
      username : function(callback) {
        callback(null, username);
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
          util.sendEmail(
             user,
            "Your account has been created",
            "Username: "+user.username+"\nPassword: "+results.password
          );
          callback(null, user)
        })
        .failure(function(err) {
          callback(err, null);
        });
      }]
    }, function(err, user) {
        callback(err, user);
    });
  }
}
