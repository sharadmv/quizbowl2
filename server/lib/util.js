var util = {
  log : function(tag, message) {
    var log = Array.prototype.slice.call(arguments)
    log[0] = "["+log[0]+"]: ";
    console.log.apply(null, log);
  }
}

module.exports = util;
