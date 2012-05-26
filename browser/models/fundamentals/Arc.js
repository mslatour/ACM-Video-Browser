function Arc(radius, from, to, stroke, lineWidth){
  var _self = inherit(this, new Shape());
  var _parent = _self._parent;
  this.className = "Arc";
  
  var _radius = radius;
  var _fromAngle = from;
  var _toAngle = to;

  this.getRadius = function(){ return _radius; };
  this.setRadius = function(radius){ _radius = radius; };

  this.getFromAngle = function(){ return _fromAngle; };
  this.setFromAngle = function(angle){ _fromAngle = angle; };
  
  this.getToAngle = function(){ return _toAngle; };
  this.setToAngle = function(angle){ _toAngle = angle; };

  var _stroke = stroke;
  var _lineWidth = lineWidth;

  this.getStroke = function(){ return _stroke; }
  this.setStroke = function(stroke){ _stroke = stroke; }

  this.getLineWidth = function(){ return _lineWidth; }
  this.setLineWidth = function(lineWidth){ _lineWidth = lineWidth; }

  /**
   * @overide Shape.draw
   **/
  this.draw = function(context){
    _parent.draw(context);
    context.arc(
      0,
      0,
      this.getRadius(),
      this.getFromAngle(),
      this.getToAngle(),
      false
    );
    context.lineWidth = this.getLineWidth();
    context.strokeStyle = this.getStroke();
    context.stroke();
  }
}
