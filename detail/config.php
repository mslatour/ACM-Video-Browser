<?php
// Connection's Parameters, set your sql settings here
$db_host="localhost";
$db_name="ACM-SigMM";
$username="acm";
$password="video";
$db_con=mysql_connect($db_host,$username,$password);
$connection_string=mysql_select_db($db_name);
// Connection use these to connect in the php of the actual page you want to access db's with
//mysql_connect($db_host,$username,$password);
//mysql_select_db($db_name);
?>
