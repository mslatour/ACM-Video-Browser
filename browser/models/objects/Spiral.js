function Spiral(length, skip, A, B, C){
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

  this.pointOnCircleToAngle = function(originX, originY, pointX, pointY){
    var r = Math.sqrt(
      Math.pow((originX - pointX),2) + 
      Math.pow((originY - pointY),2)
    );
    var c;
    if( originX < pointX){
      c = Math.sqrt(
        Math.pow((originY-r-pointY),2) +
        Math.pow((originX-pointX),2)
      );
      return (Math.acos((2*r*r-c*c)/(2*r*r)) % (2*Math.PI));
    }else if(originX == pointX){
      if(originY < pointY){
        return Math.PI;
      }else{
        return 0;
      }
    }else{
//      pointX += 2*(originX - pointX);
      c = Math.sqrt(
        Math.pow((originY-r-pointY),2) +
        Math.pow((originX-pointX),2)
      );
      return (Math.PI+Math.acos((2*r*r-c*c)/(2*r*r)) % (2*Math.PI));
    }
  }

  this.layout = function(){
    var elements = this.getElements();
    var offset = Math.floor(length/(this.getNumberOfElements()+1));
    
    var i, a, angle, x, y;
    var startx = Math.floor(this.getLayer().getApplication().getWidth()/2);
    var starty = Math.floor(this.getLayer().getApplication().getHeight()/2);

    i = skip;
    for ( elem in elements ){
      a = A * i;
      x=startx+((B*a)*Math.cos(a) * ( C * a));
      y=starty+((B*a)*Math.sin(a) * ( C * a));
      angle = this.pointOnCircleToAngle(startx, starty, x, y);
      this.layoutElement(elem, x, y, angle);
      i += offset;
    }
  }

}
