<?php
/**
To add this user to the database:
CREATE USER 'acm'@'localhost' IDENTIFIED BY 'video';
GRANT ALL PRIVILEGES ON `ACM-SigMM`.* TO 'acm'@'localhost'
*/
$DB_USER = "acm";
$DB_PASSWORD = "video";
$DB_DATABASE = "ACM-SigMM";
$DB_HOST = "localhost";

mysql_connect($DB_HOST,$DB_USER,$DB_PASSWORD) or die("Something went wrong");
mysql_select_db($DB_DATABASE);

?>
