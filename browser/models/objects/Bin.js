function Bin(max){
  var _self = inherit(this, new Collection());
  var _parent = _self._parent;

  var _max = max;
  this.getMax = function(){ return _max; };
  this.setMax = function(max){ _max = max; };

  this.addElement = function(key, elem){
    if( this.getMax() == -1 || this.getSize() < this.getMax() ){
      _parent.addElement(key,elem);
    }else{
      return false;
    }
    return true;
  }
}
