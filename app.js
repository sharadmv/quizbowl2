/**
 * Entry point for qblication
 */

//Requiring modules
var constants = require('./server/lib/constants.js');
var server = require('./server/server.js');


//Setting up important variables
var tier = {
  "test" : constants.tier.TEST,
  "beta" : constants.tier.BETA,
  "release" : constants.tier.RELEASE,
}

//Setting up global variables
exports.tier = tier[process.argv[2]] || tier.test;


//Starting server
server.listen();
