var express = require("express");
var auth = require('./lib/auth');
var qb = require('../app');
var util = require('./lib/util');
var ejs = require('ejs');
var engine = require('ejs-locals');
var routes = {
  api : require('./routes/api'),
}

var TAG = "SERVER";
var LOG = util.log(TAG);

var app = express();

app.configure(function() {
  app.engine('ejs', engine);
  app.set("view engine", "ejs");
  app.set("views", __dirname + "/../views");

  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret : 'lolol' }));
  app.use(express.static('./public'));

  app.use(auth.initialize());
  app.use(auth.session());
  app.use(function(req, res, next){
    LOG.d(req.method, req.url);
    next();
  });
});

express.response.wrap = function(req, res) {
  var start = new Date().getTime();
  return {
    json : function(message) {
      var msg = (new util.api.Response(
        message.data,
        message.error,
        message.status,
        start,
        new Date().getTime(),
        req.url
      ));
      LOG.write("message")("MESSAGE", {
        "error" : msg.error,
        "status" : msg.status,
        "elapsed" : msg.elapsed,
        "start" : msg.start,
        "end" : msg.end,
        "url" : msg.url,
      });
      res.json(msg);
    }
  }
}

app.get('/login', function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('login');
  }
});

app.post('/api/login', auth.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }), function(req, res) {
    res.redirect('/');
  }
);

app.get('/', function (req, res) {
  res.render('home', { page: 'home' });
});

app.get('/search', function (req, res) {
  if (!req.query.params) {
    req.query.params = {};
  }
  res.render('search', { page: 'search',query : req.query.params });
});

app.get('/reader', function (req, res) {
  res.render('reader', { page: 'reader' });
});
app.get('/api/user/me', routes.api.user.me);
app.get('/api/user/:id', routes.api.user.get);
app.get('/api/user', routes.api.user.all);
app.get('/api/user/', routes.api.user.all);
app.post('/api/user/', routes.api.user.create);
app.put('/api/user/', routes.api.user.update);

app.get('/api/post/:id', routes.api.post.get);
app.get('/api/post', routes.api.post.all);
app.get('/api/post/', routes.api.post.all);
app.post('/api/post/', routes.api.post.create);

app.get('/api/tossup/:id', routes.api.tossup.get);
app.get('/api/tournament/:id', routes.api.tournament.get);
app.get('/api/tournament/', routes.api.tournament.all);
app.get('/api/tournament', routes.api.tournament.all);
app.get('/api/difficulty/:id', routes.api.difficulty.get);
app.get('/api/difficulty/', routes.api.difficulty.all);
app.get('/api/difficulty', routes.api.difficulty.all);
app.get('/api/category/:id', routes.api.category.get);
app.get('/api/category/', routes.api.category.all);
app.get('/api/category', routes.api.category.all);

app.get('/api/service/:name', routes.api.service);

function isAuthed(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}

function isUser(req, res, next) {
  if (req.isAuthenticated() && req.user.id == req.params.id) {
    return next();
  }
  res.send(401);
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.send(401);
}

var ports = {
  "test" : 3000,
  "beta" : 8080,
  "release" : 80,
}

module.exports = {
  listen : function() {
    var port = process.env.PORT || ports[qb.TIER];
    app.listen(port);
    LOG.i("Listening on port "+port);
  }
}
