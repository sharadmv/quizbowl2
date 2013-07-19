var model = require('../lib/model');
var util = require('../lib/util');
var async = require('async');
var mc = require('../lib/memcached');

var user = require('../lib/api/user')
var post = require('../lib/api/post')
var tossup = require('../lib/api/tossup')
var services = {
  search : require('../lib/services/search')
}

var SUCCESS = require('../lib/constants').api.SUCCESS;
var FAILURE = require('../lib/constants').api.FAILURE;

var MC_TAG = "/api";

exports.user = {
  me : function(req, res) {
    res = res.wrap(res);
    if (req.user) {
      user.get(req.user.id, function(err, user) {
        if (err) {
          res.json(new util.api.Message(null, err, FAILURE));
        } else {
          res.json(new util.api.Message(user, null, SUCCESS));
        }
      });
    } else {
      res.json(new util.api.Message(null, "Not logged in", FAILURE));
    }
  },
  get : function(req, res) {
    res = res.wrap(res);
    user.get(req.params.id, function(err, user) {
      if (err) {
        res.json(new util.api.Message(null, err, FAILURE));
      } else {
        res.json(new util.api.Message(user, null, SUCCESS));
      }
    });
  },
  all : function(req, res) {
    res = res.wrap(res);
    user.all(function(err, users) {
      if (err) {
        res.json(new util.api.Message(null, err, FAILURE));
      } else {
        res.json(new util.api.Message(users, null, SUCCESS));
      }
    });
  },
  update : function(req, res) {
    //TODO: do this
  },
  create : function(req, res) {
    res = res.wrap(res);
    user.create(req.body.username, req.body.email, function(err, user) {
      if (err) {
        res.json(new util.api.Message(null, err, FAILURE));
      } else {
        res.json(new util.api.Message(user, null, SUCCESS));
      }
    });
  }
}

exports.post = {
  get : function(req, res) {
    res = res.wrap(res);
    post.get(req.params.id, function(err, post) {
      if (err) {
        res.json(new util.api.Message(null, err, FAILURE));
      } else {
        res.json(new util.api.Message(post, null, SUCCESS));
      }
    });
  },
  all : function(req, res) {
    res = res.wrap(res);
    post.all(function(err, posts) {
      if (err) {
        res.json(new util.api.Message(null, err, FAILURE));
      } else {
        res.json(new util.api.Message(posts, null, SUCCESS));
      }
    });
  },
  update : function(req, res) {
    //TODO: do this
  },
  create : function(req, res) {
    res = res.wrap(res);
    post.create(req.body.title, req.body.text, function(err, post) {
      if (err) {
        res.json(new util.api.Message(null, err, FAILURE));
      } else {
        res.json(new util.api.Message(post, null, SUCCESS));
      }
    });
  }
}

exports.tossup = {
  get : function(req, res) {
    res = res.wrap(res);
    var key = MC_TAG+"/tossup/"+req.params.id;
    mc.get(key, function(err, data) {
      if (data) {
        res.json(new util.api.Message(data, null, SUCCESS));
      } else {
        tossup.get(req.params.id, function(err, tossup) {
          if (err) {
            res.json(new util.api.Message(null, err, FAILURE));
          } else {
            mc.set(key, tossup);
            res.json(new util.api.Message(tossup, null, SUCCESS));
          }
        })
      }
    });
  },
}

exports.service = function(req, res) {
  res = res.wrap(res);
  if (req.params.name) {
    service = services[req.params.name];
    if (service) {
      service(req.query, function(err, result) {
        if (err) {
          res.json(new util.api.Message(null, err, FAILURE));
        } else {
          res.json(new util.api.Message(result, null, SUCCESS));
        }
      });
    } else {
      res.json(new util.api.Message(null, "Service does not exist", FAILURE));
    }
  } else {
    res.json(new util.api.Message(null, "Need service name", FAILURE));
  }
}
