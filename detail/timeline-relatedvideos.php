<?php

include("config.php");
$con = mysql_connect($db_host,$username,$password);

if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }

mysql_select_db("my_db", $con);

  if (isset($_POST['id'])) {
    $id = $_POST['id'];
  } 
  else
	{
	$id = '2006-VD_1';
}


//gets title, authors, video, paper and year of selected video.
$result = mysql_query("SELECT Metadata.title AS title, Metadata.authors AS authors, result.video_link AS videolink, result.paper_link AS paperlink, Metadata.year AS year, Metadata.Keywords AS keywords FROM Metadata, result WHERE Metadata.id = '$id' AND Metadata.id = result.id");
$row = array();
$row = mysql_fetch_array($result);

//Gets categories of selected video.
$result2 = mysql_query("SELECT `category_id` FROM `Video-Categories` WHERE `video_id` = '$id' ");
$row2 = array();
$test2 = array();
while($row2 = mysql_fetch_array($result2))
  {
	array_push($test2,  $row2['category_id']);
  }

//Gets related videos that have matching categories.
$test3 = array();
foreach ($test2 as $category)
{
$related_result = mysql_query("SELECT `video_id` AS related_video FROM `Video-Categories` WHERE `category_id` = '$category' AND NOT `video_id` = '$id' ");

while($row3 = mysql_fetch_array($related_result))
  	{
	if(!array_key_exists($row3['related_video'], $test3))
		{
		$test3[$row3['related_video'] ] = array($category);
		}
	else
		{
		array_push($test3[$row3['related_video'] ],  $category);
		}
	}
}

// Comparison function
function cmp($a, $b) {
    if ( count($a) == count($b) ) {
        return 0;
    }
    return ( count($a) > count($b) ) ? -1 : 1;
}

// Sort the array according to number of matching categories.
uasort($test3, 'cmp');


?>

<html>
<body>
<!-- POPUP -->
<div id="popup">
	<div id="popupContact">
		<a id="popupContactClose">x</a>
		<h1><?php echo htmlentities($row['title']) . " (" . $row['year'] . ")"; ?></h1>
		<ul class="popupColumns">
			<li class="video-column">
			<ul class="column">
			<h3>VIDEO</h3>
			<div id="video-container">
			<video width="360" height="280" controls="controls">
			<source src= 
  			<?php echo $row['videolink']; ?>
			type="video/mp4" />
  			Your browser does not support the video tag.
			</video>
			</div><!--video-container--->
			<div id="video-description">
			<p><?php if (! $row['paperlink'] == '') {echo "<a name='FullTextPdf' title='FullText Pdf' href=" . $row['paperlink'] . " target='_blank'><img src='Pop-up/pdf_logo.gif' alt='Pdf' class='fulltext_lnk' border='0'></a>";}  echo $row['title']; ?></p>
			<p><i><?php echo htmlentities($row['authors']); ?></i></p> 
			<p><br /><?php if (! $row['keywords'] == '') {echo "<b>Keywords: </b>" . $row['keywords'];} ?></p> 
			</div>
			</ul>
			</li>
		<li class="related-column">
		<ul class="column">
		<h3>RELATED VIDEOS</h3>
		<ol id="relatedvideos">
		<?php
		if (isset($row3))
		{
			//Picks the 20 most relevant videos. 
			$test3 = array_slice($test3, 0, 20);
			foreach($test3 as $related_video => $value)
			{
			$result4 = mysql_query("SELECT Metadata.title AS title, Metadata.authors AS authors, result.video_link AS videolink FROM Metadata, result WHERE Metadata.id = 				'$related_video' AND Metadata.id = result.id");

			while($row4 = mysql_fetch_array($result4))
			{
			  echo "<li><a href=" . $row4['videolink'] . ">" . htmlentities($row4['title']) . "</a></li>";
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
	</div><!--popupContact--->
	<div id="backgroundPopup"></div>

</div><!--popup--->
</body>
</html>


