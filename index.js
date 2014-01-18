var multilevel = require("multilevel"),
    net        = require("net"),
    reconnect  = require("reconnect"),
    url        = require("url"),
    createClient;

createClient = function(opts) {
  db = multilevel.client();

  connStr = url.format({protocol: "http", hostname: opts.host, port: opts.port});

  reconnect(function(conn){
    console.log("connection reestablished");
    conn.pipe(db.createRpcStream()).pipe(conn);

  }).connect(connStr);
  

  return db

}

module.exports = createClient;
