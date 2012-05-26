function inherit(_self, _parent, parentKey){
  if ( parentKey == undefined ) parentKey = "_parent";
  _self[parentKey] = new Object();
  for(var key in _parent){
    if(_self[key] == undefined){
      if(typeof _parent[key] == "function"){
        _self[key] = inherit_func( _parent[key]);
        _parent[key] = inherit_func( _parent[key]);
      }else{
        _self[key] = _parent[key];
      }
    }
    _self[parentKey][key] = _parent[key];
  }
  return _self;
}
        
function inherit_func(pfunc){ 
  var func = function(){
    if(func.arguments == null || func.arguments.length == 0){
      return pfunc.apply(this, []); 
    }else{
      return pfunc.apply(this, func.arguments); 
    }
  }
  return func;
}
