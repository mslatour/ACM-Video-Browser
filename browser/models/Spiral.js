function Spiral(){
  var _self = inherit(this, new Shape());
  var _parent = _self._parent;
  this.className = "Spiral";

  this.draw = function(context){
    for (i=0; i< 720; i++) {
      angle = 0.1 * i;
      x=(1+angle)*Math.cos(angle);
      y=(1+angle)*Math.sin(angle);
      context.lineTo(x, y);
    }
  }
}
