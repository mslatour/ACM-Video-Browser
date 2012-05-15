function inherit(_self, _parent, parentKey){
  if ( parentKey == undefined ) parentKey = "_parent";
  _self[parentKey] = new Object();
  for(var key in _parent){
    if(_self[key] == undefined){
      _self[key] = _parent[key];
    }
    _self[parentKey][key] = _parent[key];
  }
  return _self;
}
