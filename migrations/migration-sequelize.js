var fs = require('fs');
var model = require(__dirname+'/../server/lib/model')
var mysql = require('mysql');
var async = require('async');
var DB_CONFIG = JSON.parse(fs.readFileSync('../config/db.json')).development;
var async = require('async');
var quizbowl = mysql.createConnection({
  host     : DB_CONFIG.host,
  user     : DB_CONFIG.user,
  password : DB_CONFIG.password,
  database : DB_CONFIG.database
});
var qb = mysql.createConnection({
  host     : DB_CONFIG.host,
  user     : "sharad",
  password : "",
  database : "sandbox"
});
difficulty = {}
category = {}
setTimeout(function() {
  async.parallel([
                 function() {
    qb.query('select distinct category from tossup', function(err, rows) {
      for (var i in rows) {
        var row = rows[i];
	console.log("Inserting category");
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
	console.log("Inserting difficulty");
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

}, 3000)
setTimeout(function() {
  async.parallel([
    function(callback) {
      qb.query('select * from tossup order by id asc', function(err, rows) {
	console.log("Got tossups", rows.length);
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
		console.log("Inserting tournament");
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
	console.log("Inserting round: ", rows.length);
        for (var i in rows) {
          (function(i) {
            round = rows[i];
            console.log("Round:", round)
            t = model.Round.build({
              id : round.id,
              name : round.round,
              tournamentId : round.tournament
            }).save().success(function(){
              if (i == rows.length - 1) {
                callback();
              }
              console.log("Round:", i)
		console.log("Length: " , rows.length);
            })
          })(i);
        }
      });
    }
  ], function() {
    console.log("DONE");
  })


}, 7000);
