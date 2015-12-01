app.directive("canvas",function(){
  return {
    restrict:"E",
    link:function(scope,ele){
      var ctx=ele[0].getContext("2d");
      var ratio=1;
      scope.getCtx=function(){
        return ctx;
      }
      scope.setCanvasSize=function(width,height){
        ele[0].width=width;
        ele[0].height=height;
        ratio=width/400;
        ele.css("width",400);
        ele.css("height",height*400/width);
      }
      var lastPoint=null;
      ele.on("mousedown",function(event){
        var coords=getCoords(event);
        lastPoint=coords;
        scope.$broadcast("press",coords);
        event.preventDefault();
      });
      function getCoords(event){
        var coords={};
        if(event.offsetX!==undefined){
          coords.x = event.offsetX;
          coords.y = event.offsetY;
        } else { // Firefox compatibility
          coords.x = event.layerX - event.currentTarget.offsetLeft;
          coords.y = event.layerY - event.currentTarget.offsetTop;
        }
        coords.x*=ratio;
        coords.y*=ratio;
        return coords;
      }
      ele.on("mousemove",function(event){
        if (lastPoint){
          var coords=getCoords(event);
          var offset={
            x:coords.x-lastPoint.x,
            y:coords.y-lastPoint.y
          }
          lastPoint=coords;
          scope.$broadcast("move",offset);
        }
        event.preventDefault();
      });
      ele.on("mouseup",function(event){
        lastPoint=null;
        scope.$broadcast("release");
        event.preventDefault();
      });
    }
  }
})
