function Collection(){
  var _elems = {};

  this.addElement = function(key, elem){
    _elems[key] = elem;
  }

  this.removeElement = function(key){
    delete _elems[key];
  }

  this.hasElement = function(key){
    return ( key in _elems );
  }

  this.getElement = function(key){
    return _elems[key];
  }

  this.getRawCollection = function(){
    return _elems;
  }

  this.getSubCollection = function(keys){
    var coll = new Collection();
    for(var i = 0; i < keys.length; i++){
      if( this.hasElement(key) ){
        coll.addElement(this.getElement(keys[i]));
      }
    }
    return coll;
  }

  this.getAllElements = function(){
    var ar = new Array();
    var index = 0;
    for(var key in _elems){
      ar[index++] = _elems[key];
    }
    return ar;
  }
}