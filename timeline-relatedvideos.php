<?php

include("config.php");
$con = mysql_connect($db_host,$username,$password) or 
  die('Could not connect: ' . mysql_error());

mysql_select_db("my_db", $con);

// Comparison function
function cmp($a, $b) {
  if ( count($a) == count($b) ) {
    return 0;
  }
  return ( count($a) > count($b) ? -1 : 1 );
}

if (isset($_POST['id'])) {
  $id = $_POST['id'];

  //gets title, authors, video, paper and year of selected video.
  $res_meta_data = mysql_query(
    sprintf(
      "SELECT Metadata.title AS title, Metadata.authors AS authors, result.video_link AS videolink, result.paper_link AS paperlink, Metadata.year AS year, Metadata.Keywords AS keywords FROM Metadata, result WHERE Metadata.id = '%s' AND Metadata.id = result.id",
      mysql_real_escape_string($id);
    )
  );
  $row_meta_data = mysql_fetch_array($res_meta_data);

  //Gets categories of selected video.
  $res_cat = mysql_query(
    sprintf(
      "SELECT `category_id` FROM `Video-Categories` WHERE `video_id` = '%s'",
      mysql_real_escape_string($id)
    )
  );
  $categories = array();
  while($row_cat = mysql_fetch_array($res_cat)){
    $categories[] = $row_cat['category_id'];
  }

  //Gets related videos that have matching categories.
  $related_videos = array();
  foreach ($categories as $category)
  {
    $result_related = mysql_query(
      sprintf(
        "SELECT `video_id` AS related_video FROM `Video-Categories` WHERE `category_id` = '%s' AND NOT `video_id` = '%s'",
        mysql_real_escape_string($category),
        mysql_real_escape_string($id)
      )
    );

    while($row_related = mysql_fetch_array($result_related))
    {
      if(!array_key_exists($row_related['related_video'], $related_videos))
      {
        $related_videos[$row_related['related_video'] ] = array($category);
      }
      else
      {
        array_push($related_videos[$row_related['related_video'] ],  $category);
      }
    }
  }
  // Sort the array according to number of matching categories.
  uasort($related_videos, 'cmp');
}
?>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
<title>Video Timeline - scrolbaar</title>
<script src="jquery.js" type="text/javascript"></script>
<script src="expand.js" type="text/javascript"></script>
<script src="popup.js" type="text/javascript"></script>
<script type='text/javascript'>
//Sends id of selected video to php script and returns information for popup.
  $(document).ready(function() {
    $('.video').dblclick(function() {
		$.ajax({
		url: location.href,
		type: 'post',
		data:{id: $(this).attr('id')},
		success: function(value){
		$('body').html(value);
		//centers popup
		centerPopup();
		//loads popup
		loadPopup();
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
		if(e.keyCode==27 &amp;&amp; popupStatus==1){
			disablePopup();
		}
	});
  });
</script>
<link rel="stylesheet" href="timeline-popup.css" type="text/css" media="screen" />

</head>
<body>
<div id="timeline">

<ul class="tl-events" id="test">
<li id="2001">
<h3>1993-2001</h3>
<ul class="column">
<div class="details" style="display:none">
</div>

<img class="video" id="1995-VD_1" src="acm-video-pages/dvs/images/videos1995/olivieri.jpg" width="96" height="72" />
<img class="video" id="1995-VD_2" src="acm-video-pages/dvs/images/videos1995/farquhar.jpg" width="96" height="72" />
<img class="video" id="1995-VD_3" src="acm-video-pages/dvs/images/videos1995/yankelovich.jpg" width="96" height="72" />
<img class="video" id="1995-VD_4" src="acm-video-pages/dvs/images/videos1995/hemphill.jpg" width="96" height="72" />
<img class="video" id="1995-VD_5" src="acm-video-pages/dvs/images/videos1995/holfelder.jpg" width="96" height="72" />
<img class="video" id="1995-VD_6" src="acm-video-pages/dvs/images/videos1995/lamparter.jpg" width="96" height="72" />
<img class="video" id="1995-VD_7" src="acm-video-pages/dvs/images/videos1995/katkere.jpg" width="96" height="72" />

</ul>
</li>
<li id="2002">
<a href="http://www.sigmm.org/archive/MM/mm02/index.htm" target="_blank"><h3>2002: Juan-les-Pins, France</h3></a>
<ul class="column">
<div class="details" style="display:none">
<p>The Multimedia 2002 Video Review Committee included the following individuals:<br />
<br />
Lynn Wilcox (chair), FX Palo Alto Laboratory<br />
Mike Christel, Carnegie Mellon University<br />
Andreas Girgensohn, FX Palo Alto Laboratory<br />
Frank Nack, CWI</p>
</div>
<img class="video" id="2002-VD_1" src="acm-video-pages/dvs/images/videos2002/01kaufmann.jpg" width="96" height="72" /></a>
<img class="video" id="2002-VD_2" src="acm-video-pages/dvs/images/videos2002/02tang.jpg" width="96" height="72" /></a>
<img class="video" id="2002-VD_3" src="acm-video-pages/dvs/images/videos2002/03doherty.jpg" width="96" height="72" /></a>
<img class="video" id="2002-VD_4" src="acm-video-pages/dvs/images/videos2002/04liu.jpg" width="96" height="72" /></a>
<img class="video" id="2002-VD_5" src="acm-video-pages/dvs/images/videos2002/05ip.jpg" width="96" height="72" /></a>
<img class="video" id="2002-VD_6" src="acm-video-pages/dvs/images/videos2002/06gil.jpg" width="96" height="72" /></a>
<img class="video" id="2002-VD_7" src="acm-video-pages/dvs/images/videos2002/07ghahremani.jpg" width="96" height="72" /></a>
<img class="video" id="2002-VD_8" src="acm-video-pages/dvs/images/videos2002/08andersson.jpg" width="96" height="72" /></a>
<img class="video" id="2002-VF_1" src="acm-video-pages/dvs/images/videos2002/09bonard.jpg" width="96" height="72" /></a>
<img class="video" id="2002-VF_2" src="acm-video-pages/dvs/images/videos2002/10foote.jpg" width="96" height="72" /></a>
<img class="video" id="2002-VF_3" src="acm-video-pages/dvs/images/videos2002/11liu.jpg" width="96" height="72" /></a>
</ul>
</li>
<li id="2003">
<h3>2003: Berkeley, CA, USA</h3>
<ul class="column">
<div class="details" style="display:none">
<p>The Multimedia 2003 Video Review Committee included the following individuals:<br />
<br />
Lynn Wilcox (chair), FX Palo Alto Laboratory<br />
Andreas Girgensohn, FX Palo Alto Laboratory<br />
Horace Ip, City University of Hong Kong<br />
Frank Nack, CWI</p>
</div>
<img class="video" id="2003-VD_1" src="acm-video-pages/dvs/images/videos2003/01Hua.jpg" width="96" height="72" />
<img class="video" id="2003-VD_2" src="acm-video-pages/dvs/images/videos2003/02Tryfanos.jpg" width="96" height="72" />
<img class="video" id="2003-VD_3" src="acm-video-pages/dvs/images/videos2003/03Yip.jpg" width="96" height="72" />
<img class="video" id="2003-VD_4" src="acm-video-pages/dvs/images/videos2003/04Adcock.jpg" width="96" height="72" />
<img class="video" id="2003-VD_5" src="acm-video-pages/dvs/images/videos2003/05Wilcox.jpg" width="96" height="72" />
<img class="video" id="2003-VD_6" src="acm-video-pages/dvs/images/videos2003/06davis.jpg" width="96" height="72" />
<img class="video" id="2003-VF_1" src="acm-video-pages/dvs/images/videos2003/07bennett.jpg" width="96" height="72" />
<img class="video" id="2003-VF_2" src="acm-video-pages/dvs/images/videos2003/08baker.jpg" width="96" height="72" />
<img class="video" id="2003-VF_3" src="acm-video-pages/dvs/images/videos2003/09hua.jpg" width="96" height="72" />
<img class="video" id="2003-VF_4" src="acm-video-pages/dvs/images/videos2003/10liao.jpg" width="96" height="72" />
</ul>
</li>

<li id="2004">
<a href="http://www.sigmm.org/archive/MM/mm04/index.htm" target="_blank"><h3>2004: New York, NY, USA</h3></a>
<ul class="column">
<div class="details" style="display:none">
<p>The Multimedia 2004 Video Review Committee included the following individuals:<br />
<br />
Frank Nack (chair), CWI<br />
Annet Dekker, Netherlands Media Art Institute &amp; Montevideo Time Based Arts<br />
Andreas Girgensohn, FX Palo Alto Laboratory<br />
Alejandro Jaimes, FujiXerox<br />
Andruid Kerne, Texas A&amp;M University, Department of Computer Science<br />
Lynn Wilcox, FX Palo Alto Laboratory</p>
</div>
<img class="video" id="2004-VD_1" src="acm-video-pages/dvs/images/videos2004/VD_1.jpg" width="96" height="72" />
<img class="video" id="2004-VD_2" src="acm-video-pages/dvs/images/videos2004/VD_2.jpg" width="96" height="72" />
<img class="video" id="2004-VD_3" src="acm-video-pages/dvs/images/videos2004/VD_3.jpg" width="96" height="72" />
<img class="video" id="2004-VD_4" src="acm-video-pages/dvs/images/videos2004/VD_4.jpg" width="96" height="72" />
<img class="video" id="2004-VD_5" src="acm-video-pages/dvs/images/videos2004/VD_5.jpg" width="96" height="72" />
<img class="video" id="2004-VD_6" src="acm-video-pages/dvs/images/videos2004/VD_6.jpg" width="96" height="72" />
<img class="video" id="2004-VF_1" src="acm-video-pages/dvs/images/videos2004/VF_1.jpg" width="96" height="72" />
<img class="video" id="2004-VF_2" src="acm-video-pages/dvs/images/videos2004/VF_2.jpg" width="96" height="72" />
<img class="video" id="2004-VF_3" src="acm-video-pages/dvs/images/videos2004/VF_3.jpg" width="96" height="72" />
</ul>
</li>

<li id="2005">
<a href="http://www.sigmm.org/archive/MM/mm05/index.html" target="_blank"><h3>2005: Singapore</h3></a>
<ul class="column">
<div class="details" style="display:none">
<p>The Multimedia 2005 Video Review Committee included the following individuals:<br />
<br />
Frank Nack (co-chair), CWI<br />
Svetha Venkatesh (Co-chair), Curtin University<br />
Annet Dekker, Netherlands Media Art Institute &amp; Montevideo Time Based Arts<br />
Alejandro Jaimes, FujiXerox<br />
Andruid Kerne, Texas A&amp;M University, Department of Computer Science</p>
</div>
<img class="video" id="2005-VD_1" src="acm-video-pages/dvs/images/videos2005/VD_1.jpg" width="96" height="72" />
<img class="video" id="2005-VD_2" src="acm-video-pages/dvs/images/videos2005/VD_2.jpg" width="96" height="72" />
<img class="video" id="2005-VD_3" src="acm-video-pages/dvs/images/videos2005/VD_3.jpg" width="96" height="72" />
<img class="video" id="2005-VD_4" src="acm-video-pages/dvs/images/videos2005/VD_4.jpg" width="96" height="72" style="border: 2px solid gold;" />
<img class="video" id="2005-VD_5" src="acm-video-pages/dvs/images/videos2005/VD_5.jpg" width="96" height="72" />
<img class="video" id="2005-VF_1" src="acm-video-pages/dvs/images/videos2005/VF_1.jpg" width="96" height="72" />
<img class="video" id="2005-VV_1" src="acm-video-pages/dvs/images/videos2005/VV_1.jpg" width="96" height="72" style="border: 2px solid gold;"/>
</ul>
</li>

<li id="2006">
<a href="http://www.sigmm.org/archive/MM/mm06/index.html" target="_blank"><h3>2006: Santa Barbara, CA, USA</h3></a>
<ul class="column">
<div class="details" style="display:none">
<p>The Multimedia 2006 Video Track was chaired by Wuchi Feng, Portland State University, USA.</p>
</div>
<img class="video" id="2006-VD_1" src="acm-video-pages/dvs/images/videos2006/VD_1.jpg" width="96" height="72" />
<img class="video" id="2006-VD_2" src="acm-video-pages/dvs/images/videos2006/VD_2.jpg" width="96" height="72" />
<img class="video" id="2006-VD_3" src="acm-video-pages/dvs/images/videos2006/VD_3.jpg" width="96" height="72" />
<img class="video" id="2006-VD_4" src="acm-video-pages/dvs/images/videos2006/VD_4.jpg" width="96" height="72" />
<img class="video" id="2006-VD_5" src="acm-video-pages/dvs/images/videos2006/VD_5.jpg" width="96" height="72" />
<img class="video" id="2006-VD_6" src="acm-video-pages/dvs/images/videos2006/VD_6.jpg" width="96" height="72" />
</ul>
</li>


<li id="2007">
<a href="http://mmc36.informatik.uni-augsburg.de/acmmm2007/" target="_blank"><h3>2007: Augsburg, Germany</h3></a>
<ul class="column">
</ul>
</li>

<li id="2008">
<a href="http://www.sigmm.org/archive/MM/mm08/index.htm" target="_blank"><h3>2008: Vancouver, BC, Canada</h3></a>
<ul class="column">
</ul>
</li>

<li id="2009">
<a href="http://www.sigmm.org/archive/MM/mm09/index.htm" target="_blank"><h3 style="color: black;">2009: Beijing, China</h3></a>
<ul class="column">
</ul>
</li>

<li id="2010">
<a href="http://www.sigmm.org/archive/MM/mm10/www.acmmm10.org/index.html" target="_blank"><h3 style="color: white;">2010: Firenze, Italy</h3></a>
<ul class="column">
</ul>
</li>

<li id="2011">
<h3>2011: Scottsdale, Arizona, USA</h3>
<ul class="column">
</ul>
</li>

<li id="2012">
<h3>2012</h3>
<ul class="column">
</ul>
</li>

</ul>
</li>
</ul>

<!---Tijdlijnbar--->
<div id="t_footer">
<div class="timeline-bar" style="width:7000px;height:30px;">

	<div id="access">
		<ul id="menu-navigation-menu" class="menu">
			<li id="menu-item-94" class="menu-item"><a href=#2001>1993-2001</a></li>
			<li id="menu-item-1" class="menu-item"><a href=#2002>2002</a></li>
			<li id="menu-item-2" class="menu-item"><a href=#2003>2003</a></li>
			<li id="menu-item-3" class="menu-item"><a href=#2004>2004</a></li>
			<li id="menu-item-4" class="menu-item"><a href=#2005>2005</a></li>
			<li id="menu-item-5" class="menu-item"><a href=#2005>2006</a></li>
			<li id="menu-item-6" class="menu-item"><a href=#2007>2007</a></li>
			<li id="menu-item-7" class="menu-item"><a href=#2008>2008</a></li>
			<li id="menu-item-8" class="menu-item"><a href=#2009>2009</a></li>
			<li id="menu-item-9" class="menu-item"><a href=#2010>2010</a></li>
			<li id="menu-item-10" class="menu-item"><a href=#2011>2011</a></li>
			<li id="menu-item-11" class="menu-item"><a href=#2012>2012</a></li>
		</ul>
	</div>			

</div><!-- timeline-bar -->

</div><!-- t_footer -->

    </div>

<!-- POPUP -->
<div id="popup">
	<div id="popupContact">
		<a id="popupContactClose">x</a>
		<h1><?php echo $row_meta_data['title'] . " (" . $row_meta_data['year'] . ")"; ?></h1>
		<ul class="popupColumns">
			<li class="video-column">
			<h3>VIDEO</h3>
			<ul class="column">
			<div id="video-container">
			<video width="360" height="280" controls="controls">
			<source src= 
  			<?php echo $row_meta_data['videolink']; ?>
			type="video/mp4" />
  			Your browser does not support the video tag.
			</video>
			</div><!--video-container--->
			<!---<embed src="VD_1.mpg" height="280" width="360"/>--->
			<div id="video-description">
			<p><a name="FullTextPdf" title="FullText Pdf" href=
			<?php echo $row_meta_data['paperlink']; ?>
			target="_blank"><img src="Pop-up/pdf_logo.gif" alt="Pdf" class="fulltext_lnk" border="0"></a><?php echo $row_meta_data['title']; ?></p>
			<p><i><?php echo $row_meta_data['authors']; ?></i></p> 
			<p><br /><?php if (! $row_meta_data['keywords'] == '') {echo "<b>Keywords: </b>" . $row_meta_data['keywords'];} ?></p> 
			</div>
			</ul>
			</li>
		<li class="related-column">
		<h3>RELATED VIDEOS</h3>
		<ul class="column">
		<ol id="relatedvideos">
		<?php
		if ( sizeof($related_videos) > 0 )
		{
			foreach($related_videos as $related_video => $value)
			{
		  	$res_related_video_meta = mysql_query(
          sprintf(
            "SELECT Metadata.title AS title, Metadata.authors AS authors, result.video_link AS videolink FROM Metadata, result WHERE Metadata.id = '%s' AND Metadata.id = result.id",
            mysql_real_escape_string($related_video)
          )
        );

        while($related_meta = mysql_fetch_array($res_related_video_meta))
        {
          echo "<li><a href=" . $related_meta['videolink'] . ">" . $related_meta['title'] . "</a></li>";
        }
			}
		}
		else
		{
			echo "<p>No related videos.</p>";
		}
		?>
		</ol>
		</ul>
		</li>
		</ul>
	</div><!--popupContact-->
	<div id="backgroundPopup"></div>
</div><!--popup-->
</body>
</html>

