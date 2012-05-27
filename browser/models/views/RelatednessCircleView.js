function RelatednessCircleView(app){
  var _self = inherit(this, new View(app));
  var _parent = _self._parent;

  this.load = function(){
    var floor_layer = this.getApplication().getFloorLayer();
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "../api/videos.php?id="+this.getOrigin().getId(), true);
    
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4){
        if(xhr.status == 200) {
          this.addRelatedVideos(floor_layer, JSON.parse(xhr.responseText));
        }else{
          //What to do..
        }
      }
    }
    xhr.send(null);
    
  }
  
  this.addRelatedVideos = function(layer, data){
    for(var time in data){
      
    }
  }
}
