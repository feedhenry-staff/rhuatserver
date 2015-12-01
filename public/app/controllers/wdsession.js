app.controller("wdsession", function($scope, $stateParams, wd) {
  $scope.getSessionId = getSessionId;
  $scope.device = {};
  $scope.wdBack = wdBack;
  $scope.refreshScreen=renderScreen;
  $scope.refreshRate=20;
  var timer = null;
  $scope.$on("$destroy", function() {
    if (timer) {
      clearTimeout(timer);
    }
    if (actionTimer) {
      clearTimeout(actionTimer);
    }
  })
  $scope.$watch("refreshRate",startRefreshTimer);
  function startRefreshTimer(){
      if (timer){
        clearTimeout(timer);
      }
      timer=setTimeout(function(){
        renderScreen();
        timer=null;
        startRefreshTimer();
      },$scope.refreshRate*1000);
  }
  function getSessionId() {
    return $stateParams.sessionId;
  }
  var actionList = [];
  var actionTimer = null;
  $scope.$on("press", function(e, coords) {
    actionList.push({
      "action": "press",
      "options": coords
    });
  });
  $scope.$on("release", function(e, coords) {
    actionList.push({
      "action": "release",
      "options": {}
    });
    deferPerform();
  });
  $scope.$on("move", function(e, coords) {
    actionList.push({
      "action": "moveTo",
      "options": coords
    });
  });


  function deferPerform() {
    var acs = actionList;
    actionList = [];
    var args = {
      "actions": acs
    }
    wd.performTouchAction(getSessionId(), args)
      .then(function() {
        setTimeout(function() {
          renderScreen();
        }, 300);
      });
    actionTimer = null;
  }

  function wdBack() {
    wd.back(getSessionId())
      .then(function() {
        setTimeout(function() {
          renderScreen();
        }, 300);
      })
  }
  var rendering = false;

  function renderScreen() {
    if (rendering) {
      return;
    }
    rendering = true;
    wd.getScreenShot(getSessionId())
      .then(function(ss) {
        rendering = false;
        if (ss.status != 0) {
          // clearInterval(timer);
          // timer = null;
          // alert("Session not valid.");
        } else {
          if (ss.value && ss.value.length > 0) {
            var img = new Image();
            img.onload = function() {
              $scope.getCtx().drawImage(img, 0, 0);
            }
            img.src = "data:image/png;base64," + ss.value;

          }
        }
      });
  }

  function init() {
    if (!timer) {
      wd.getScreenSize(getSessionId())
        .then(function(res) {
          $scope.setCanvasSize(res.value.width, res.value.height);
          setTimeout(function() {
            renderScreen();
          }, 500);
        });
    }
  }
  init();
});
