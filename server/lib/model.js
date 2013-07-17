var fs = require("fs");
var Sequelize = require("sequelize");
var async = require("async")
var bcrypt = require("bcrypt-nodejs");
var CONFIG = require('../config').DB.development;
var util = require('../lib/util');

var TAG = "MODEL";
var LOG = util.log(TAG);

var sequelize = new Sequelize(CONFIG.database, CONFIG.user, CONFIG.password, {
  logging : false });
var Models = {
  Sequelize : sequelize,
  User : sequelize.define("User", {
    username : {
      type : Sequelize.STRING,
      unique : true
    },
    password : Sequelize.STRING,
    email : Sequelize.STRING,
    isAdmin : Sequelize.BOOLEAN,
  }, {
    tableName : "user",
    instanceMethods : {
      comparePassword : function(password) {
        return bcrypt.compareSync(password, this.password)
      },
      updatePassword : function(password) {
        return this.updateAttributes({
          password : bcrypt.hashSync(password)
        })
      }
    },
    classMethods : {
      buildUser : function(username, password, email, isAdmin, callback) {
        return this.build({
          username : username,
          email : email,
          password : bcrypt.hashSync(password),
          isAdmin : isAdmin
        });
      }
    }
  }),
  Post : sequelize.define("Post", {
    title : Sequelize.STRING,
    text : Sequelize.TEXT,
  }, {
    tableName : "post"
  }),
  Comment : sequelize.define("Comment", {
    text : Sequelize.TEXT,
    date : Sequelize.DATE,
  }, {
    tableName : "comment"
  }),
  Tag : sequelize.define("Tag", {
    text : Sequelize.STRING,
  }, {
    tableName : "tag"
  }),
  Tournament : sequelize.define("Tournament", {
    year : Sequelize.INTEGER,
    name : Sequelize.STRING
  }, {
    tableName : "tournament"
  }),
  Round : sequelize.define("Round", {
    name : Sequelize.STRING
  }, {
    tableName : "round"
  }),
  Difficulty : sequelize.define("Difficulty", {
    name : Sequelize.STRING
  }, {
    tableName : "difficulty"
  }),
  Category : sequelize.define("Category", {
    name : Sequelize.STRING
  }, {
    tableName : "category"
  }),
  Tossup : sequelize.define("Tossup", {
    question : Sequelize.TEXT,
    answer : Sequelize.TEXT,
    number : Sequelize.INTEGER,
  }, {
    tableName : "tossup",
    engine : "myisam"
  })
}

Models.Post.belongsTo(Models.User);
Models.User.hasMany(Models.Post);
Models.Comment.belongsTo(Models.Post);
Models.Post.hasMany(Models.Comment);
Models.Tag.belongsTo(Models.Post);
Models.Post.hasMany(Models.Tag);
Models.Comment.belongsTo(Models.User);
Models.User.hasMany(Models.Comment);

Models.Round.belongsTo(Models.Tournament);

Models.Tossup.belongsTo(Models.Tournament);
Models.Tossup.belongsTo(Models.Round);
Models.Tossup.belongsTo(Models.Category);
Models.Tossup.belongsTo(Models.Difficulty);

sequelize.sync().done(function() {
  LOG.i("Connected to MySQL");
});

module.exports = Models;
