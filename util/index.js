module.exports={
  hfn:hfn
}
var _=require("lodash");
function hfn(func,argPaths){
  return function(req,res,next){
    var args=_.map(argPaths,function(path){
      return _.get(req,path);
    });
    args.push(function(err,r){
      if (err){
        if (err.code){
          res.status(err.code);
          next(err.message);
        }else{
          next(err);
        }
      }else{
        if (!r){
          r={};
        }
        res.json(r);
      }
    });
    func.apply({},args);
  }
}
