function CircleFragment(origin, fragment, isolines, min, max){
  var delta = Math.floor((max-min)/isolines.length);
  var bins = {};
  var width, radius, offset = 5;
  // Create bins
  for(var i = 0; i < isolines.length; i++){
    radius = min+(i*delta);
    width = radius*2*Math.PI*fragment;
    if(i == 0){
      bins[isolines[i]] = {
        "bin" : new CircleFragmentBin(width),
        "lm" : new CircleFitting(offset, fragment,  min+(i*delta))
      }
    }else{
      bins[isolines[i]] = {
        "bin" : new CircleFragmentBin(width, bins[isolines[i-1]].bin),
        "lm" : new CircleFitting(offset, fragment,  min+(i*delta))
      }
    }
  }

  this.addElement = function(key, elem){
    var dist, ldist = -1;
    var lbin;
    for(var i = 0; i < isolines.length; i++){
      dist = Math.abs(isolines[i]-elem.getRelevanceScore());
      if(ldist == -1 || ldist > dist){
        ldist = dist;
        lbin = bins[isolines[i]].bin;
      }
    }
    lbin.addElement(key, elem);
  }

  this.layout = function(){
    for(var isoline in bins){
      bins[isoline].lm.layout(origin, 0);
    }
  }
}
