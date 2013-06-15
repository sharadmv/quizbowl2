var init = function(qb) {

  var TAG = "SERVER";

  var express = require('express');
  var app = express();

  app.get('/', function(req, res) {
    res.send("Sharad sucks");
  });

  var ports = {
    "test" : 3000,
    "release" : 80
  }


  return {
    listen : function() {
      var port = process.env.PORT || ports[qb.tier];
      app.listen(port);
      qb.log(TAG, 'Listening on port '+port);
    }
  }
}

module.exports = init;
