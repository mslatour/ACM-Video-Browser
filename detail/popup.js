/***************************/
//@Author: Adrian "yEnS" Mato Gondelle
//@website: www.yensdesign.com
//@email: yensamg@gmail.com
//@license: Feel free to use it, but keep this credits please!					
/***************************/

//SETTING UP OUR POPUP
//0 means disabled; 1 means enabled;
var popupStatus = 0;

//loading popup with jQuery magic!
function loadPopup(id){
  //loads popup only if it is disabled
  if(popupStatus==0){
    $("#backgroundPopup").css({
      "opacity": "0.7"
    });
    $("#backgroundPopup").fadeIn("slow");
    $("#popupContact").fadeIn("slow");

    popupStatus = 1;

    var App = new ACMBrowserApp(
      document.getElementById("canvas")
    );
    App.run();
    var view = new RelatednessCircleView(App);
    var videos = view.load(id);
    init_popup_event_listeners(videos);
	}else{
    var App = new ACMBrowserApp(
      document.getElementById("canvas")
    );
    App.run();
    var view = new RelatednessCircleView(App);
    var videos = view.load(id);
    init_popup_event_listeners(videos);
  }
}

function init_popup_event_listeners(video_collection){
  var filter = new CollectionFilter(video_collection);
  // Authors
  $(".author_label").each(function(key, item){
    // Find subset of videos that don't contain author
    var author = item.id.split("author_")[1];
    var subset = video_collection.findall(
      function(key, video){
        var authors = video.getAuthors();
        for(var i = 0; i < authors.length; i++){
          if(authors[i].toLowerCase().replace(" ","_") == author ){
            return true;
          }
        }
        return false;
      }
    );
    var select_author_func = function(){
      item.style.color = "#1288B8";
      if(video_collection.getSize() > 0){
        filter.addFilter(subset);
        filter.filter();
        video_collection.firstElement().getLayer().repaint();
      }
      $(item).click(deselect_author_func);
    }
    var deselect_author_func = function(){
      item.style.color = "black";
      if(video_collection.getSize() > 0){
        filter.removeFilter(subset);
        filter.filter();
        video_collection.firstElement().getLayer().repaint();
      }
      $(item).click(select_author_func);
    }
    $(item).click(select_author_func);
    item.style.cursor = "pointer";
  });
  // Categories
  $(".category_label").each(function(key, item){
    // Find subset of videos that don't contain category
    var category = item.id.split("category_")[1];
    var subset = video_collection.findall(
      function(key, video){
        var categories = video.getCategories();
        for(var i = 0; i < categories.length; i++){
          if(categories[i] == category ) return true;
        }
        return false;
      }
    );
    var select_category_func = function(){
      item.style.color = "#1288B8";
      if(video_collection.getSize() > 0){
        filter.addFilter(subset);
        filter.filter();
        video_collection.firstElement().getLayer().repaint();
      }
      $(item).click(deselect_category_func);
    }
    var deselect_category_func = function(){
      item.style.color = "black";
      if(video_collection.getSize() > 0){
        filter.removeFilter(subset);
        filter.filter();
        video_collection.firstElement().getLayer().repaint();
      }
      $(item).click(select_category_func);
    }
    $(item).click(select_category_func);
    item.style.cursor = "pointer";
  });
  // Keywords
  $(".keyword_label").each(function(key, item){
    // Find subset of videos that don't contain category
    var keyword = item.id.split("keyword_")[1];
    var subset = video_collection.findall(
      function(key, video){
        var keywords = video.getKeywords();
        for(var i = 0; i < keywords.length; i++){
          if(keywords[i].toLowerCase().replace(" ","_") == keyword ){
            return true;
          }
        }
        return false;
      }
    );
    var select_keyword_func = function(){
      item.style.color = "#1288B8";
      if(video_collection.getSize() > 0){
        filter.addFilter(subset);
        filter.filter();
        video_collection.firstElement().getLayer().repaint();
      }
      $(item).click(deselect_keyword_func);
    }
    var deselect_keyword_func = function(){
      item.style.color = "black";
      if(video_collection.getSize() > 0){
        filter.removeFilter(subset);
        filter.filter();
        video_collection.firstElement().getLayer().repaint();
      }
      $(item).click(select_keyword_func);
    }
    $(item).click(select_keyword_func);
    item.style.cursor = "pointer";
  });
  // Terms
  $(".term_label").each(function(key, item){
    // Find subset of videos that don't contain category
    var term = item.id.split("term_")[1];
    var subset = video_collection.findall(
      function(key, video){
        var terms = video.getTerms();
        for(var i = 0; i < terms.length; i++){
          if(terms[i].toLowerCase().replace(" ","_") == term ){
            return true;
          }
        }
        return false;
      }
    );
    var select_term_func = function(){
      item.style.color = "#1288B8";
      if(video_collection.getSize() > 0){
        filter.addFilter(subset);
        filter.filter();
        video_collection.firstElement().getLayer().repaint();
      }
      $(item).click(deselect_term_func);
    }
    var deselect_term_func = function(){
      item.style.color = "black";
      if(video_collection.getSize() > 0){
        filter.removeFilter(subset);
        filter.filter();
        video_collection.firstElement().getLayer().repaint();
      }
      $(item).click(select_term_func);
    }
    $(item).click(select_term_func);
    item.style.cursor = "pointer";
  });
}

//disabling popup with jQuery magic!
function disablePopup(){
	//disables popup only if it is enabled
	if(popupStatus==1){
		$("#backgroundPopup").fadeOut("slow");
		$("#popupContact").fadeOut("slow");
		popupStatus = 0;
	}
}

//centering popup
function centerPopup(){
	//request data for centering
	var windowWidth = document.documentElement.clientWidth;
	var windowHeight = document.documentElement.clientHeight;
	var popupHeight = $("#popupContact").height();
	var popupWidth = $("#popupContact").width();
	//centering
	$("#popupContact").css({
		"position": "absolute",
		"top": windowHeight/2-popupHeight/2,
		"left": windowWidth/2-popupWidth/2
	});
	//only need force for IE6
	
	$("#backgroundPopup").css({
		"height": windowHeight
	});
	
}

