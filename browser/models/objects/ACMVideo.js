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
  var _title = data.title;
  var _authors = (data.authors != undefined ? data.authors : new Array() ); 
  var _year = data.year;
  var _score = data.score;
  var _keywords = (data.keywords != undefined ? data.keywords : new Array() ); 
  var _categories = (data.categories != undefined ? data.categories : new Array() );
  var _terms = (data.terms != undefined ? data.terms : new Array() );

  this.getId = this.getVideoId = function(){ return _video_id; };
  this.getTitle = function(){ return _title; };
  this.getAuthors = function(){ return _authors; };
  this.getYear = function(){ return _year; };
  this.getKeywords = function(){ return _keywords; };
  this.getCategories = function(){ return _categories; };
  this.getTerms = function(){ return _terms; };

  this.getScreenshot = function(){ return _screenshot; };
  this.setScreenshot = function(screenshot){
    _screenshot = screenshot;
  };

  this.onMouseOver = function(e){
    // Set title
    document.getElementById("related_title").innerHTML = this.getTitle();
    // Highlight related
    var elem;
    var authors = this.getAuthors();
    for(var i = 0; i < authors.length; i++){
      elem = document.getElementById(
        "author_"+authors[i].toLowerCase().replace(" ","_")
      );
      if(elem){
        elem.style.fontWeight = 'bold';
      }else{
        //alert("author_"+authors[i].toLowerCase().replace(" ","_")+" does not exist!");
      }
    }
    var keywords = this.getKeywords();
    for(var i = 0; i < keywords.length; i++){
      elem = document.getElementById(
        "keyword_"+keywords[i].toLowerCase().replace(" ","_")
      );
      if(elem){
        elem.style.fontWeight = 'bold';
      }else{
        //alert("keyword_"+keywords[i].toLowerCase().replace(" ","_")+" does not exist!");
      }
    }
    var categories = this.getCategories();
    for(var i = 0; i < categories.length; i++){
      elem = document.getElementById(
        "category_"+categories[i].toLowerCase().replace(" ","_")
      )
      if(elem){
        elem.style.fontWeight = 'bold';
      }else{
        //alert("category_"+categories[i].toLowerCase().replace(" ","_")+" does not exist!");
      }
    }
    var terms = this.getTerms();
    for(var i = 0; i < terms.length; i++){
      elem = document.getElementById(
        "term_"+terms[i].toLowerCase().replace(" ","_")
      )
      if(elem){
        elem.style.fontWeight = 'bold';
      }else{
        //alert("term_"+terms[i].toLowerCase().replace(" ","_")+" does not exist!");
      }
    }
  }
  
  this.onMouseOut = function(e){
    // Remove title
    document.getElementById("related_title").innerHTML = "";
    // Remove related highlights
    var elem;
    var authors = this.getAuthors();
    for(var i = 0; i < authors.length; i++){
      elem = document.getElementById(
        "author_"+authors[i].toLowerCase().replace(" ","_")
      );
      if(elem){
        elem.style.fontWeight = 'normal';
      }else{
        //alert("author_"+authors[i].toLowerCase().replace(" ","_")+" does not exist!");
      }
    }
    var keywords = this.getKeywords();
    for(var i = 0; i < keywords.length; i++){
      elem = document.getElementById(
        "keyword_"+keywords[i].toLowerCase().replace(" ","_")
      );
      if(elem){
        elem.style.fontWeight = 'normal';
      }else{
        //alert("keyword_"+keywords[i].toLowerCase().replace(" ","_")+" does not exist!");
      }
    }
    var categories = this.getCategories();
    for(var i = 0; i < categories.length; i++){
      elem = document.getElementById(
        "category_"+categories[i].toLowerCase().replace(" ","_")
      )
      if(elem){
        elem.style.fontWeight = 'normal';
      }else{
        //alert("category_"+categories[i].toLowerCase().replace(" ","_")+" does not exist!");
      }
    }
    var terms = this.getTerms();
    for(var i = 0; i < terms.length; i++){
      elem = document.getElementById(
        "term_"+terms[i].toLowerCase().replace(" ","_")
      )
      if(elem){
        elem.style.fontWeight = 'normal';
      }else{
        //alert("term_"+terms[i].toLowerCase().replace(" ","_")+" does not exist!");
      }
    }
  }

  this.onMouseDown = function(e){
    var id = this.getId();
    disablePopup();
    $.ajax({
      url: 'timeline-relatedvideos.php',
      type: 'post',
      data:{id: id},
      success: function(value){
        $('#popup').html(value);
        //centers popup
        centerPopup();
        //loads popup
        loadPopup(id);
      }
    });
  }

  this.getRelevanceScore = function(){ return _score; }

  this.draw = function(context){
    _parent.draw(context);
  }
}
