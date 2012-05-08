/**
 * ACMVideo object
 *
 * data - Associcative array containing information about the video.
 *        This information consists of:
 *          * id
 *          * screenshot (path)
 **/
function ACMVideo(video_id, screenshot){
  var _self = inherit(this, new ImageShape(screenshot));
  var _parent = _self._parent;
  this.className = "ACMVideo";

  var _video_id = video_id;
  var _screenshot = screenshot;

  this.getVideoId = function(){ return _video_id; }

  this.getScreenshot = function(){ return _screenshot; }
  this.setScreenshot = function(screenshot){
    _screenshot = screenshot;
  }

  this.draw = function(context){
    _parent.draw(context);
  }
}
