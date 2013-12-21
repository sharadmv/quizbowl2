var model = require('../lib/model');
var util = require('../lib/util');
var async = require('async');
var mc = require('../lib/memcached');

var user = require('../lib/api/user')
var post = require('../lib/api/post')
var tossup = require('../lib/api/tossup')
var tournament = require('../lib/api/tournament')
var difficulty = require('../lib/api/difficulty')
var category = require('../lib/api/category')

var services = {
  search : require('../lib/services/search'),
  check : require('../lib/services/answercheck'),
}

var SUCCESS = require('../lib/constants').api.SUCCESS;
var FAILURE = require('../lib/constants').api.FAILURE;

var MC_TAG = "/api";

exports.user = {
  me : function(req, res) {
    res = res.wrap(req, res);
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
    res = res.wrap(req, res);
    var key = MC_TAG+"/user/"+req.params.id;
    mc.get(key, function(err, data) {
      if (data) {
        res.json(new util.api.Message(data, null, SUCCESS));
      } else {
        user.get(req.params.id, function(err, user) {
          if (err) {
            res.json(new util.api.Message(null, err, FAILURE));
          } else {
            mc.set(key, user);
            res.json(new util.api.Message(user, null, SUCCESS));
          }
        });
      }
    });
  },
  all : function(req, res) {
    res = res.wrap(req, res);
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
    res = res.wrap(req, res);
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
    res = res.wrap(req, res);
    post.get(req.params.id, function(err, post) {
      if (err) {
        res.json(new util.api.Message(null, err, FAILURE));
      } else {
        res.json(new util.api.Message(post, null, SUCCESS));
      }
    });
  },
  all : function(req, res) {
    res = res.wrap(req, res);
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
    res = res.wrap(req, res);
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
    res = res.wrap(req, res);
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

exports.tournament = {
  get : function(req, res) {
    res = res.wrap(req, res);
    var key = MC_TAG+"/tournament/"+req.params.id;
    mc.get(key, function(err, data) {
      if (data) {
        res.json(new util.api.Message(data, null, SUCCESS));
      } else {
        tournament.get(req.params.id, function(err, tournament) {
          if (err) {
            res.json(new util.api.Message(null, err, FAILURE));
          } else {
            mc.set(key, tournament);
            res.json(new util.api.Message(tournament, null, SUCCESS));
          }
        })
      }
    });
  },
  all : function(req, res) {
    res = res.wrap(req, res);
    var key = MC_TAG+"/tournament/all";
    mc.get(key, function(err, data) {
      if (data) {
        res.json(new util.api.Message(data, null, SUCCESS));
      } else {
        tournament.all(function(err, tournaments) {
          if (err) {
            res.json(new util.api.Message(null, err, FAILURE));
          } else {
            mc.set(key, tournaments);
            res.json(new util.api.Message(tournaments, null, SUCCESS));
          }
        })
      }
    });
  },
}

exports.difficulty = {
  get : function(req, res) {
    res = res.wrap(req, res);
    var key = MC_TAG+"/difficulty/"+req.params.id;
    mc.get(key, function(err, data) {
      if (data) {
        res.json(new util.api.Message(data, null, SUCCESS));
      } else {
        difficulty.get(req.params.id, function(err, difficulty) {
          if (err) {
            res.json(new util.api.Message(null, err, FAILURE));
          } else {
            mc.set(key, difficulty);
            res.json(new util.api.Message(difficulty, null, SUCCESS));
          }
        })
      }
    });
  },
  all : function(req, res) {
    res = res.wrap(req, res);
    var key = MC_TAG+"/difficulty/all";
    mc.get(key, function(err, data) {
      if (data) {
        res.json(new util.api.Message(data, null, SUCCESS));
      } else {
        difficulty.all(function(err, difficulties) {
          if (err) {
            res.json(new util.api.Message(null, err, FAILURE));
          } else {
            mc.set(key, difficulties);
            res.json(new util.api.Message(difficulties, null, SUCCESS));
          }
        })
      }
    });
  },
}

exports.category = {
  get : function(req, res) {
    res = res.wrap(req, res);
    var key = MC_TAG+"/category/"+req.params.id;
    mc.get(key, function(err, data) {
      if (data) {
        res.json(new util.api.Message(data, null, SUCCESS));
      } else {
        category.get(req.params.id, function(err, category) {
          if (err) {
            res.json(new util.api.Message(null, err, FAILURE));
          } else {
            mc.set(key, category);
            res.json(new util.api.Message(category, null, SUCCESS));
          }
        })
      }
    });
  },
  all : function(req, res) {
    res = res.wrap(req, res);
    var key = MC_TAG+"/category/all";
    mc.get(key, function(err, data) {
      if (data) {
        res.json(new util.api.Message(data, null, SUCCESS));
      } else {
        category.all(function(err, categories) {
          if (err) {
            res.json(new util.api.Message(null, err, FAILURE));
          } else {
            mc.set(key, categories);
            res.json(new util.api.Message(categories, null, SUCCESS));
          }
        })
      }
    });
  },
}
exports.service = function(req, res) {
  res = res.wrap(req, res);
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
