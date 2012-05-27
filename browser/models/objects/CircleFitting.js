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
    var width = offset;
    var num = 0;
    for(var id in elements){
      width += elements[id].element.getWidth() + offset;
      num++;
    }

    if( radius == undefined ){
      radius = Math.ceil(((width / fragment) / (2* Math.PI)));
    }

    var totalWidth = radius*2*Math.PI*fragment;
   
    if(num > 0){
      var increment = (totalWidth - width)/num;
      angle += (increment+2*offset)/radius;
      var x, y, i = 1;
      var startx = origin.getX();
      var starty = origin.getY();
      for (var id in elements){
        x = startx + radius * Math.cos(angle);
        y = starty + radius * Math.sin(angle);
        this.layoutElement(id, x, y);
        angle += (increment+offset+elements[id].element.getWidth())/radius;
        i++;
      }
    }
  }
}
