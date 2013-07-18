var model = require('../../lib/model');
var async = require('async');

module.exports = {
  get : function(id, callback) {
    async.auto({
      tossup : function(callback) {
        model.Tossup.find({
          where : { id : id },
        }).success(function(tossup) {
          if (tossup == null) {
            callback({ code : "Tossup not found" }, null);
          } else {
            callback(null, tossup);
          }
        }).failure(function(error) {
          callback(error, null);
        });
      },
      category : ['tossup', function(callback, results) {
        results.tossup.getCategory().success(function(category) {
          callback(null, category.name);
        });
      }],
      difficulty : ['tossup', function(callback, results) {
        results.tossup.getDifficulty().success(function(difficulty) {
          callback(null, difficulty.name);
        });
      }],
      tournament : ['tossup', function(callback, results) {
        results.tossup.getTournament().success(function(tournament) {
          callback(null, { year : tournament.year, name : tournament.name });
        });
      }],
      round : ['tossup', function(callback, results) {
        results.tossup.getRound().success(function(round) {
          callback(null, round.name);
        });
      }],
      response : ['category', 'difficulty', 'tournament', 'round', 'tossup', function(callback, results) {
        var tossup = results.tossup.values;

        tossup.category = results.category;
        tossup.difficulty = results.difficulty;
        tossup.tournament = results.tournament;
        tossup.round = results.round;

        delete tossup.categoryId
        delete tossup.difficultyId
        delete tossup.tournamentId
        delete tossup.roundId

        callback(null, tossup);
      }]
    }, function(err, results) {
      callback(err, results.response);
    })
  },
}
