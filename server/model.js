var fs = require('fs');
var Sequelize = require('sequelize');

var DB_CONFIG = JSON.parse(fs.readFileSync(__dirname+'/../dbconfig.json'));

var sequelize = new Sequelize(DB_CONFIG.database, DB_CONFIG.user);

var init = function(app) {

  var TAG = "MODEL";

  var Models = {
    User : sequelize.define("User", {
      username : Sequelize.STRING,
      password : Sequelize.STRING,
      isAdmin : Sequelize.BOOLEAN,
    }, {
      tableName : "user"
    }),
    Post : sequelize.define("Post", {

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

  Models.Round.belongsTo(Models.Tournament);

  Models.Tossup.belongsTo(Models.Tournament);
  Models.Tossup.belongsTo(Models.Round);
  Models.Tossup.belongsTo(Models.Category);
  Models.Tossup.belongsTo(Models.Difficulty);

  sequelize.sync({force : true}).done(function() {
  });

  return Models;
}

module.exports = init;
