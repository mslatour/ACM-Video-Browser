function Spiral(){
  var _self = inherit(this, new Shape());
  var _parent = _self._parent;
  this.className = "Spiral";

  this.draw = function(context){
    _parent.draw(context);
    var i, angle, x, y;
    var startx = Math.floor(this.getLayer().getApplication().getWidth()/2);
    var starty = Math.floor(this.getLayer().getApplication().getHeight()/2);
    for (i=0; i< 720; i++) {
      angle = 0.1 * i;
      x=startx+(1+angle)*Math.cos(angle);
      y=starty+(1+angle)*Math.sin(angle);
      context.lineTo(x, y);
    }
    context.stroke();
  }
}
