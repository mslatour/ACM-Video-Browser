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
  var _score = data.score;
  var _keywords = (data.keywords != undefined ? data.keywords : new Array() ); 
  var _categories = (data.categories != undefined ? data.categories : new Array() );
  var _terms = (data.terms != undefined ? data.terms : new Array() );

  this.getId = this.getVideoId = function(){ return _video_id; };
  this.getYear = function(){ return _year; };
  this.getKeywords = function(){ return _keywords; };
  this.getCategories = function(){ return _categories; };
  this.getTerms = function(){ return _terms; };

  this.getScreenshot = function(){ return _screenshot; };
  this.setScreenshot = function(screenshot){
    _screenshot = screenshot;
  };

  this.getRelevanceScore = function(){ return _score; }

  this.draw = function(context){
    _parent.draw(context);
  }
}
