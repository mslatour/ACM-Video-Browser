function RelatednessCircleView(app){
  var _self = inherit(this, new View(app));
  var _parent = _self._parent;

  var _frags = {};

  var _origin = null;
  this.getOrigin = function(){ return _origin; };
  this.setOrigin = function(origin){ _origin = origin; };

  this.load = function(video_id){
    var layer = this.getApplication().getFloorLayer();

    var api = new APIConnection();

    var video_data = JSON.parse(api.getVideoDetails(video_id, false));
    var origin =  new ACMVideo({
      "video_id": video_data.id,
      "screenshot": "../"+video_data.key_frame,
      "year": video_data.year,
      "score": video_data.score
    });

    layer.add(origin);
    origin.scaleToBox(30,30);
    origin.moveToCenter();
    this.setOrigin(origin);
    var origin_point = new GraphicalCoordinate(origin.getX(),origin.getY());

    var data = JSON.parse(api.getRelatedVideos(video_id, false));
        
    // Count video elements
    var num = 0;
    var max = 0;
    for(var time in data){
      num += data[time].members.length;
      for(var i = 0; i < data[time].members.length; i++){
        if(data[time].members[i].score > max){
          max = data[time].members[i].score;
        }
      }
    }
    
    var c1 = new Arc(50, 0, 2*Math.PI, "red", 2)
    c1.move(origin.getX(), origin.getY());
    layer.add(c1);
    var c2 = new Arc(140, 0, 2*Math.PI, "blue", 2)
    c2.move(origin.getX(), origin.getY());
    layer.add(c2);
    var c3 = new Arc(230, 0, 2*Math.PI, "yellow", 2)
    c3.move(origin.getX(), origin.getY());
    layer.add(c3);
    
    var video;
    var timelabel;
    var lime_point, text_point;
    var offsetAngle = 0;
    for(var time in data){
      _frags[time] = new CircleFragment(
        this.getOrigin(), 
        (data[time].members.length/num),
        new Array(3*max/4,2*max/4,max/4),
        50, 
        230, 
        5
      );
      for(var i = 0; i < data[time].members.length; i++){
        video = new ACMVideo({
          "video_id": data[time].members[i].id,
          "screenshot": "../"+data[time].members[i].key_frame,
          "year": data[time].members[i].year,
          "score": data[time].members[i].score
        });
        video.scaleToBox(30,30);
        layer.add(video);
        _frags[time].addElement(video.getId(), video);
      }
      line_point = _frags[time].getPointOnIsoline(3*max/4, offsetAngle, 0);
      text_point = _frags[time].getPointOnIsoline(3*max/4, offsetAngle, 5);
      layer.add(new Connection(
        origin_point,
        line_point
      ));
      timelabel = new Text(
        data[time].name_short
      );
      layer.add(timelabel);
      timelabel.move(
        text_point.getX() - (text_point.getX() < origin.getX() ? timelabel.getWidth() : 0 ),
        text_point.getY() - (text_point.getY() < origin.getY() ? 10 : 0 )
      );
      _frags[time].layout(offsetAngle);
      offsetAngle += 2*Math.PI*(data[time].members.length/num);
    }
    
    origin.move(-1*(origin.getWidth()/2), -1*(origin.getHeight()/2));
    layer.paint(this.getApplication().getContext());
  }
}
