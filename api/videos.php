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

$q_get_categories = "SELECT parent, `category_id`, weight AS 'selected_video_weight' FROM `Video-Categories` WHERE `video_id` = '%s'";
$q_get_related_videos = "SELECT `video_id` AS 'related_video', category_id AS 'related_category', weight AS 'related_video_weight' FROM `Video-Categories` WHERE `parent` = '%s' AND NOT `video_id` = '%s'";
$q_get_terms = "SELECT term_id FROM `Video-Terms` WHERE video_id =  '%s'";
$q_get_related_videos_terms = "SELECT `video_id` AS related_video FROM `Video-Terms` WHERE `term_id` = '%s' AND NOT `video_id` = '%s'";
$q_get_keywords = "SELECT `keyword` FROM `Video-Keywords` WHERE `video_id` = '%s' ";
$q_get_related_videos_keywords = "SELECT `video_id` AS related_video FROM `Video-Keywords` WHERE `keyword` = '%s' AND NOT `video_id` = '%s' AND NOT `keyword` = '' ";
$q_get_video_details = "SELECT * FROM `result` WHERE `id` = '%s'";
$q_get_time_details = "SELECT * FROM `TimeCategories` WHERE `id` = '%s'";

if(!isset($_GET['mode'])) $_GET['mode'] = 'list';

switch($_GET['mode']){
  case "related":
    if(isset($_GET['id'])){
      $id = $_GET['id'];

      // Videos container;
      $videos = array();

      ob_start();
      
      /*********************************
       * Relevant videos by categories *
       *********************************/

      // $w is a constant that is used to make the weight of the selected video
      // more important than the weight of the related videos.
      $w = 2;

      // Gets categories of selected video.
      $res_cat = mysql_query(
        sprintf(
          $q_get_categories,
          mysql_real_escape_string($id)
          )
        );
      $categories = array();
      while($row_cat = mysql_fetch_array($res_cat)){
        $result_related_categories = mysql_query(
          sprintf(
            $q_get_related_videos,
            mysql_real_escape_string($row_cat['parent']),
            mysql_real_escape_string($id)
          )
        );
        
        while($row_related_by_category = mysql_fetch_array($result_related_categories))
        {
          // Add related video and its categories to the end result
          if(
            ! array_key_exists($row_related_by_category['related_video'], $result) ||
            ! array_key_exists("categories", $videos[$row_related_by_category['related_video']])
          ){
            $videos[$row_related_by_category['related_video']]["categories"] = array($row_related_by_category['related_category']);
          }else{
            $videos[$row_related_by_category['related_video']]["categories"][] = $row_related_by_category['related_category'];
          }
          // Update score of the related video
          if( ! array_key_exists("score", $videos[$row_related_by_category['related_video']]) ){
            $videos[$row_related_by_category["related_video"]]["score"] = $row_related_by_category['related_video_weight'];
          }else{
            $videos[$row_related_by_category["related_video"]]["score"] += $row_related_by_category['related_video_weight'];
          }
          // Add bonus when leafs match, else add 0.5
          if( $row_related_by_category['related_category'] == $row_cat['category_id']){
            $videos[$row_related_by_category["related_video"]]["score"] += $w * $row_cat['selected_video_weight'];
          }else{
            $videos[$row_related_by_category["related_video"]]["score"] += 0.5;
          }
        }
      }

      /****************************
       * Relevant videos by terms *
       ****************************/

      // Gets general terms of selected video.
      $res_term = mysql_query(
        sprintf(
          $q_get_terms,
          mysql_real_escape_string($id)
        )
      );
      $term_weight = 1;
      while($row_term = mysql_fetch_array($res_term)){
        $result_related_terms = mysql_query(
          sprintf(
            $q_get_related_videos_terms,
            mysql_real_escape_string($row_term['term_id']),
            mysql_real_escape_string($id)
          )
        );

        while($row_related_by_term = mysql_fetch_array($result_related_terms))
        {
          // Add related video and its keywords to the end result
          if(
            ! array_key_exists($row_related_by_term['related_video'], $result) ||
            ! array_key_exists("terms", $videos[$row_related_by_term['related_video']])
          ){
            $videos[$row_related_by_term['related_video']]["terms"] = array($row_term['term_id']);
          }else{
            $videos[$row_related_by_term['related_video']]["terms"][] = $row_term['term_id'];
          }
          // Update score of the related video
          if( ! array_key_exists("score", $videos[$row_related_by_term['related_video']]) ){
            $videos[$row_related_by_term["related_video"]]["score"] = $term_weight;
          }else{
            $videos[$row_related_by_term["related_video"]]["score"] += $term_weight;
          }

        }
      }

      /*******************************
       * Relevant videos by keywords *
       *******************************/
      
      // Gets keywords of selected video.
      $res_keywords = mysql_query(
        sprintf(
          $q_get_keywords,
          mysql_real_escape_string($id)
        )
      );

      $keyword_weight = 8;

      // For each keyword of the current video, retrieve relevant videos.
      // I.e.: with the same keyword
      while($row_keywords = mysql_fetch_array($res_keywords)){
        $result_related_keyword = mysql_query(
          sprintf(
            $q_get_related_videos_keywords,
            mysql_real_escape_string($row_keywords['keyword']),
            mysql_real_escape_string($id)
          )
        );
        while($row_related_by_keyword = mysql_fetch_array($result_related_keyword)){
          // Add related video and its keywords to the end result
          if(
            ! array_key_exists($row_related_by_keyword['related_video'], $result) ||
            ! array_key_exists("keywords", $videos[$row_related_by_keyword['related_video']])
          ){
            $videos[$row_related_by_keyword['related_video']]["keywords"] = array(trim($row_keywords['keyword']));
          }else{
            $videos[$row_related_by_keyword['related_video']]["keywords"][] = trim($row_keywords['keyword']);
          }
          // Update score of the related video
          if( ! array_key_exists("score", $videos[$row_related_by_keyword['related_video']]) ){
            $videos[$row_related_by_keyword["related_video"]]["score"] = $keyword_weight;
          }else{
            $videos[$row_related_by_keyword["related_video"]]["score"] += $keyword_weight;
          }
        }
      }

      $result = array();
      /***********************************************
       * Add additional information about each video *
       ***********************************************/
      foreach($videos as $video=>$data){
        $res_video_detail = mysql_query(
          sprintf(
            $q_get_video_details,
            mysql_real_escape_string($video)
          )
        );
        $row_video_detail = mysql_fetch_assoc($res_video_detail);
        $videos[$video]["id"] = $video;
        $videos[$video]["key_frame"] = $row_video_detail["key_frame"];
        if(!array_key_exists($row_video_detail['time_category'], $result)){
          $res_time_detail = mysql_query(
            sprintf(
              $q_get_time_details,
              mysql_real_escape_string($row_video_detail['time_category'])
            )
          );
          $result[$row_video_detail['time_category']] = mysql_fetch_assoc($res_time_detail);
          $result[$row_video_detail['time_category']]["members"] = array($videos[$video]);
        }else{
          $result[$row_video_detail['time_category']]["members"][] = $videos[$video];
        }
      }
      ob_end_clean();
      echo json_encode($result);
    }
    break;
  case "details":
    if(isset($_GET['id'])){
      $res_details = mysql_query(
        sprintf(
          $q_get_video_details,
          mysql_real_escape_string($_GET['id'])
        )
      );
      $row_details = mysql_fetch_assoc($res_details);
      echo json_encode(
        array(
          "id"=>$row_details['id'], 
          "key_frame"=>$row_details['key_frame'],
          "time_category"=>$row_details['time_category']
        )
      );
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
