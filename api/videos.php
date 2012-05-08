<?php
/**
 Retrieve video elements
*/

// Connect to the database
include("connect.php");

// Set queries
$q_get_20_videos = "SELECT * FROM `Videos` LIMIT 20";

$result = mysql_query($q_get_20_videos);


?>
