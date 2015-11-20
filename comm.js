module.exports = {
  init: init
}
var log=require("./log");
var session=require("./session");
function init(server) {
  var WebSocketServer = require('websocket').server;
  var wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections:true
  });
  wsServer.on("connect",onConnection);
  wsServer.on("close",onClose);
  log.info("WSocket server attached.");
}

function onConnection(connection){
  log.info("Connection made.");
  session.newSession(connection);
}

function onClose(connection,reason){
  log.info("Connection is closed due to: ",reason);
  session.rmConnection(connection);
}
