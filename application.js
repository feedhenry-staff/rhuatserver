var app=require("express")();
var log=require("./log");
app.use("/api",require("./routes/api"));
app.use("/wd/hub",require("./routes/wd"));
app.use(function(err,req,res,next){
    if (err){
      res.status(500).json({error:err});
    }
    next();
});
require("rhmap-express-wrapper")(app,require('fh-mbaas-api'),[]);
app.use("/",require("express").static(__dirname+"/public"));
var server=require("http").createServer(app);
var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 9999;
server.listen(port,function(){
  log.info("server started at port: ",port);
});
require("./comm").init(server);
