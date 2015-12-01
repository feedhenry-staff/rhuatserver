app.factory("device", function(ajax ) {
  var exports = {
    getSessions: getSessions,
    getDeviceSessions: getDeviceSessions,
    terminateSession:terminateSession,
    createSession:createSession
  };

  function terminateSession(deviceId,sessionId){
    return ajax({
      method:"DELETE",
      url:"api/device/"+deviceId+"/session/"+sessionId
    })
  }
  function getSessions() {
    return ajax({
      url: "api/sessions"
    });
  }
  function getDeviceSessions(deviceId){
    return ajax({
      url:"api/device/"+deviceId+"/sessions"
    });
  }
  function createSession(args){
    return ajax({
      url:"wd/hub/session",
      method:"POST",
      data:JSON.stringify(args),
      contentType:"application/json"
    });
  }


  return exports;
});
