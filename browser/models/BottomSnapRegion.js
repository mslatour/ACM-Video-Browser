function BottomSnapRegion(){
  var _self = inherit(this, new SnapRegion());
  var _parent = _self._parent;
  this.className = "BottomSnapRegion";

  this.getAutoSnapY = function(graphical){
    return (
      Math.floor(this.getHeight()/2) -
      Math.floor(graphical.getHeight()/2)
    );
  }

  this.contains = function(e){
    if(e.draggedObject){
      var x1 = e.draggedObject.getX();
      var x2 = x1+e.draggedObject.getWidth();
      var y = e.draggedObject.getY()+e.draggedObject.getHeight();
      var myX1 = this.getX();
      var myX2 = myX1 + this.getWidth();

      return (
        y >= this.getY() && 
        y <= this.getY()+this.getHeight() &&
        ( 
          ( x1 >= myX1 && x1 <= myX2) ||
          ( x2 >= myX1 && x2 <= myX2) ||
          ( x1 <= myX1 && x2 >= myX2)
        )
      );
    }else{
      _parent.contains.call(this,e);
    }
  }
}
