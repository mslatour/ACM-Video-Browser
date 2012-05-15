/**
 * Physical manifestation of a coordinate without any visual appearance.
 **/
function GraphicalCoordinate(x, y){
  var _self = inherit(this, new Graphical());

  this.setX(x);
  this.setY(y);
  // More convenient with center calculations
  this.setWidth(2);
  this.setHeight(2);
}
