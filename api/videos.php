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
$q_get_keywords = "SELECT `Keywords` FROM `Video-Keywords` WHERE `video_id` = '%s' ";
$q_get_related_videos_keywords = "SELECT `video_id` AS related_video FROM `Video-Keywords` WHERE `Keywords` = '%s' AND NOT `video_id` = '%s' AND NOT `Keywords` = '' ";

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
		$categories[$row_cat['category_id']] = array($row_cat['selected_video_weight'], $row_cat['parent']);
      }

      //Gets related videos that have matching categories.
      $related_videos = array();
      foreach ($categories as $category => $value)
      {
		$parent = $value[1];
        $result_related = mysql_query(
          sprintf(
            $q_get_related_videos,
            mysql_real_escape_string($parent),
            mysql_real_escape_string($id)
          )
        );

        while($row_related = mysql_fetch_array($result_related))
        {
			$related_videos[$row_related['related_video']][$row_related['related_category']] = $row_related['related_video_weight'];
        }
      }

	$categories_count = array();
	//$w is a constant that is used to make the weight of the selected video more important than the weight of the related videos.
	$w = 2;

	foreach($related_videos as $related_video => $value)
	{
		$score = 0;
		foreach($value as $category => $weight)
		{
			if(array_key_exists($category, $categories))
			{
			$score += ($w * $categories[$category][0]) + $weight;
			}
			else
			{
			$score += 0.5;
			}
		}
		$categories_count[$related_video] = $score;
	}

     // Gets general terms of selected video.
      $res_term = mysql_query(
        sprintf(
          $q_get_terms,
          mysql_real_escape_string($id)
        )
      );
      $terms = array();
      while($row_term = mysql_fetch_array($res_term)){
		$terms[] = $row_term['term_id'];
      }

	$related_terms = array();
	foreach ($terms as $term)
	{
        $result_related_terms = mysql_query(
          sprintf(
            $q_get_related_videos_terms,
            mysql_real_escape_string($term),
            mysql_real_escape_string($id)
          )
        );

		while($row_terms = mysql_fetch_array($result_related_terms))
		{
			if(!array_key_exists($row_terms['related_video'], $related_terms))
			{
			$related_terms[$row_terms['related_video'] ] = array($term);
			}
			else
			{
			array_push($related_terms[$row_terms['related_video'] ], $term);
			}

		}

	}

	$term_count = array();
	$term_weight = 1;
	foreach($related_term as $related_video => $value)
	{
		$term_count[$related_video] = count($value) * $term_weight;
	}

     // Gets keywords of selected video.
      $res_keywords = mysql_query(
        sprintf(
          $q_get_keywords,
          mysql_real_escape_string($id)
        )
      );
      $keywords = array();
      while($row_keywords = mysql_fetch_array($res_keyword)){
		$keywords[] = $row_keywords['Keywords'];
      }

	$related_keywords = array();
	foreach ($keywords as $keyword)
	{
        $result_related_keyword = mysql_query(
          sprintf(
            $q_get_related_videos_keywords,
            mysql_real_escape_string($keyword),
            mysql_real_escape_string($id)
          )
        );

		while($row_relatedkeyword = mysql_fetch_array($result_related_keyword))
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

	//ENDSCORE
	//$endscore contains the final score. The first loop adds the term-score with the category-score...
	$endscore = $categories_count;
	foreach($term_count as $key => $value)
		{
			$endscore[$key] += $term_count[$key];
		}
	//...while the second loop adds the keyword-score.
	foreach($keyword_count as $key => $value)
		{
			$endscore[$key] += $keyword_count[$key];
		}

	//The array with scores is sorted in reverse order, so the related video with the highest score (and thus the biggest match with the selected video) ends at the top.
	arsort($endscore);
      
      ob_end_clean();
      print_r($categories);
      echo json_encode($endscore);
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
