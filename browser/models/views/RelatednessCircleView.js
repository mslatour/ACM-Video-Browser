function RelatednessCircleView(app){
  var _self = inherit(this, new View(app));
  var _parent = _self._parent;

  var _frags = {};

  var _origin = null;
  this.getOrigin = function(){ return _origin; };
  this.setOrigin = function(origin){ _origin = origin; };

  this.load = function(video_id){
    var layer = this.getApplication().getFloorLayer();
    var video_layer = new Layer(app, layer);

    var api = new APIConnection();

    var video_collection = new Collection();

    var video_data = JSON.parse(api.getVideoDetails(video_id, false));
    var origin =  new ACMVideo({
      "video_id": video_data.id,
      "screenshot": "../"+video_data.key_frame,
      "title": video_data.title,
      "authors": video_data.authors,
      "year": video_data.year,
      "score": video_data.score,
      "keywords": video_data.keywords,
      "terms": video_data.terms,
      "categories": video_data.categories
    });

    origin.onMouseOver = function(){};
    origin.onMouseOut = function(){};

    video_layer.add(origin);
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
    
    var outer_circle = new Arc(224, 0, 2*Math.PI, "#0F89BC", 3)
    outer_circle.move(origin.getX(), origin.getY());
    layer.add(outer_circle);
    var inner_circle1 = new Arc(50, 0, 2*Math.PI, "#0F89BC", 1)
    inner_circle1.move(origin.getX(), origin.getY());
    layer.add(inner_circle1);
    var inner_circle1 = new Arc(115, 0, 2*Math.PI, "#0F89BC", 1)
    inner_circle1.move(origin.getX(), origin.getY());
    layer.add(inner_circle1);
    var inner_circle1 = new Arc(180, 0, 2*Math.PI, "#0F89BC", 1)
    inner_circle1.move(origin.getX(), origin.getY());
    layer.add(inner_circle1);
    
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
        180,
        5
      );
      for(var i = 0; i < data[time].members.length; i++){
        video = new ACMVideo({
          "video_id": data[time].members[i].id,
          "screenshot": "../"+data[time].members[i].key_frame,
          "title": data[time].members[i].title,
          "authors": data[time].members[i].authors,
          "score": data[time].members[i].score,
          "keywords": data[time].members[i].keywords,
          "terms": data[time].members[i].terms,
          "categories": data[time].members[i].categories
        });
        video_collection.addElement(video.getId(), video);
        video.scaleToBox(50,50);
        video_layer.add(video);
        _frags[time].addElement(video.getId(), video);
      }
      line_point = _frags[time].getPointOnIsoline(3*max/4, offsetAngle, 45);
      text_point = _frags[time].getPointOnIsoline(
        3*max/4,
        offsetAngle + (Math.PI*(data[time].members.length/num)),
        50
      );
      layer.add(new Line(
        origin_point,
        line_point,
        "#0F89BC",
        2
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
    return video_collection;
  }
}
