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

express.response.wrap = function(res) {
  var start = new Date().getTime();
  return {
    json : function(message) {
      res.json(new util.api.Response(
        message.data,
        message.error,
        message.status,
        start,
        new Date().getTime()
      ));
    }
  }
}
app.get('/', isAdmin, function(req, res) {
  res.render('index');
});

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
    var port = process.env.PORT || ports[qb.tier];
    app.listen(port);
    util.log(TAG, "Listening on port "+port);
  }
}
