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
  _floor.setUniqueId("FloorLayer");
 
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
    this.getFloorLayer().paint(this.getContext());
  };
}
