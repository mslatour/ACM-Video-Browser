function CircleFragment(origin, fragment, isolines, min, max, offset){
  var delta = Math.floor((max-min)/(isolines.length-1));
  var bins = {};
  var width, radius;
  // Create bins
  for(var i = 0; i < isolines.length; i++){
    radius = min+(i*delta);
    width = radius*2*Math.PI*fragment - offset;
    if(i == 0){
      bins[isolines[i]] = {
        "bin" : new CircleFragmentBin(width, offset),
        "lm" : new CircleFitting(offset, fragment,  min+(i*delta))
      }
    }else{
      bins[isolines[i]] = {
        "bin" : new CircleFragmentBin(width, offset, bins[isolines[i-1]].bin),
        "lm" : new CircleFitting(offset, fragment,  min+(i*delta))
      }
    }
  }

  this.getPointOnIsoline = function(isoline, angle){
    return new GraphicalCoordinate(
      origin.getX() + radius * Math.cos(angle),
      origin.getY() + radius * Math.sin(angle)
    );
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

  this.layout = function(angle){
    for(var isoline in bins){
      bins[isoline].lm.removeAll();
      bins[isoline].lm.addCollection(bins[isoline].bin, false, true);
      bins[isoline].lm.layout(origin, angle);
    }
  }
}
