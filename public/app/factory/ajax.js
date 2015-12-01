app.factory("ajax",function($q){

  function ajax(opts){
    var defer=$q.defer();
    opts.success=function(data){
      defer.resolve(data);
    }
    opts.error=function(err,xhr,body){
      defer.reject(body);
    }
    $.ajax(opts);
    return defer.promise;
  }

  return ajax;
});
