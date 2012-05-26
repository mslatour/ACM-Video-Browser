/**
 * Fit all elements within a portion of a circle.
 *
 * offset - number of pixels between each item
 * fragment - percentage of the circle that the elements need to fit in.
 **/
function CircleFitting(offset, fragment, radius){
  var _self = inherit(this, new LayoutManager());

  this.layout = function(origin, angle){
    var elements = this.getElements();
    if( radius == undefined ){
      var width = 30;
      var num = 0;
      for(var id in elements){
        width += elements[id].element.getWidth() + offset;
        num++;
      }

      radius = Math.ceil(((width / fragment) / (2* Math.PI)));
    }else{
      var num = this.getNumberOfElements();
    }
    angle += fragment*Math.PI;
    var x, y, i = 1;
    var startx = origin.getX();
    var starty = origin.getY();
    var increment = (2*Math.PI*fragment)/(num-1);
    for (var id in elements){
      x = startx + radius * Math.cos(angle);
      y = starty + radius * Math.sin(angle);
      this.layoutElement(id, x, y);
      angle += increment;
      i++;
    }
  }
}
