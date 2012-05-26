function LayoutManager(){
  var _self = inherit(this, new Observable());
  var _parent = _self._parent;
  this.className = "LayoutManager";

  var elements = {};

  this.addElement = function(id, element, rotate, centered){
    if(rotate == undefined) rotate = false;
    if(centered == undefined) centered = true;
    this.addElementStruct(id, {
      "element": element,
      "rotate": rotate,
      "centered": centered
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

  this.removeAll = function(){
    elements = {};
  }

  this.setElements = function(elems){
    elements = elems;
  }

  this.layout = function(){
  };

  this.layoutElement = function(id, newX, newY, newRot){
    var elements = this.getElements();
    if(elements[id].centered){
      newX -= (elements[id].element.getWidth()/2);
      newY -= (elements[id].element.getHeight()/2);
    }
    if(
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
