function View1(app){
  var _self = inherit(this, new View(app));
  var _parent = _self._parent;

  var _years = new Collection();
  
  this.createYear = function(year){
    return {
      "origin" : new Text(  
        year,
        "red", 
        {
          "font-variant": "small-caps",
          "font-weight": "bold",
          "font-size": "16px"
        }
      ),
      "lm" : new CircleFitting(5, 0.25)
    }
  }

  this.findOrCreateYear = function(year){
    if(!_years.hasElement(year)){
      _years.addElement(year, this.createYear(year));
    }
    return _years.getElement(year);
  }

  this.load = function(){
    var floor_layer = this.getApplication().getFloorLayer();
    var connection_layer = new Layer(this.getApplication(), floor_layer);
    var video_layer = new Layer(this.getApplication(), connection_layer);

    var centerX = Math.floor(this.getApplication().getWidth()/2);
    var centerY = Math.floor(this.getApplication().getHeight()/2);
    var centerPoint = new GraphicalCoordinate(centerX, centerY);

    // Draw spiral
    var spiral = new Spiral(150, 70, 0.1, 15, 0.08);
    spiral.move(centerX, centerY-30);
    floor_layer.add(spiral);
    
    fetchVideos(function(data){
      var videos = data['videos'];
      var video, year;
      for(var i = 0; i < videos.length; i++){
        video = new ACMVideo({
          video_id: videos[i].video_id, 
          screenshot: videos[i].screenshot,
          year: videos[i].year
        });
        year = _self.findOrCreateYear(video.getYear());
        floor_layer.add(year.origin);
        floor_layer.add(new Connection(video, year.origin));
        year.lm.addElement(video.getId(), video, false);
        video.scaleToBox(50,50,true);
        video_layer.add(video);
      }
      _years.forall(function(key, elem){
        spiral.addElement(key, elem.origin, true);
      });
      spiral.layout();
      _years.forall(function(key, elem){
        elem.lm.layout(elem.origin, Math.PI + elem.origin.getRotation() );
      });
      floor_layer.repaint();
    });
   
    // Paint application
    floor_layer.paint(this.getApplication().getContext());
  }
}
