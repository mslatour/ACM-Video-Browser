function LinkedBin(max, prevBin){
  var _self = inherit(this, new Bin(max));
  var _parent = _self._parent;

  var _prev = null;
  var _next = null;

  this.getPrevBin = function(){ return _prev; };
  this.setPrevBin = function(prev){
    _prev = prev;
    _prev.setNextBin(this);
  };
  this.getNextBin = function(){ return _next; };
  this.setNextBin = function(next){ _next = next; };
  
  if(prevBin != undefined) this.setPrevBin(prevBin);

  this.addElement = function(key, elem){
    if(! _parent.addElement(key, elem) ){
      if( this.getNextBin() != null ){
        if(! this.getNextBin().addElement(key, elem) ){
          if( this.getPrevBin() != null ){
            return this.getPrevBin().addElement(key, elem);
          }else{
            return false;
          }
        }else{
          return true;
        }
      }else if( this.getPrevBin() != null){
        return this.getPrevBin().addElement(key, elem);
      }else{
        return false;
      }
    }else{
      return true;
    }
  }
}
