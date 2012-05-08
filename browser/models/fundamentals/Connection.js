function Connection(from, to){
  var _self = inherit(this, new Shape());
  var _parent = _self._parent;
  this.className = "Connection";

  var _from;
  var _to;

  this.getFromGraphical = function(){ return _from; };
  this.setFromGraphical = function(from){
    _from = from;
  }

  this.getToGraphical = function(){ return _to; };
  this.setToGraphical = function(to){
    _to = to;
  }

  this.setFromGraphical(from);
  this.setToGraphical(to);

  this.draw = function(context){
    _parent.draw(context);
    var from = this.getFromGraphical();
    context.moveTo(from.getX(), from.getY());
    context.lineTo(to.getX(), to.getY());
  }
}
