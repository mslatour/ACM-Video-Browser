function fetchVideos(callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "../api/videos.php", true);
	
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4){
      if(xhr.status == 200) {
        callback(JSON.parse(xhr.responseText));
      }else{
        //What to do..
      }
		}
	}
	xhr.send(null);
}
