(function() {
  var triggers = {};
  window.events = {
    on : function(event, callback){
      if (!triggers[event]) {
        triggers[event] = [];
      }
      triggers[event].push(callback);
    },
    trigger : function(ev) {
      console.log("EVENT", ev);
      if (triggers[ev]) {
        for (var trigger in triggers[ev]) {
          triggers[ev][trigger](ev);
        }
      }
    }
  }
  window.events.on("auth", function() {
  });
  window.events.on("login", function() {
    $("#fbLoginDiv").html("Logged In");
    $(".fbLoginButtonWrapper").css({ width : "128px" });
  });
  var authenticate = function() {
    events.trigger("auth");
    auth.login(FB.getAccessToken(), function(u) {
      $.ajax("/api/auth?userId="+u.id+"&callback=?",{
        success : function(response) {
          window.userId = u.id;
        }
      });
      doneAuthentication(u);
    });
  }

  var authenticateWithId = function(id) {
    events.trigger("auth");
    auth.loginWithId(id, function(u) {
      doneAuthentication(u);
    });
  }

  var doneAuthentication = function(u) {
    window.user = u;
    setInterval(alive, 30000);
    events.trigger("login");
    console.log("Authenticated with QuizbowlDB: ", user);
  }
  var alive = function() {
    auth.alive(user.id);
  }
  function getQueryStrings() {
    var assoc  = {};
    var decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
    var queryString = location.search.substring(1);
    var keyValues = queryString.split('&');

    for(var i in keyValues) {
      var key = keyValues[i].split('=');
      if (key.length > 1) {
        assoc[decode(key[0])] = decode(key[1]);
      }
    }

    return assoc;
  }
  if(!getQueryStrings()["fb"] == "false")  {
  } else {
    window.login = function() {
      if (window["FB"] === undefined) {
        console.log("Already authed");
      } else {
        FB.login();
      }
    };

    $.ajax("/api/difficulty",{
      success : function(response) {
        window.difficulties = response.data;
        events.trigger("difficulties_loaded");
      }
    });
    $.ajax("/api/category",{
      success : function(response) {
        window.categories = response.data;
        events.trigger("categories_loaded");
      }
    });
    $.ajax("/api/tournament/",{
      success : function(response) {
        window.tournaments = response.data;
        events.trigger("tournaments_loaded");
      }
    });
  };
})();
