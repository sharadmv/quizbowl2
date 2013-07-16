var fs = require('fs');
var model = require(__dirname+'/../server/lib/model')
var mysql = require('mysql');
var async = require('async');
var DB_CONFIG = JSON.parse(fs.readFileSync(__dirname+'/../dbconfig.json'));
var async = require('async');
var quizbowl = mysql.createConnection({
  host     : DB_CONFIG.host,
  user     : DB_CONFIG.user,
  password : DB_CONFIG.password,
  database : DB_CONFIG.database
});
var qb = mysql.createConnection({
  host     : DB_CONFIG.host,
  user     : "root",
  password : "root",
  database : "qb"
});
difficulty = {}
category = {}
setTimeout(function() {
  async.parallel([
                 function() {
    qb.query('select distinct category from tossup', function(err, rows) {
      for (var i in rows) {
        var row = rows[i];
        (function(row) {
          category = model.Category.build({
            name : row.category,
            id : row.id
          }).save().success(function(row) {
            category[row.name] = row.id
          });
        })(row);
      }
    })},
    function() {
    qb.query('select distinct difficulty from tossup', function(err, rows) {
      for (var i in rows) {
        var row = rows[i];
        (function(row) {
          category = model.Difficulty.build({
            name : row.difficulty,
            id : row.id
          }).save().success(function(row) {
            difficulty[row.name] = row.id
          });
        })(row);
      }
    })}
  ])

}, 1000)
setTimeout(function() {
  async.parallel([
    function(callback) {
      qb.query('select * from tossup order by id asc', function(err, rows) {
        for (var i in rows) {
          (function(i) {
            question = rows[i];
            tossup = model.Tossup.build({
              id : question.id,
              question : question.question,
              number : question.question_num,
              answer : question.answer,
              categoryId : category[question.category],
              difficultyId : difficulty[question.difficulty],
              roundId : question.round,
              tournamentId : question.tournament
            }).save().success(function(){
              if (i == rows.length) {
                callback();
              }
              console.log("Tossup:", i)
            })
          })(i);
        }
      });
    },
    function(callback) {

      qb.query('select * from tournament order by id asc', function(err, rows) {
        for (var i in rows) {
          (function(i) {
            tournament = rows[i];
            t = model.Tournament.build({
              id : tournament.id,
              year : tournament.year,
              name : tournament.name
            }).save().success(function(){
              if (i == rows.length) {
                callback();
              }
              console.log("Tournament:",i)
            })
          })(i);
        }
      });
    },
    function(callback) {

      qb.query('select * from round order by id asc', function(err, rows) {
        for (var i in rows) {
          (function(i) {
            round = rows[i];
            t = model.Round.build({
              id : round.id,
              name : round.round,
              tournamentId : round.tournament
            }).save().success(function(){
              if (i == rows.length) {
                callback();
              }
              console.log("Round:", i)
            })
          })(i);
        }
      });
    }
  ], function() {
    console.log("DONE");
  })


}, 3000);
