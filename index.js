(function(){
  var multilevel = require("multilevel"),
      reconnect  = require("reconnect-net"),
      url        = require("url"),
      createClient;

  createClient = function(opts) {
    var db = multilevel.client(),
        strm;

    strm = reconnect(function(conn){

      conn.on('error', function(e){
        console.log('[multilevel-client] tcp err:', e);
      });

      console.log("[multilevel-client] connected ", new Date);
      var rpc = db.createRpcStream();
      rpc.on('error', function(e){
        console.log('[multilevel-client] rpcStreamError: ', e, new Date)
      });
      conn.pipe(rpc).pipe(conn);

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

    return db;

  }

  module.exports = createClient;
})();
