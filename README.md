## multilevel-client

connect to a [multilevel][0] server. w/ [reconnect][1]

[![Build Status](https://travis-ci.org/tphummel/multilevel-client.png)](https://travis-ci.org/tphummel/multilevel-client)  
[![NPM](https://nodei.co/npm/multilevel-client.png?downloads=true)](https://nodei.co/npm/multilevel-client)


## install

    npm install multilevel-client

## test
    
    npm test

## usage

    var mc = require("multilevel-client");
    var conn = mc({host: "localhost", port: "3000"});
    conn.get("key", function(err, item){
      ...
    });


  [0]: https://github.com/juliangruber/multilevel
  [1]: https://github.com/dominictarr/reconnect