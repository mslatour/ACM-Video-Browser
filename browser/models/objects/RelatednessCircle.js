function RelatednessCircle(origin){
  var _self = inherit(this, new Graphical());
  _self = inherit(_self, new LayoutManager(), "_lm_parent");
  var _parent = _self._parent;
  this.className = "RelatednessCircle";

  var _origin = origin;

  this.getOrigin = function(){ return _origin; }
  this.setOrigin = function(origin){ _origin = origin; }
  
  this.beforeDraw = function(context){
    context.beginPath();
  }
  
  this.draw = function(context){
    _parent.draw(context);

    context.getOrigin().paint();
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
      pointX += 2*(originX - pointX);
      pointY += 2*(originY - pointY);
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

    i = skip;
    for ( elem in elements ){
      a = A * i;
      x=this.getX()+((B*a)*Math.cos(a) * ( C * a));
      y=this.getY()+((B*a)*Math.sin(a) * ( C * a));
      angle = this.pointOnCircleToAngle(this.getX(), this.getY(), x, y);
      this.layoutElement(elem, x, y, angle);
      i += offset;
    }
  }

}
