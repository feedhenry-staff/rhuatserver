var wd = new require("express").Router();
module.exports = wd;
var session = require("../session");
var log = require("../log");
var device = require("../device");
wd.use(function(req, res, next) {
  var s = "";
  req.on("data", function(d) {
    s += d.toString("utf8");
  });
  req.on("end", function() {
    req.body = s;
    next();
  });
});

wd.post("/session", function(req, res) {
  var data = getForwardData(req);
  var obj = JSON.parse(req.body);
  var deviceId = getDeviceUdid(obj);
  log.info("Create new wd session with device Id: ", deviceId);
  session.sendToDevice(deviceId, data, function(err, r) {
    if (err) {
      log.error(err);
      res.status(500).end(err);
    } else {
      var wdSessionId = JSON.parse(r).sessionId;
      if (wdSessionId.indexOf("null") > -1) {
        log.info("wd session created failed.");
        res.end(r);
      } else {
        device.newSession(deviceId, wdSessionId);
        log.info("wd session id created:", wdSessionId, deviceId);
        res.redirect("/wd/hub/session/" + wdSessionId + "/");
      }
    }
  });
});
wd.use("/session/:sessionId*", function(req, res) {
  log.info("Action ", req.baseUrl, " to ", req.params.sessionId);
  var deviceId = device.getDeviceIdBySessionId(req.params.sessionId);
  if (deviceId) {
    log.info("Mapped to deviceId: ", deviceId);
    var data = getForwardData(req);
    session.sendToDevice(deviceId, data, function(err, r) {
      if (err) {
        console.error(err);
        res.status(500).end(err.toString());
      } else {
        res.end(r);
      }
    });
  } else {
    res.end("Session not found.");
  }
})

function getDeviceUdid(obj) {
  return obj.desiredCapabilities.udid || obj.desiredCapabilities.deviceName || "Android Emulator";
}

function getForwardData(req) {
  return {
    method: req.method,
    url: req.originalUrl.split("/wd/hub")[1],
    headers: req.headers,
    body: req.body
  }
}
// wd.use(function(req, res, next) {
//   var s = "";
//   req.on("data", function(d) {
//     s += d.toString("utf8");
//   });
//   req.on("end", function() {
//     var data = {
//       method: req.method,
//       url: ,
//       headers: req.headers,
//       body: s
//     }
//
//   });
// });
