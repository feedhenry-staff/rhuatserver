module.exports = {
  newSession: createSession,
  rmConnection: rmConnection,
  send: _send,
  sendToDevice: sendToDevice,
  registerDevice: registerDevice,
  getDevices: getDevices,
  rmDevices: rmDevices,
  getSessions:getSessions,
  setDevices:setDevices,

  newWdSession:newWdSession
}
var log = require("./log");
var uuid = require('node-uuid');
var _ = require("lodash");
// {
//     "uuid":String,
//     "connection":Object,
//     "devices":[{id:String,name:String,wdSession:{createOn:Date,sessionId:String}}],
//     "connectDate":Date
//     "pendingMsg":[String]
// }
var sessions = [];
var callbackPool = {};
function newWdSession(deviceId,sessionId){
  var ses=_.find(sessions,function(s){
    var dev=_.find(s.devices,function(d){
      return d.id===deviceId;
    });
    if (dev){
      return true;
    }else{
      return false;
    }
  });
  if (ses){

  }
  sessions.push({
    deviceId:deviceId,
    sessionId:sessionId,
    createOn:new Date()
  });
}

function getSessions(cb){
  cb(null,_.map(sessions,function(ses){
    return {
      uuid:ses.uuid,
      devices:ses.devices,
      connectDate:ses.connectDate,
      pendingMsg:ses.pendingMsg
    }
  }));
}
function setDevices(sessionId,devices,cb){
  var ses=getSessionById(sessionId);
  if (ses){
    ses.devices=devices;
  }
  cb(null);
}
function getDevices(sessionId, cb) {
  var ses = getSessionById(sessionId);
  cb(null, ses.devices);
}

function rmDevices(sessionId, deviceId, cb) {
  var ses = getSessionById(sessionId);
  _.remove(ses.devices, function(dev) {
    return dev.id === deviceId;
  });
  cb();
}

function registerDevice(sessionId, device, cb) {
  log.info("register new device ",device," for session: ",sessionId);
  var ses = getSessionById(sessionId);
  var d = _.find(ses.devices, function(de) {
    return de.id === device.id
  });
  if (!d) {
    ses.devices.push(device)
  }else{
    log.info("Device already existed");
  }
  cb();
}

function createSession(connection) {
  var uid = uuid.v4();
  sessions.push({
    uuid: uid,
    connection: connection,
    devices: [],
    connectDate: new Date(),
    pendingMsg: []
  });
  connection.on("message", onConnectionMessage);
  connection.on("error", onConnectionError(connection));
  // connection.on("close", onConnectionClose(connection));
  connection.emit("ping",uid);
  // connection.ping(uid);
}

function rmConnection(connection) {
  var ses = getSessionByConnection(connection);
  if (ses) {
    //call all pending msg callbacks.
    log.info("Connection removed for ", ses.uuid);
    sessions.splice(sessions.indexOf(ses), 1);
  }
}

function _send(session, msg, cb) {
  var message = {
    msgId: Date.now()+ "" + Math.round(Math.random() * 1000000),
    data: msg
  }
  if (session && session.connection) {
    callbackPool[message.msgId] = cb;
    session.connection.emit("message",JSON.stringify(message));
    session.pendingMsg.push(message.msgId);
  }else{
    cb(new Error("Session not found"));
  }
}

function getSessionByDeviceId(id) {
  return _.find(sessions, function(ses) {
    var dev = _.find(ses.devices, function(d) {
      return d.id === id;
    });
    return !!dev;
  });
}

function sendToDevice(deviceId, msg, cb) {
  var ses = getSessionByDeviceId(deviceId);
  if (ses){
    return _send(ses, msg, cb);
  }else{
    cb(new Error("Device not found."));
  }
}

function onConnectionMessage(message) {
  var data = message.toString("utf8");
  try {
    var obj = JSON.parse(data);
    parseMsg(obj);
  } catch (e) {
    log.error(e);
  }
}

function parseMsg(obj) {
  if (obj.isReply) {
    var msgId = obj.msgId;
    var data = obj.data;
    var cb = callbackPool[msgId];
    if (cb) {
      cb(null, data);
      delete callbackPool[msgId];
    }
    _rmPendingMsg(msgId);
  } else {
    //TODO
  }
}

function _rmPendingMsg(msgId) {
  var ses = _.find(sessions, function(se) {
    return se.pendingMsg.indexOf(msgId) > -1;
  });
  if (ses){
    ses.pendingMsg.splice(ses.pendingMsg.indexOf(msgId), 1);
  }
}

function onConnectionError(connection) {
  return function(err) {
    log.error("Error happens in WS connection.");
    log.error(err);
  }
}

function onConnectionClose(connection) {
  return function() {
    log.info("Connection closed.");
    rmConnection(connection);
  }
}

function getSessionByConnection(connection) {
  return _.find(sessions, function(session) {
    return session.connection === connection;
  });
}

function getSessionById(sessionId) {
  return _.find(sessions, function(ses) {
    return ses.uuid === sessionId;
  });
}
