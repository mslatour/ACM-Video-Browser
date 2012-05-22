<?php
// Connect to the database
include("connect.php");

// Comparison function
function cmp($a, $b) {
  if ( count($a) == count($b) ) {
    return 0;
  }
  return ( count($a) > count($b) ? -1 : 1 );
}

$q_get_categories = "SELECT `category_id` FROM `Video-Categories` WHERE `video_id` = '%s'";
$q_get_related_videos = "SELECT `video_id` AS related_video FROM `Video-Categories` WHERE `category_id` = '%s' AND NOT `video_id` = '%s'";

if(!isset($_GET['mode'])) $_GET['mode'] = 'list';

switch($_GET['mode']){
  case "related":
    if(isset($_GET['id'])){
      $id = $_GET['id'];
      ob_start();
      // Gets categories of selected video.
      $res_cat = mysql_query(
        sprintf(
          $q_get_categories,
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
            $q_get_related_videos,
            mysql_real_escape_string($category),
            mysql_real_escape_string($id)
          )
        );

        while($row_related = mysql_fetch_array($result_related))
        {
          if(!array_key_exists($row_related['related_video'], $related_videos))
          {
            $related_videos[$row_related['related_video']] = array($category);
          }
          else
          {
            $related_videos[$row_related['related_video']][] = $category;
          }
        }
      }
      // Sort the array according to number of matching categories.
      uasort($related_videos, 'cmp');
      
      ob_end_clean();
      print_r($categories);
      echo json_encode($related_videos);
    }
    break;
  case "details":
    if(isset($_GET['id'])){
        // popup ...
    }else{

    }
    break;
  case "list":
  default:
    ob_start();
    // Set queries
    $q_get_videos_limited = "SELECT * FROM `result` ORDER BY RAND() LIMIT 20";
    $q_get_videos = "SELECT * FROM `result`";
    $q_get_videos_scope_limited = "SELECT * FROM `result` WHERE time_category = %d ORDER BY RAND() LIMIT 20";
    $q_get_videos_scope = "SELECT * FROM `result` WHERE time_category = %d";
    $q_get_time_categories = "SELECT * FROM TimeCategories";
    $q_get_time_categories_scope = "SELECT * FROM TimeCategories WHERE id = %d";

    $tcats = array();

    if(isset($_GET['scope']) && intval($_GET['scope']) > 0){
      $result = mysql_query(
        sprintf(
          $q_get_time_categories_scope,
          mysql_real_escape_string($_GET['scope'])
        )
      );
    }else{    
      $result = mysql_query($q_get_time_categories);
    }
    while($row = mysql_fetch_assoc($result)){
      $row['members'] = array();
      $tcats[$row['id']] = $row;
    }

    if($_GET['limited'] == 1){
      if(isset($_GET['scope']) && intval($_GET['scope']) > 0){
        $result = mysql_query(
          sprintf(
            $q_get_videos_scope_limited,
            mysql_real_escape_string($_GET['scope'])
          )
        );
      }else{
        $result = mysql_query($q_get_videos_limited);
      }
    }else{
      if(isset($_GET['scope']) && intval($_GET['scope']) > 0){
        $result = mysql_query(
          sprintf(
            $q_get_videos_scope,
            mysql_real_escape_string($_GET['scope'])
          )
        );
      }else{
        $result = mysql_query($q_get_videos);
      }
    }

    $videos = array();

    while( $row = mysql_fetch_assoc($result) ){
      $video = array();
      $video['id'] = $row['id'];
      $video['key_frame'] = "../".$row['key_frame'];
      $tcats[$row['time_category']]["members"][] = $video;
    }

    ob_end_clean();
    echo json_encode($tcats);
    break;
}
?>
