/**
 *      ACM Browser App
 * = Main application file =
 *
 *  - Contains API methods for the canvas element
 *  - Initialises native event listeners
 *  - Begin of the event handling chain
 *  - Contains the 'run' method
 **/

function ACMBrowserApp(canvas){
  /**
   * Local placeholder for self reference
   * that will not be overriden inside 
   * inline functions and objects
   **/
  var _ref = this;

  // References to canvas and its context
  this.canvas = canvas;
  this.context = canvas.getContext("2d");

  // Reference to mouse event handler
  var _mouse = null;

  /**
   * Reference to the lowest layer.
   * Layers are implemented as a linked-list and
   * the floor layer is the first element in that chain
   **/
  var _floor = new Layer(this, null);
  
  this.getFloorLayer = function(){ return _floor };
  this.setFloorLayer = function(floor){ _floor = floor; };

  this.getCanvas = function(){ return this.canvas; };
  this.setCanvas = function(canvas){ this.canvas = canvas };
  this.getContext = function(){ return this.context; };

  this.getHeight = function(){ return this.getCanvas().height; };
  this.getWidth = function(){ return this.getCanvas().width; };

  // Load mouse event helper
  this.initMouse = function(){
    _mouse = new Mouse(this.getCanvas());
  };
  this.getMouse = function(){ return _mouse; };
  
  // Init native event listeners
  this.addListeners = function(){
    this.getMouse().listen("onMouseDown", function(e){
      _ref.onEvent(e,"onMouseDown")
    });
    this.getMouse().listen("onMouseUp", function(e){
      _ref.onEvent(e,"onMouseUp")
    });
    this.getMouse().listen("onMouseOut", function(e){
      _ref.onEvent(e,"onMouseOut")
    });
    this.getMouse().listen("onMouseMove", function(e){
      _ref.onEvent(e,"onMouseMove")
    });
    this.getMouse().listen("onMouseClick", function(e){
      _ref.onEvent(e,"onMouseClick")
    });
  }

  // Handle raw event and propagate to layers
  this.onEvent = function(e, callback){
    var x;
    var y;
    if (e.pageX || e.pageY) { 
      x = e.pageX;
      y = e.pageY;
    }
    else { 
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
    } 
    x -= this.canvas.offsetLeft;
    y -= this.canvas.offsetTop;
    e.canvasX = x;
    e.canvasY = y;

    this.getFloorLayer().getTopLayer().onEvent(e, callback);
    this.getFloorLayer().paint(this.getContext());
  }

  var _videoCollection = new Collection();
  this.getVideoCollection = function(){ return _videoCollection; };

  /**
   * Main run method
   * 
   * boolean static - Whether event handling is activated
   **/
  this.run = function(static){
    if(!static){
      this.initMouse();
      this.addListeners();
    }
   
    this.drawScene6();

    // Paint application
    this.getFloorLayer().paint(this.getContext());
  }

  this.drawScene1 = function(){
    var video_layer = new Layer(this, this.getFloorLayer());

    // Draw spiral
    var spiral = new Spiral(150, 0.1, 15, 0.08);
    this.getFloorLayer().add(spiral);

    // Create obj1
    var obj1 = new FilledRectangle('white', 'black', 1);
    spiral.addElement(1,obj1, false);
    video_layer.add(obj1);
    // Create obj2
    var obj2 = new FilledRectangle('white', 'black', 1);
    spiral.addElement(2,obj2, false);
    video_layer.add(obj2);
    // Create obj3
    var obj3 = new FilledRectangle('white', 'black', 1);
    spiral.addElement(3,obj3, false);
    video_layer.add(obj3);
    // Create obj4
    var obj4 = new FilledRectangle('white', 'black', 1);
    spiral.addElement(4,obj4, false);
    video_layer.add(obj4);
    
    spiral.layout();
  }

  this.drawScene2 = function(){
    // Create obj1
    var obj1 = new FilledRectangle('white', 'black', 1);
    obj1.setWidth(50);
    obj1.setHeight(50);
    obj1.move(30,40);

    // Create obj2
    var obj2 = new FilledRectangle('white', 'black', 1);
    obj2.move(80,100);

    // Create connection
    var conn = new Connection(obj1, obj2);
    
    // Add to layer
    this.getFloorLayer().add(conn);
    this.getFloorLayer().add(obj1);
    this.getFloorLayer().add(obj2);
  };

  this.drawScene3 = function(){
    // Create obj1
    var obj1 = new ACMVideo({
      video_id:1, 
      screenshot: "http://localhost/acm-data/acm-video-pages/dvs/images/videos2002/01kaufmann.jpg",
      year: 2002
    });
    obj1.scaleToBox(100,100, false);
    obj1.move(30,40);

    // Create obj2
    var obj2 = new ACMVideo({
      video_id:2,
      screenshot: "http://localhost/acm-data/acm-video-pages/dvs/images/videos1994/knightly.jpg",
      year: 1994
    });
    obj2.scaleToBox(100,100, false);
    obj2.move(180,120);

    // Create connection
    var conn = new Connection(obj1, obj2);
    
    // Add to layer
    this.getFloorLayer().add(conn);
    this.getFloorLayer().add(obj1);
    this.getFloorLayer().add(obj2);
  };

  this.drawScene4 = function(){
    var floor_layer = this.getFloorLayer();
    var connection_layer = new Layer(this, floor_layer);
    var video_layer = new Layer(this, connection_layer);

    // Create white background
    var bg = new FilledRectangle("white","white",1);
    bg.setWidth(floor_layer.getApplication().getWidth());
    bg.setHeight(floor_layer.getApplication().getHeight());
    floor_layer.add(bg);

    // Create loader
    var loader = new ImageShape(
      "http://jimpunk.net/Loading/wp-content/uploads/loading1.gif"
    );
    video_layer.add(loader);
    loader.moveToCenter();
    floor_layer.paint(this.getContext());

    var video_collection = this.getVideoCollection();

    fetchVideos(function(data){
      var videos = data['videos'];
      var video;
      for(var i = 0; i < videos.length; i++){
        video = new ACMVideo({
          video_id: videos[i].video_id, 
          screenshot: videos[i].screenshot,
          year: videos[i].year
        });
        video_collection.addElement(videos[i].video_id, video);
        video.move(i*i*6,i*30);
        video_layer.add(video);
      }
      video_layer.remove(loader);
      floor_layer.repaint();
    });
  }
  
  this.drawScene5 = function(){
    var floor_layer = this.getFloorLayer();
    var connection_layer = new Layer(this, floor_layer);
    var video_layer = new Layer(this, connection_layer);
    
    // Draw spiral
    var spiral = new Spiral(150, 0.1, 15, 0.08);
    floor_layer.add(spiral);

    // Create loader
    var loader = new ImageShape(
      "http://jimpunk.net/Loading/wp-content/uploads/loading1.gif"
    );
    video_layer.add(loader);
    loader.moveToCenter();
    floor_layer.paint(this.getContext());

    var video_collection = this.getVideoCollection();

    fetchVideos(function(data){
      var videos = data['videos'];
      var video;
      for(var i = 0; i < videos.length; i++){
        video = new ACMVideo({
          video_id: videos[i].video_id, 
          screenshot: videos[i].screenshot,
          year: videos[i].year
        });
        video_collection.addElement(videos[i].video_id, video);
        video_layer.add(video);
      }
      spiral.addCollection(video_collection, false);
      spiral.layout();
      video_layer.remove(loader);
      floor_layer.repaint();
    });
  }
  
  this.drawScene6 = function(){
    var floor_layer = this.getFloorLayer();
    
    var centerX = Math.floor(this.getWidth()/2);
    var centerY = Math.floor(this.getHeight()/2);

    var centerPoint = new GraphicalCoordinate(centerX, centerY);

    // Draw spiral
    var spiral = new Spiral(150, 70, 0.1, 15, 0.08);
    spiral.move(centerX, centerY-30);
    floor_layer.add(spiral);

    // Create origin
    var origin = new FilledRectangle('red', 'black', 1);
    floor_layer.add(origin);
    spiral.addElement(1,origin, true);
    
    // Create origin2
    var origin2 = new FilledRectangle('red', 'black', 1);
    floor_layer.add(origin2);
    spiral.addElement(2, origin2, true);
    
    // Create origin3
    var origin3 = new FilledRectangle('red', 'black', 1);
    floor_layer.add(origin3);
    spiral.addElement(3, origin3, true);
    
    spiral.layout();

    var lm = new CircleFitting(5, 0.25);
    var lm2 = new CircleFitting(5, 0.25);
    var lm3 = new CircleFitting(5, 0.25);

    var i, obj;

    // Create objects for origin
    for(i = 0; i < 5; i++){
      obj = new FilledRectangle('white', 'black', 1);
      lm.addElement(i,obj, false);
      floor_layer.add(obj);
      floor_layer.add(new Connection(obj, origin));
    }
    lm.layout(origin, Math.PI + origin.getRotation());
    
    // Create objects for origin2
    for(i = 0; i < 3; i++){
      obj = new FilledRectangle('white', 'black', 1);
      lm2.addElement(i,obj, false);
      floor_layer.add(obj);
      floor_layer.add(new Connection(obj, origin2));
    }
    lm2.layout(origin2, Math.PI + origin2.getRotation());
    
    // Create objects for origin3
    for(i = 0; i < 2; i++){
      obj = new FilledRectangle('white', 'black', 1);
      lm3.addElement(i,obj, false);
      floor_layer.add(obj);
      floor_layer.add(new Connection(obj, origin3));
    }
    lm3.layout(origin3, Math.PI + origin3.getRotation());
  }
}
