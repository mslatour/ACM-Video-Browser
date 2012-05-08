/**
 * GraphicalGroup
 * A group of graphicals that maintains the same distance 
 * between each member. It uses the listen function of the
 * Observable class to stay updated on movements.
 *
 * It stores the location of each member when they are
 * added to the group. When a new location is reached for
 * one of the members, the group calculates the distance
 * to its previous location and moves the other members.
 */

function GraphicalGroup(){
  var _self = inherit(this, new Observable());
  var _parent = _self._parent;
  this.className = "GraphicalGroup";
  
  var _elements = {};

  var _ears = new Object();

  this.add = function(graphical){
    var moveListener;
    var object = this;

    _elements[graphical.getUniqueId()] = graphical;
   
    this.addGroupEar(graphical, "onMove", "onMemberMove");
    this.addGroupEar(graphical, "onReduce", "onMemberReduce");
    this.addGroupEar(graphical, "onEnlarge", "onMemberEnlarge");
    
    graphical.onAddedToGroup(this);
  }

  this.addGroupEar = function(graphical, listen, tell){
    var object = this;
    this.addEar(graphical.listen(listen, function(e){
      e.groupMember = graphical;
      object.muteAll(listen);
      object.tell(tell, e);
      object.unMuteAll(listen);
    }));
  }

  this.addEar = function(ear){
    if(_ears[ear.on]){
      _ears[ear.on][_ears[ear.on].length] = ear;
    }else{
      _ears[ear.on] = [ear];
    }
  }

  this.muteAll = function(on){
    for(var i = 0; i < _ears[on].length; i++){
      _ears[on][i].mute = true;
    }
  }
  
  this.unMuteAll = function(on){
    for(var i = 0; i < _ears[on].length; i++){
      _ears[on][i].mute = false;
    }
  }

  this.export = function(){
    var ex = _parent.export.call(this);
    ex.elems = new Array();
    for(elem in _elements){
      ex.elems.push(elem);
    }
    return ex;
  }

  this.import = function(elemStruct, references){
    _parent.import.call(this, elemStruct, references);
    if(elemStruct.elems){
      for(var i = 0; i < elemStruct.elems.length; i++){
        if(elemStruct.elems[i] in references){
          this.add(references[elemStruct.elems[i]]);
        }
      }
    }
  }
}
