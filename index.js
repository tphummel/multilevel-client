(function(){
  var multilevel = require("multilevel"),
      net        = require("net"),
      reconnect  = require("reconnect-net"),
      url        = require("url"),
      createClient;

  createClient = function(opts) {
    var db = multilevel.client(),
        strm;

    strm = reconnect(function(conn){
      console.log("[multilevel-client] connected ", new Date);
      conn.pipe(db.createRpcStream()).pipe(conn);

    }).connect(opts);
    
    strm.on("disconnect", function(){
      console.log("[multilevel-client] disconnect", new Date);
    });

    strm.on("backoff", function(attempts, delay){
      console.log("[multilevel-client] backoff reconnect", attempts, new Date);
    });

    strm.on("reconnect", function(){
      console.log("[multilevel-client] reconnect attempting", new Date);
    });
    
    db.reconnectOff = function(){
      strm.reconnect = false;
    }

    return db

  }

  module.exports = createClient;
})();
