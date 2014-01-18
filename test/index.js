var test = require("tape"),
    multilevel = require('multilevel'),
    net = require('net'),
    levelup = require("levelup"),
    memdown = require("memdown"),
    createClient = require(".."),
    dbFactory = function (path) { return new memdown(path) },
    createServer, closeServer;

createServer = function(opts) {
  var mdb, server;
  
  mdb = multilevel.server(levelup(opts.path, {db: dbFactory}));

  server = net.createServer(function (netConn) {

    netConn.pipe(mdb).pipe(netConn);

  }).listen(opts.port);

  server.sockets = [];

  server.on("connection", function(socket){
    server.sockets.push(socket);
  });

  return server;
}

closeServer = function(server, cb){
  server.sockets.forEach(function(socket){
    socket.destroy();
  });
  server.close(cb);
}

test("should connect to server", function(t){
  var server = createServer({port: "3000", path: "./db"}),
      client = createClient({host:"localhost", port: "3000"});

  client.put("key", "value", function(err){
    t.notOk(err, "no err from put");

    client.get("key", function(err, item){
      t.notOk(err, "no err from get");
      t.equal(item, "value");

      client.close();
      server.close(function(){
        t.end();  
      });
      
    });
  });
});


test("should auto reconnect after disconnect", function(t){
  var server = createServer({port: "3000", path: "./db"}),
      client = createClient({host:"localhost", port: "3000"}),
      server;

  client.put("key", "value", function(err){
    t.notOk(err, "no err from put");
    
    closeServer(server, function(){
      server = createServer({port: "3000", path: "./db"});

      client.get("key", function(err, item){
        t.notOk(err, "no err from get");
        t.equal(item, "value");

        client.close();
        server.close(function(){
          t.end();  
        });
      });
    });
  });
});