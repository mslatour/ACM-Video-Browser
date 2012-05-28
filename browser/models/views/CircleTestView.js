function CircleTestView(app){
  var _self = inherit(this, new View(app));
  var _parent = _self._parent;

  this.load = function(){
    var floor_layer = this.getApplication().getFloorLayer();
    
    var origin = new GraphicalCoordinate(300,300);
    floor_layer.add(origin);

    var frag1 = new CircleFragment(origin, 0.33, new Array(5,10,15), 50, 250, 5);
    var frag2 = new CircleFragment(origin, 0.33, new Array(5,10,15), 50, 250, 5);
    var frag3 = new CircleFragment(origin, 0.33, new Array(5,10,15), 50, 250, 5);

    var rect;
    for(var i = 0; i < 7; i++){
      rect = new FilledRectangle('red', 'black',1);
      rect.getRelevanceScore = function(){ return i; };
      floor_layer.add(rect);
      frag1.addElement(i, rect);
    }
    for(var i = 0; i < 15; i++){
      rect = new FilledRectangle('blue', 'black',1);
      rect.getRelevanceScore = function(){ return i+10; };
      floor_layer.add(rect);
      frag2.addElement(i, rect);
    }
    for(var i = 0; i < 15; i++){
      rect = new FilledRectangle('black', 'black',1);
      rect.getRelevanceScore = function(){ return i*2; };
      floor_layer.add(rect);
      frag3.addElement(i, rect);
    }

    var c1 = new Arc(50, 0, 2*Math.PI, "red", 2)
    c1.move(origin.getX(), origin.getY());
    floor_layer.add(c1);
    var c2 = new Arc(150, 0, 2*Math.PI, "blue", 2)
    c2.move(origin.getX(), origin.getY());
    floor_layer.add(c2);
    var c3 = new Arc(250, 0, 2*Math.PI, "yellow", 2)
    c3.move(origin.getX(), origin.getY());
    floor_layer.add(c3);

    frag1.layout(0);
    frag2.layout(2*Math.PI*0.33);
    frag3.layout(2*Math.PI*0.66);
    
    var con1 = new Connection(
      origin,
      frag1.getPointOnIsoline(15, 0)
    );
    var con2 = new Connection(
      origin, 
      frag1.getPointOnIsoline(15, 0.66*Math.PI)
    );
    var con3 = new Connection(
      origin, 
      frag1.getPointOnIsoline(15, 1.32*Math.PI)
    );
    floor_layer.add(con1);
    floor_layer.add(con2);
    floor_layer.add(con3);

    floor_layer.paint(this.getApplication().getContext());
  }
}
