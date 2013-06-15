/**
 * Entry point for qblication
 */

//Setting up scope
var qb = this;

//Requiring modules
var constants = require('./constants.js')(qb);
qb.constants = constants;

//var model = require('./model.js')(qb);
//qb.model = model;

var server = require('./server.js')(qb);
qb.server = server;

//Setting up important variables
var tier = {
  "test" : qb.constants.tier.TEST,
  "beta" : qb.constants.tier.BETA,
}

//Setting up global variables
qb.tier = tier.test;
if (process.argv[2]) {
  var ns = process.argv[2];
  if (tier[ns]) {
    qb.tier = ns;
  }
}

//Setting up global functions
qb.log = function(tag, message) {
  console.log("["+tag+"]: ", message);
}

//Initializing modules
server.listen();
