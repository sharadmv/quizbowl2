var fs = require("fs");
var Sequelize = require("sequelize");
var async = require("async")
var bcrypt = require("bcrypt");

var DB_CONFIG = JSON.parse(fs.readFileSync(__dirname+'/../../dbconfig.json'));

var TAG = "MODEL";

var sequelize = new Sequelize(DB_CONFIG.database, DB_CONFIG.user, DB_CONFIG.password, {
  logging : false });
var Models = {
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
          password : bcrypt.hashSync(password, 10)
        })
      }
    },
    classMethods : {
      buildUser : function(username, password, email, isAdmin, callback) {
        return this.build({
          username : username,
          email : email,
          password : bcrypt.hashSync(password, 10),
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
    tableName : "tossup"
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

sequelize.sync({force:true}).done(function() {
  async.auto({
    user : function(callback) {
      var sharad = Models.User.buildUser("sharad", "sharad", "sharad.vikram@gmail.com", true, function() {});
      sharad.save().success(function(user) {
        callback(null, user);
      });
    },
    post : ['user', function(callback, results) {
      Models.Post.build({
        text : "Hi",
        title : "Hello"
      }).save().success(function(post) {
        callback(null, post);
      })
    }],
    setUser : ['user', 'post', function(callback, results) {
      results.post.setUser(results.user).success(function(post) {
        callback(null, post);
      })
    }],
    comment : ['post', function(callback, results) {
      var comment = Models.Comment.build({
        text : "dere",
        date : new Date()
      }).save().success(function(comment) {
        callback(null, comment);
      });
    }],
    comment2 : ['post', function(callback, results) {
      var comment = Models.Comment.build({
        text : "whaaaat",
        date : new Date()
      }).save().success(function(comment) {
        callback(null, comment);
      });
    }],
    tag: ['post', function(callback, results) {
      var tag = Models.Tag.build({
        text : "awesome",
      }).save().success(function(tag) {
        tag.setPost(results.post);
      });
    }],
    setUserComment : ['user', 'comment', function(callback, results) {
      results.comment.setUser(results.user).success(function(comment) {
        callback(null, comment);
      })
    }],
    setPostComment : ['post','comment', function(callback, results) {
      results.comment.setPost(results.post).success(function(comment) {
        callback(null, comment);
      })
    }],
    setUserComment2 : ['user', 'comment2', function(callback, results) {
      results.comment2.setUser(results.user).success(function(comment) {
        callback(null, comment);
      })
    }],
    setPostComment2 : ['post','comment2', function(callback, results) {
      results.comment2.setPost(results.post).success(function(comment) {
        callback(null, comment);
      })
    }]
  }, function(err, result) {
  });
});

module.exports = Models;
