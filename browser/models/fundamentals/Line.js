function Line(from, to, stroke, lineWidth){
  var _self = inherit(this, new Shape());
  var _parent = _self._parent;
  this.className = "Line";
  
  var _from = from;
  var _to = to;

  this.getFrom = function(){ return _from; };
  this.setFrom = function(from){ _from = from; };
  
  this.getTo = function(){ return _to; };
  this.setTo = function(to){ _to = to; };

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
    context.moveTo(0,0);
    context.lineTo(this.getFrom(), this.getTo());
    context.lineWidth = this.getLineWidth();
    context.strokeStyle = this.getStroke();
    context.stroke();
  }
}
