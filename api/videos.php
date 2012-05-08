<?php
/**
 Retrieve video elements
*/

// Connect to the database
include("connect.php");

ob_start();
// Set queries
$q_get_20_videos = "SELECT * FROM `Videos` LIMIT 20";

$result = mysql_query($q_get_20_videos);

$videos = array();

while( $row = mysql_fetch_assoc($result) ){
  $videos[] = $row;
}

ob_end_clean();
echo json_encode(array("videos"=>$videos));

?>
