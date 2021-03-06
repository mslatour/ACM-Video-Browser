<?php

include("config.php");
$con = mysql_connect($db_host,$username,$password) or 
  die('Could not connect: ' . mysql_error());

mysql_select_db("my_db", $con);

  if (isset($_POST['id'])) {
    $id = $_POST['id'];
  } 

  //gets title, authors, video, paper and year of selected video.
  $res_meta_data = mysql_query(
    sprintf(
      "SELECT Metadata.title AS title, Metadata.authors AS authors, result.video_link AS videolink, result.paper_link AS paperlink, Metadata.year AS year, Metadata.Keywords AS keywords FROM Metadata, result WHERE Metadata.id = '%s' AND Metadata.id = result.id",
      mysql_real_escape_string($id)
    )
  );
  $row_meta_data = mysql_fetch_array($res_meta_data);

/*CATEGORIES*/
//Select categories and weight from selected video.
$result_catselectedvideo = mysql_query(sprintf("SELECT `category_id`, weight AS 'selected_video_weight' FROM `Video-Categories` WHERE `video_id` = '%s' ", mysql_real_escape_string($id) ));
$categories = array();


while($row_catselectedvideo = mysql_fetch_array($result_catselectedvideo))
  {
	$categories[$row_catselectedvideo['category_id']] = $row_catselectedvideo['selected_video_weight'];
  }

$related_cat = array();
//For each category, select videos and weight.
foreach ($categories as $category => $weight)
{
$related_result = mysql_query(sprintf("SELECT `video_id` AS related_video, weight AS 'related_video_weight' FROM `Video-Categories` WHERE `category_id` = '%s' AND NOT `video_id` = '%s' ", mysql_real_escape_string($category), mysql_real_escape_string($id)));

while($row_related = mysql_fetch_array($related_result))
	{
		$related_cat[$row_related['related_video']][$category] = $row_related['related_video_weight'];
	}
}

$categories_count = array();

foreach($related_cat as $related_video => $value)
{
	$score = 0;
	foreach($value as $category => $weight)
	{
	$score += $categories[$category] + $weight;
	}
	$categories_count[$related_video] = $score;
}

arsort($categories_count);

//GENERAL TERMS
$result_term_selectedvideo = mysql_query(sprintf("SELECT `Video-Terms`.term_id FROM `Video-Terms` WHERE `Video-Terms`.video_id =  '%s'", mysql_real_escape_string($id) ));
$terms = array();

while($row = mysql_fetch_array($result_term_selectedvideo))
  {
	array_push($terms,  $row['term_id']);
  }

$related_term = array();
foreach ($terms as $term)
{
	$related_result = mysql_query(sprintf("SELECT `video_id` AS related_video FROM `Video-Terms` WHERE `term_id` = '%s' AND NOT `video_id` = '%s' AND NOT `term_id` = '' ", mysql_real_escape_string($term), mysql_real_escape_string($id) ));

	while($row_term = mysql_fetch_array($related_result))
  	{
		if(!array_key_exists($row_term['related_video'], $related_term))
		{
		$related_term[$row_term['related_video'] ] = array($term);
		}
		else
		{
		array_push($related_term[$row_term['related_video'] ], $term);
		}
	}

}

$term_count = array();
$term_weight = 1;
foreach($related_term as $related_video => $value)
{
	$term_count[$related_video] = count($value) * $term_weight;
}

//KEYWORDS
$result_keywordselectedvideo = mysql_query(sprintf("SELECT `Keywords` FROM `Video-Keywords` WHERE `video_id` = '%s' ", mysql_real_escape_string($id) ));
$keywords = array();

while($row_keywordselectedvideo = mysql_fetch_array($result_keywordselectedvideo))
  {
	array_push($keywords,  $row_keywordselectedvideo['Keywords']);
  }

$related_keywords = array();
foreach ($keywords as $keyword)
{
$related_result = mysql_query(sprintf("SELECT `video_id` AS related_video FROM `Video-Keywords` WHERE `Keywords` = '%s' AND NOT `video_id` = '%s' AND NOT `Keywords` = '' ", mysql_real_escape_string($keyword), mysql_real_escape_string($id) ));

while($row_relatedkeyword = mysql_fetch_array($related_result))
  {
	if(!array_key_exists($row_relatedkeyword['related_video'], $related_keywords))
	{
	$related_keywords[$row_relatedkeyword['related_video'] ] = array($keyword);
	}
	else
	{
	array_push($related_keywords[$row_relatedkeyword['related_video'] ],  $keyword);
	}
}

}

$keyword_count = array();
$keyword_weight = 8;
foreach($related_keywords as $related_video => $value)
{
	$keyword_count[$related_video] = count($value) * $keyword_weight;
}

//EINDSCORE
//eindscore contains the end score. The first loop adds the term-score with the category-score...
$eindscore = $categories_count;
foreach($term_count as $key => $value)
	{
		$eindscore[$key] += $term_count[$key];
	}
//...while the second loop adds the keyword-score.
foreach($keyword_count as $key => $value)
	{
		$eindscore[$key] += $keyword_count[$key];
	}

//The array with scores is sorted in reverse order, so the related video with the highest score (and thus the biggest match with the selected video) ends at the top.
arsort($eindscore);

$prefix = '';

?>

<script src="jquery.js" type="text/javascript"></script>
<script src="popup.js" type="text/javascript"></script>
<script type='text/javascript'>
//Sends id of selected video to php script and returns information for popup.
  $(document).ready(function() {
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
  });
</script>


	<div id="popupContact">
		<a id="popupContactClose">x</a>
		<h1><?php echo htmlentities($row_meta_data['title']) . " (" . $row_meta_data['year'] . ")"; ?></h1>
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
			<?php echo " ../" . $row_meta_data['paperlink']; ?>
			 target="_blank"><img src="images/pdf_logo.gif" alt="Pdf" class="fulltext_lnk" border="0">Pdf</a></p>
			<p><?php echo   "<b>Authors: </b>" . htmlentities($row_meta_data['authors']); ?></p> 
			<p><br /><?php if (! $row_meta_data['keywords'] == '') {echo "<b>Keywords: </b>" . $row_meta_data['keywords'];} ?></p> 
			</div>
			</ul>
			</li>
		<li class="related-column">
		<h3>RELATED VIDEOS</h3>
		<ul class="column">
		<ol id="relatedvideos">
		<?php
		if ( sizeof($eindscore) > 0 )
		{
			$eindscore = array_slice($eindscore, 0, 20);
			foreach($eindscore as $related_video => $value)
			{
		  	$res_related_video_meta = mysql_query(
          sprintf(
            "SELECT Metadata.title AS title, Metadata.authors AS authors, result.video_link AS videolink, Metadata.year AS year FROM Metadata, result WHERE Metadata.id = '%s' AND Metadata.id = result.id",
            mysql_real_escape_string($related_video)
          )
        );

        while($related_meta = mysql_fetch_array($res_related_video_meta))
        {
          echo "<li><a href=" . $related_meta['videolink'] . ">" . htmlentities($related_meta['title']) . " (<b>" . $related_meta['year'] . "</b>)</a></li>";
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
