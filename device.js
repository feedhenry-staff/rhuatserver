module.exports={
  getSessionsByDeviceId:getSessionsByDeviceId,
  newSession:newSession,
  getDeviceIdBySessionId:getDeviceIdBySessionId,
  rmSessionById:rmSessionById
}
/*
{
  deviceId:String,
  sessionId:String,
  createOn:Date
}
*/
var sessions=[];
var _=require("lodash");
var session=require("./session");
function rmSessionById(deviceId,sessionId,cb){
  var removed=_.remove(sessions,function(ses){
    return ses.deviceId===deviceId && ses.sessionId ===sessionId;
  });
  if (removed.length>0){
    session.sendToDevice(deviceId,{
      url:"/session/"+sessionId,
      method:"DELETE"
    },function(err,r){
      if (err){
        log.err(err);
        cb(err);
      }else{
        cb();
      }
    });
  }else{
    cb("Session not found..");
  }
}
function getSessionsByDeviceId(deviceId,cb){
  var ses=_.filter(sessions,function(se){
    return se.deviceId === deviceId;
  });
  if (!ses){
    ses=[];
  }
  cb(null, ses);
}
function newSession(deviceId,sessionId){
  sessions.push({
    deviceId:deviceId,
    sessionId:sessionId,
    createOn:new Date()
  });
}
function getDeviceIdBySessionId(sessionId){
  var ses=_.find(sessions,function(ses){
    return ses.sessionId===sessionId;
  });
  if (ses){
    return ses.deviceId;
  }else{
    return null;
  }
}
