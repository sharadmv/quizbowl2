var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var model = require('./model');

var TAG = "AUTH";

passport.use(new LocalStrategy(
  function(username, password, done) {
    model.User.find({ where : { username : username }}).success(function(user) {
      if (user && user.comparePassword(password)) {
        return done(null, user);
      }
      return done(null, false);
    }).failure(function() {
      console.log(arguments);
    })
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  model.User.find(id).success(function(user) {
    done(null, user);
  });
});

module.exports = passport;
