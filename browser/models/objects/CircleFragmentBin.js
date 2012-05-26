function CircleFragmentBin(maxWidth, prevBin){
  var _self = inherit(this, new LinkedBin(-1, prevBin));
  var _parent = _self._parent;

  // Total used width;
  var _width = 0;

  this.addElement = function(key, elem){
    if( _width + elem.getWidth() <= maxWidth ){
      return _parent.addElement(key, elem);
    }else{
      return false;
    }
  }
}
