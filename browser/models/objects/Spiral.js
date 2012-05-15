function Spiral(length, A, B, C){
  var _self = inherit(this, new Graphical());
  _self = inherit(_self, new LayoutManager(), "_lm_parent");
  var _parent = _self._parent;
  this.className = "Spiral";
  
  this.beforeDraw = function(context){
    context.beginPath();
  }
  
  this.draw = function(context){
    _parent.draw(context);
    var i, angle, x, y;
    var startx = Math.floor(this.getLayer().getApplication().getWidth()/2);
    var starty = Math.floor(this.getLayer().getApplication().getHeight()/2);


    for (i=0; i < length; i++) {
      angle = A * i;
      x=startx+((B*angle)*Math.cos(angle) * ( C * angle));
      y=starty+((B*angle)*Math.sin(angle) * ( C * angle));
      context.lineTo(x, y);
    }
    context.lineWidth = 15;
    context.stroke();
  }
  
  this.afterDraw = function(context){
    context.closePath();
  }

  this.layout = function(){
    var elements = this.getElements();
    var offset = Math.floor(length/(this.getNumberOfElements()+1));
    
    var i, angle, x, y;
    var startx = Math.floor(this.getLayer().getApplication().getWidth()/2);
    var starty = Math.floor(this.getLayer().getApplication().getHeight()/2);

    i = 50;
    for ( elem in elements ){
      angle = A * i;
      x=startx+((B*angle)*Math.cos(angle) * ( C * angle));
      y=starty+((B*angle)*Math.sin(angle) * ( C * angle));
      this.layoutElement(elem, x, y);
      i += offset;
    }
  }

}
