var MAX_ELEM_COLLAPSED = 8;
var DEFAULT_START_TCAT = 4;
function init_timeline(timeline, navmenu){
  $.ajax({
    url: '../api/videos.php?mode=list&limited=1',
    type: 'get',
    success: function(data){
      var tcats = JSON.parse(data);
      for( var tcat_id in tcats ){
        var tcat = add_tcat(timeline, tcats[tcat_id]);
      }
      resize_timeline();
      init_event_handlers();
    }
  });
}

function resize_timeline(){
  var timeline = $(".tl-events").get()[0];
  var width = 0;
  var tcat;
  for(var i = 0; i < timeline.children.length; i++){
    tcat = timeline.children[i];
    width += parseInt(tcat.offsetWidth + tcat.style.marginLeft)+10;
  }
  if(width > 0){
    $('.tl-events').width(width);
  }
}

function init_expand_trigger(tcat, tcat_id, tcat_nav){
  $(tcat_nav).click(function(){
    expand_tcat(tcat, tcat_id, tcat_nav);
  });
}

function unexpand_tcat(tcat, tcat_id, tcat_nav){
  var content = tcat.getElementsByTagName("div")[0];
  $.ajax({
    url: '../api/videos.php?mode=list&limited=1',
    type: 'get',
    success: function(data){
      while(content.firstChild){
        content.removeChild(content.firstChild);
      }
      var tcat_data = JSON.parse(data);
      var container;
      var len = (tcat_data[tcat_id]["members"].length > MAX_ELEM_COLLAPSED?MAX_ELEM_COLLAPSED:tcat_data[tcat_id]["members"].length);
      for(var i = 0; i < len; i++){
        if(i % 4 == 0) container = add_video_container(content);
        add_video(container, tcat_data[tcat_id]["members"][i]);
      }
      if(tcat_data[tcat_id].members.length > MAX_ELEM_COLLAPSED){
        var more = add_show_more(container);
        $(more).click(function(){
          expand_tcat(tcat, tcat_id, tcat_nav);
        });
      }
      resize_timeline();
    }
  });
  $(tcat_nav).click(function(){
    expand_tcat(tcat, tcat_id, tcat_nav);
  });
}

function expand_tcat(tcat, tcat_id, tcat_nav){
  var content = tcat.getElementsByTagName("div")[0];
  $.ajax({
    url: '../api/videos.php?mode=list&scope='+tcat_id,
    type: 'get',
    success: function(data){
      while(content.firstChild){
        content.removeChild(content.firstChild);
      }
      var tcat_data = JSON.parse(data);
      var container;
      for(var i = 0; i < tcat_data[tcat_id]["members"].length; i++){
        if(i % 4 == 0) container = add_video_container(content);
        add_video(container, tcat_data[tcat_id]["members"][i]);
      }

      $('.video_container').click(function() {
        var id = $(this).children(".video:first").attr('id');
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
      });		
      resize_timeline();
    }
  });
  $(tcat_nav).click(function(){
    unexpand_tcat(tcat, tcat_id, tcat_nav);
  });
}

function init_event_handlers(){
  //CODE TO MAKE TIMELINE SCROLLABLE
  $('#timeline').mousedown(function (event) {
    $(this)
    .data('down', true)
    .data('x', event.clientX)
    .data('scrollLeft', this.scrollLeft);

    return false;
  }).mouseup(function (event) {
    $(this).data('down', false);
  }).mousemove(function (event) {
    if ($(this).data('down') == true) {
      this.scrollLeft = $(this).data('scrollLeft') + $(this).data('x') - event.clientX;
    }
    if( $(this).scrollLeft() == 0){
      $('#previous').hide();
    } else {
      $('#previous').show();
    }
    if ( $(this).scrollLeft() ==  (this.scrollWidth - this.clientWidth) ){
      $('#next').hide();
    } else {
      $('#next').show();
    }


  }).mousewheel(function (event, delta) {
    this.scrollLeft -= (delta * 30);
  }).css({
    'overflow' : 'hidden',
    'cursor' : '-moz-grab'
  });

  $(window).mouseout(function (event) {
    if ($('#timeline').data('down')) {
      try {
        if (event.originalTarget.nodeName == 'BODY' || event.originalTarget.nodeName == 'HTML') {
          $('#timeline').data('down', false);
        }                
      } catch (e) {}
    }
  });

  $('.video_container').click(function() {
    var id = $(this).children(".video:first").attr('id');
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
  });	

  //CLOSING POPUP
  //Click the x event
  $("#popupContactClose").click(function(){
    disablePopup();
  });
  //Click out event
  $("#backgroundPopup").click(function(){
    disablePopup();
  });
  //Press Escape event
  $(document).keypress(function(e){
    if(e.keyCode==27 && popupStatus==1){
      disablePopup();
    }
  });
}

