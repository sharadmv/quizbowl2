var crypto = require('crypto');
var nodemailer = require("nodemailer");
var CONFIG = require('../config').EMAIL;

var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",
   auth: {
       user: CONFIG.email,
       pass: CONFIG.password
   }
});

var util = {
  log : function(tag) {
    return {
      d : function(message) {
        var log = Array.prototype.slice.call(arguments)
        util.logger("DEBUG", tag, log);
      },
      i : function(message) {
        var log = Array.prototype.slice.call(arguments)
        util.logger("INFO", tag, log);
      },
      w : function(message) {
        var log = Array.prototype.slice.call(arguments)
        util.logger("WARNING", tag, log);
      },
      e : function(message) {
        var log = Array.prototype.slice.call(arguments)
        util.logger("ERROR", tag, log);
      },
      f : function(message) {
        var log = Array.prototype.slice.call(arguments)
        util.logger("FATAL", tag, log);
      }
    }
  },
  logger : function(level, tag, args) {
    args.unshift("("+level+") ["+tag+"]\t");
    console.log.apply(null, args);
  },
  generateHex : function(length, callback) {
    crypto.randomBytes(length, function(ex, buf) {
      callback(buf.toString('base64').replace(/\//g,'_').replace(/\+/g,'-'));
    });
  },
  sendEmail : function(user, title, text) {
    smtpTransport.sendMail({
     from: "bousheesnaw@gmail.com",
     to: user.email,
     subject: title,
     text: text
    });
  },
  api : {
    Response : function(data, error, status, start, end) {
      this.data = data;
      this.error = error;
      this.status = status;
      this.start = start;
      this.end = end;
      this.elapsed = end - start;
    },
    Message : function(data, error, status){
      this.data = data;
      this.error = error;
      this.status = status;
    }
  },
  query : function(query, args) {
    while (args.length > 0) {
      query = query.replace('?', args.shift());
    }
    return query;
  }
}

module.exports = util;
