function Shape(){
  var _self = inherit(this, new Graphical());
  var _parent = _self._parent;
  this.className = "Shape";

  this.beforeDraw = function(context){
    _parent.beforeDraw(context);
    context.beginPath();
  }
  
  this.afterDraw = function(context){
    context.closePath();
    _parent.afterDraw(context);
  }
}
