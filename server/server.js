var express = require("express");
var auth = require('./lib/auth');
var qb = require('../app');
var util = require('./lib/util');
var routes = {
  user : require('./routes/user'),
  post : require('./routes/post'),
  api : require('./routes/api'),
}

var TAG = "SERVER";

var app = express();

app.configure(function() {
  app.set("view engine", "jade");
  app.set("views", __dirname + "/../views");

  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret : 'lolol' }));

  app.use(auth.initialize());
  app.use(auth.session());
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/login', function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('login');
  }
});

app.post('/login', auth.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }), function(req, res) {
    res.redirect('/');
  }
);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}

var ports = {
  "test" : 3000,
  "beta" : 8080,
  "release" : 80,
}

module.exports = {
  listen : function() {
    var port = process.env.PORT || ports[qb.tier];
    app.listen(port);
    util.log(TAG, "Listening on port "+port);
  }
}
