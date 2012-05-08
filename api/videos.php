<?php
/**
 Retrieve video elements
*/

// Connect to the database
include("connect.php");

ob_start();
// Set queries
$q_get_5_videos = "SELECT * FROM `Videos` LIMIT 5";

$result = mysql_query($q_get_5_videos);

$videos = array();

while( $row = mysql_fetch_assoc($result) ){
  $video = array();
  $video['video_id'] = $row['video_id'];
  $video['screenshot'] = "http://localhost/acm-data/acm-video-pages/dvs/images/videos2002/01kaufmann.jpg";
  $video['year'] = $row['Year'];
  $videos[] = $video;
}

ob_end_clean();
echo json_encode(array("videos"=>$videos));

?>