function add_tcat(timeline, tcat_data){
  var tcat = document.createElement('li');
  tcat.setAttribute('id', 'tcat_'+tcat_data['id']);
  timeline.appendChild(tcat);
  // Title
  var title = document.createElement('h3');
  if(tcat_data['link'] != ""){
    var title_link = document.createElement("a");
    title_link.setAttribute("href", tcat_data["link"]);
    title_link.setAttribute("target","_blank");
    title_link.innerHTML = tcat_data["name"];
    title.appendChild(title_link);
  }else{
    title.innerHTML = tcat_data['name'];
  }
  tcat.appendChild(title);
  // Content
  var content = document.createElement('div');
  tcat.appendChild(content);
  var container;
  var len = (tcat_data.members.length > MAX_ELEM_COLLAPSED?MAX_ELEM_COLLAPSED:tcat_data.members.length);
  for(var i = 0; i < len; i++){
    if(i % 4 == 0) container = add_video_container(content);
    add_video(container, tcat_data.members[i]);
  }
  var timebar = document.createElement('div');
  timebar.setAttribute("class", "timeline-bar");
  tcat.appendChild(timebar);
  var link = document.createElement("a");
  link.setAttribute("href", "#tcat_"+tcat_data['id']);
  link.innerHTML = tcat_data['name_short'];
  timebar.appendChild(link);
  init_expand_trigger(tcat, tcat_data['id'], link);
  
  if(tcat_data.members.length > MAX_ELEM_COLLAPSED){
    var more = add_show_more(container);
    $(more).click(function(){
      expand_tcat(tcat, tcat_data['id'], link);
    });
  }

  if(tcat_data['id'] == DEFAULT_START_TCAT){
    var elem = tcat;
    do{
      timeline.offsetParent.scrollLeft += elem.offsetLeft;
    }while((elem = elem.offsetParent) && elem != timeline);
  }

  return tcat;
}

function add_video(container, video_data){
  var item = document.createElement("li");
  var video_container = document.createElement("div");
  video_container.setAttribute("class", "video_container");

  var video = document.createElement('img');
  video.setAttribute("class", "video");
  video.setAttribute("id", video_data.id);
  video.setAttribute("src", video_data.key_frame);
  video.setAttribute("width", "96");
  video.setAttribute("height", "72");


  var title = document.createElement("span");
  title.setAttribute("class", "title");
  title.innerHTML = video_data.title;

  var authors = document.createElement("span");
  authors.setAttribute("class", "authors");
  authors.innerHTML = video_data.authors;

  if ( video_data.winner != 0)
  {
    var prize = document.createElement("span");
    prize.setAttribute("class", "prize");
    if( video_data.winner == 1){
      prize.innerHTML = "Prize winner";
    } else if (video_data.winner == 2) {
      prize.innerHTML = "Audience favourite";
    }
  }

  var balloon = document.createElement('div');
  balloon.setAttribute('class', 'balloon');

  video_container.appendChild(video);
  balloon.appendChild(title);
  balloon.appendChild(document.createElement("br"));
  balloon.appendChild(authors);
  if (typeof( prize ) != 'undefined' )
  {
    balloon.appendChild(document.createElement("br"));
    var cup_icon = document.createElement('img');
    cup_icon.setAttribute("class", "icon");
    cup_icon.setAttribute("src", "images/cup.png");
    cup_icon.setAttribute("width", "12");
    cup_icon.setAttribute("height", "12");
    balloon.appendChild(cup_icon);
    balloon.appendChild(prize);
  }
  video.onmouseover = function(){
    balloon.style.display = "block";  
  }
  video.onmouseout = function(){
    balloon.style.display = "none";  
  }
  video_container.appendChild(balloon);
  item.appendChild(video_container); 
  container.appendChild(item);
}

function add_show_more(container){
  var item = document.createElement("li");
  var show_more = document.createElement("div");
  show_more.innerHTML = 'Show more';
  show_more.setAttribute('class', 'show_more');
  item.appendChild(show_more);
  container.appendChild(item);
  return show_more;
}

function add_video_container(content){
  var container = document.createElement("ul");
  container.setAttribute("class", "column");
  content.appendChild(container);
  return container;
}

function add_tcat_nav(navmenu, tcat_data){
  var nav = document.createElement("span");
  nav.setAttribute("id", "menu-item-"+tcat_data['id']);
  nav.setAttribute("class", "menu-item");
  var link = document.createElement("a");
  link.setAttribute("href", "#tcat_"+tcat_data['id']);
  link.innerHTML = tcat_data['name_short'];
  nav.appendChild(link);
  navmenu.appendChild(nav);
  return link;
}

//Sends id of selected video to php script and returns information for popup.
$(document).ready(function() {
  init_timeline(
    document.getElementById("test"),
    document.getElementById("menu-navigation-menu")
  );

  //CODE TO MAKE NAVIGATION ARROWS WORK
  $('#timeline span').click(function() {
    if ($(this).attr('id') == 'next') {
      $('#timeline').animate({
        scrollLeft: "+=200"
      });
    } else {
      $('#timeline').animate({
        scrollLeft: "-=200"
      });
    }

  });
});
