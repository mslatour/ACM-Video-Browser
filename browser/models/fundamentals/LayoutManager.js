function LayoutManager(){
  var _self = inherit(this, new Observable());
  var _parent = _self._parent;
  this.className = "LayoutManager";

  var elements = {};

  this.addElement = function(id, element){
    // Cater for expansion of meta data
    elements[id] = {
      "element": element
    };
  }

  this.addCollection = function(collection){
    for(var key in collection.getRawCollection()){
      this.addElement(key, collection.getElement(key));
    }
  }

  this.getElements = function(){ return elements; }

  this.getNumberOfElements = function(){
    var count = 0;
    for(key in elements){ count++; }
    return count;
  }

  this.removeElement = function(id){
    delete elements[element];
  }

  this.setElements = function(elems){
    elements = elems;
  }

  this.layout = function(){
  };

  this.layoutElement = function(id, newX, newY){
    var elements = this.getElements();
    if (
      elements[id].element.getX() != newX ||
      elements[id].element.getY() != newY
    ){
      elements[id].element.move(newX, newY);
    }
  }
}
