module.exports = {
  init: init
}
var log=require("./log");
var session=require("./session");
function init(server) {
  var io = require('socket.io')();
  io.serveClient(false);
  io.attach(server);
  // var wsServer = new WebSocketServer({
  //   httpServer: server,
  //   // You should not use autoAcceptConnections for production
  //   // applications, as it defeats all standard cross-origin protection
  //   // facilities built into the protocol and the browser.  You should
  //   // *always* verify the connection's origin and decide whether or not
  //   // to accept it.
  //   autoAcceptConnections:true
  // });
  io.on("connection",onConnection);
  log.info("WSocket server attached.");
}

function onConnection(connection){
  log.info("Connection made.");
  session.newSession(connection);
  connection.on("disconnect",function(){
    log.info("Connection is closed");
    session.rmConnection(connection);
  });
}
