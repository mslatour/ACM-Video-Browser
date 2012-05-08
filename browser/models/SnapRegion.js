function SnapRegion(){
  var _self = inherit(this, new Graphical());
  var _parent = _self._parent;
  this.className = "SnapRegion";

  var _owner = "App";

  var _fixedFill = false;
  var _fill = false;
  this.setFixedFill = function(fill){ _fixedFill = fill; };
  this.setFill = function(fill){ _fill = fill; };
  
  var _prefSnapX = "auto";
  var _prefSnapY = "auto";

  // Values = "auto"||false
  this.setPrefSnapX = function(prefSnapX){
    _prefSnapX = prefSnapX;
  }
  
  // Values = "auto"||false
  this.setPrefSnapY = function(prefSnapY){
    _prefSnapY = prefSnapY;
  }

  this.getAutoSnapX = function(graphical){
    return Math.floor(this.getWidth()/2);
  }

  this.getAutoSnapY = function(graphical){
    return Math.floor(this.getHeight()/2);
  }

  this.attachGraphical = function(graphical){
    var newX = 0, newY = 0;
    if(_prefSnapY){
      var idealY = this.getY() + this.getAutoSnapY(graphical);
      newY = idealY-(graphical.getY()+Math.floor(graphical.getHeight()/2));
    }

    if(_prefSnapX){
      var idealX = this.getX() + this.getAutoSnapX(graphical);
      newX = idealX-(graphical.getX()+Math.floor(graphical.getWidth()/2));
    }
	  graphical.move(newX,newY);
    
    if(graphical.onSnap) graphical.onSnap(this);
    this.getLayer().getBottomLayer().repaint();
  }

  this.doEnlarge = function(){};
  this.doReduce = function(){};

  this.setOwner = function(owner){ _owner = owner; };
  this.getOwner = function(){ return _owner; };

  this.draw = function(context){
    context.beginPath();
    context.rect(
      this.getX(),
      this.getY(),
      this.getWidth(),
      this.getHeight()
    );
    if(_fixedFill || _fill){
      context.fillStyle = "rgba(255,255,255,0.3)";
      context.fill();
    }
    context.closePath();
  }

  // For all events SnapRegion does not
  // care about, propagate them further
  this.onEvent = function(e, callback){
    // If event does not already bubble
    // propagate the the previous layer
    if(!e.bubble){
      if(this.getLayer().getPreviousLayer() != null){
        this.getLayer().getPreviousLayer().onEvent(e, callback)
      }
    }
  }

  this.onDragOver = function(e){
    if(e.draggedObject != this){
      this.setFill(true);
      e.draggedObject.onDraggedOver(this);
      e.bubble = false;
    }
  }

  this.onDragOut = function(e){
    this.setFill(false);
  }

  this.onDrop = function(e){
    this.setFill(false);
    this.attachGraphical(e.draggedObject);
  }

  this.export = function(){
    var ex =_parent.export.call(this);
    ex.owner = this.getOwner();
    return ex;
  }
}
