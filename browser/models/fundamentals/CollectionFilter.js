function CollectionFilter(collection){
  var _filters = new Array();

  this.addFilter = function(collection){
    _filters[_filters.length] = collection;
  }

  this.removeFilter = function(collection){
    var filters = new Array();
    var j = 0;
    for(var i = 0; i < _filters.length; i++){
      if(_filters[i] != collection)
        filters[j++] = _filters[i];
    }
    _filters = filters;
  }

  this.mergeFilters = function(){
    var merged = new Collection();
    for(var i = 0; i < _filters.length; i++){
      _filters[i].forall(function(key, elem){
        if(!merged.hasElement(key)) merged.addElement(key, elem);
      });
    }
    return merged;
  }

  this.filter = function(){
    if( _filters.length > 0){
      var coll = this.mergeFilters();
      collection.forall(function(key, elem){ elem.hide(); });
      coll.forall(function(key, elem){ elem.show(); });
    }else{
      collection.forall(function(key, elem){ elem.show(); });
    }
  }
}
