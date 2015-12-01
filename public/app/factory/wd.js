app.factory("wd",function(ajax){
  var exports={
    getScreenShot:getScreenShot,
    getScreenSize:getScreenSize,
    performTouchAction:performTouchAction,
    back:back
  };

  function back(sesId){
    return ajax({
      url:"/wd/hub/session/"+sesId+"/back",
      method:"POST",
      contentType:"application/json",
      data:"{}"
    });
  }
  function performTouchAction(sesId,act){
    return ajax({
      url:"/wd/hub/session/"+sesId+"/touch/perform",
      method:"POST",
      contentType:"application/json",
      dataType:"JSON",
      data:JSON.stringify(act)
    });
  }
  function getScreenSize(sesId){
    return ajax({
      url:"/wd/hub/session/"+sesId+"/window/current/size",
      dataType:"JSON"
    });
  }
  function getScreenShot(sesId){
    return ajax({
      url:"/wd/hub/session/"+sesId+"/screenshot",
      dataType:"JSON"
    });
  }
  return exports;
});
