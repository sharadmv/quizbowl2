var fs = require("fs");
var Sequelize = require("sequelize");
var async = require("async")
var bcrypt = require("bcrypt-nodejs");
var CONFIG = require('../config').DB.development;
var util = require('../lib/util');
var model = require('../lib/model');

var TAG = "SCRIPT";
var LOG = util.log(TAG);

var sequelize = new Sequelize(CONFIG.database, CONFIG.username, CONFIG.password, {
  logging : LOG.d });

var main = function() {
  console.log(model);
  var sharad = model.User.buildUser(
    "sharad",
    "sharad",
    "sharad.vikram@gmail.com",
    true,
    function() {
      LOG.d("User created!");
    }
  );
  sharad.save();
}

sequelize.sync().done(function() {
  LOG.i("Connected to MySQL");
  main();
});
