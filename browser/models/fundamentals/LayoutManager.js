function LayoutManager(){
  var _self = inherit(this, new Observable());
  var _parent = _self._parent;
  this.className = "LayoutManager";

  var elements = {};

  this.addElement = function(id, element, rotate){
    if(rotate == undefined) rotate = false;
    this.addElementStruct(id, {
      "element": element,
      "rotate": rotate
    });
  }

  this.addElementStruct = function(id, struct){
    elements[id] = struct;
  }

  this.addCollection = function(collection, rotate){
    for(var key in collection.getRawCollection()){
      this.addElement(key, collection.getElement(key), rotate);
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

  this.layoutElement = function(id, newX, newY, newRot){
    var elements = this.getElements();
    if (
      elements[id].element.getX() != newX ||
      elements[id].element.getY() != newY
    ){
      elements[id].element.move(newX, newY);
      if(
        newRot != undefined && 
        elements[id].rotate &&
        elements[id].element.getRotation() != newRot
      ){
        elements[id].element.rotate(newRot);
      }
    }
  }
}
