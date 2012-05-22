/**
 * ACMVideo object
 *
 * data - Associcative array containing information about the video.
 *        This information consists of:
 *          * id
 *          * year
 *          * screenshot (path)
 **/
function ACMVideo(data){
  var _self = inherit(this, new ImageShape(data.screenshot));
  var _parent = _self._parent;
  this.className = "ACMVideo";

  var _video_id = data.video_id;
  var _screenshot = data.screenshot;
  var _year = data.year;

  this.getId = this.getVideoId = function(){ return _video_id; };
  this.getYear = function(){ return _year; };

  this.getScreenshot = function(){ return _screenshot; };
  this.setScreenshot = function(screenshot){
    _screenshot = screenshot;
  };

  this.draw = function(context){
    _parent.draw(context);
  }
}
