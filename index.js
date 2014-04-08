(function(){
  var multilevel = require("multilevel"),
      reconnect  = require("reconnect-net"),
      url        = require("url"),
      logger, createClient;

  logger = function(msg){
    console.log('[multilevel-client]', new Date().toISOString(), '|', msg);
  }

  createClient = function(opts) {
    var db = multilevel.client(),
        strm;

    strm = reconnect(function(conn){
      conn.on('error', logger);

      logger('connected');

      var rpc = db.createRpcStream();
      rpc.on('error', logger);

      conn.pipe(rpc).pipe(conn);

    }).connect(opts);

    strm.on("disconnect", function(){
      logger('disconnect');
    });

    strm.on("backoff", function(attempts, delay){
      logger('backoff '+attempts);
    });

    strm.on("reconnect", function(){
      logger('reconnect attempting');
    });

    db.reconnectOff = function(){
      strm.reconnect = false;
    }

    return db;

  }

  module.exports = createClient;
})();
