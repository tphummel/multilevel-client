var multilevel = require("multilevel"),
    net        = require("net"),
    reconnect  = require("reconnect"),
    url        = require("url"),
    createClient;

createClient = function(opts) {
  db = multilevel.client();

  strm = reconnect(function(conn){
    console.log("connected");
    conn.pipe(db.createRpcStream()).pipe(conn);

  }).connect(opts);
  // strm.reconnect = false;
  
  strm.on("disconnect", function(){
    console.log("disconnect");
  });

  strm.on("backoff", function(attempts, delay){
    console.log("backoff reconnect",attempts);
  });

  strm.on("reconnect", function(){
    console.log("reconnect attempting");
  });
  
  db.reconnectOff = function(){
    strm.reconnect = false;
  }

  return db

}

module.exports = createClient;
