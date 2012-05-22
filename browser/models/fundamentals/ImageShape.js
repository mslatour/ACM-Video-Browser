function ImageShape(imgOrSrc){
  var _self = inherit(this, new Graphical());
  var _parent = _self._parent;
  this.className = "ImageShape";
 
  var _img = null;

  this.toDebugString = function(){
    return "["+_parent.toDebugString.call(this)+"] "+this.getImage().src;
  }

  this.getImage = function(){ return _img; }
  this.setImage = function(img){
    _img = img;
    this.setWidth(_img.width);
    this.setHeight(_img.height);
  }
  this.setImageBySource = function(imgSrc){
    _img = new Image();
    _img.src = imgSrc;
    this.setWidth(_img.width);
    this.setHeight(_img.height);
  }

  this.scale = function(scale){
    _parent.scale(scale);
    this.setHeight(this.getHeight()*scale);
    this.setWidth(this.getWidth()*scale);
  }
  
  // Use setter to load image
  if(typeof imgOrSrc == "string")
    this.setImageBySource(imgOrSrc);
  else
    this.setImage(imgOrSrc);

  /**
   * @overide Shape.draw
   **/
  this.draw = function(context){
    _parent.draw(context);
    context.drawImage(
      this.getImage(),
      0,
      0,
      this.getWidth(),
      this.getHeight()
    );
  }
}
