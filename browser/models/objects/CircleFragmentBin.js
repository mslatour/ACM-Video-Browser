function CircleFragmentBin(maxWidth, offset, prevBin){
  var _self = inherit(this, new LinkedBin(-1));
  var _parent = _self._parent;

  if(prevBin != undefined) this.setPrevBin(prevBin);

  // Total used width;
  var _width = 0;

  this.addElement = function(key, elem){
    if( _width + elem.getWidth() + offset <= maxWidth ){
      _width += elem.getWidth() + offset;
      return _parent.addElement(key, elem);
    }else{
      return this.readdElement(key, elem);
    }
  }
}
