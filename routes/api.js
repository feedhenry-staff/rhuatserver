var Router=require("express").Router;
var api=new Router();
module.exports=api;
var jsonP=require("body-parser").json();
var hfn=require("../util").hfn;
var device=require("../device");
var session=require("../session");
api.use(jsonP);


api.post("/session/:sessionId/registerDevice",hfn(session.registerDevice,["params.sessionId","body"]));
api.get("/session/:sessionId/devices",hfn(session.getDevices,["params.sessionId"]));
api.get("/sessions",hfn(session.getSessions,[]));
api.delete("/session/:sessionId/device/:deviceId",hfn(session.rmDevices,["params.sessionId","params.deviceId"]));
