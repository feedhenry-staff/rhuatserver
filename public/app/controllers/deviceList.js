app.controller("deviceList", function($scope, device, $mdDialog) {
  $scope.sessions = [];
  $scope.curDevice = null;
  $scope.loading = false;
  $scope.selectDevice = function(dev) {
    $scope.curDevice = dev;
    $scope.refreshDeviceSession(dev.id);
  }
  $scope.refreshDeviceSession = function(devId) {
    $scope.loading = true;
    device.getDeviceSessions(devId)
      .then(function(sessions) {
        $scope.curDevice.sessions = sessions;
        $scope.loading = false;
      });
  }
  $scope.terminateSession = function(deId, seId) {
    device.terminateSession(deId, seId)
      .then(function() {
        $scope.refreshDeviceSession();
      });
  }
  $scope.createSessionDlg = function(deId, platform) {
    var desire = {
      "desiredCapabilities": {
        "browserName": "",
        "appium-version": "1.3",
        "platformName": platform,
        "udid": deId,
        "deviceName": "Real Device",
        "app": "",
        "newCommandTimeout": 600
      }
    };
    $mdDialog.show({
      templateUrl: "tmpl/createSession.html",
      clickOutsideToClose: true,
      controller: function($scope, $mdDialog) {
        $scope.url="";
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
        $scope.submit = function(answer) {
          desire.desiredCapabilities.app=$scope.url;
          $mdDialog.hide(desire);
        };
      }
    })
    .then(device.createSession)
    .then(function(r){
      $scope.refreshDeviceSession (deId);
    });
  }

  function refresh() {
    device.getSessions()
      .then(function(s) {
        $scope.sessions = s;
      });
  }
  refresh();
});
