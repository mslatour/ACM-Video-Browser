function Rectangle(stroke, lineWidth){
  var _self = inherit(this, new Shape());
  var _parent = _self._parent;
  this.className = "Rectangle";

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
    context.rect(
      0,
      0,
      this.getWidth(),
      this.getHeight()
    );
    context.lineWidth = this.getLineWidth();
    context.strokeStyle = this.getStroke();
    context.stroke();
  }
}
