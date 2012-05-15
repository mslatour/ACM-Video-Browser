function Connection(from, to, width){
  var _self = inherit(this, new Shape());
  var _parent = _self._parent;
  this.className = "Connection";

  var _from;
  var _to;

  var _lineWidth = (width != undefined ? width : 1);

  this.getFromGraphical = function(){ return _from; };
  this.setFromGraphical = function(from){
    _from = from;
  }

  this.getToGraphical = function(){ return _to; };
  this.setToGraphical = function(to){
    _to = to;
  }

  this.getLineWidth = function(){ return _lineWidth; }

  this.setFromGraphical(from);
  this.setToGraphical(to);

  this.draw = function(context){
    _parent.draw(context);
    var from = this.getFromGraphical();
    var to = this.getToGraphical();
    context.moveTo(
      Math.floor(from.getX()+(from.getWidth()/2)), 
      Math.floor(from.getY()+(from.getHeight()/2))
    );
    context.lineTo(
      Math.floor(to.getX()+(to.getWidth()/2)), 
      Math.floor(to.getY()+(to.getHeight()/2))
    );
    context.lineWidth = this.getLineWidth();
    context.stroke();
  }
}
