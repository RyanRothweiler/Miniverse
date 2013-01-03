<?php
header("Location: submitted.html");
$con = mysql_connect("localhost","minivers_ryan","keena01");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }

mysql_select_db("minivers_subscribers", $con);

$sql="INSERT INTO emails (email)
VALUES
('$_POST[email]')";

if (!mysql_query($sql,$con))
  {
  die('Error: ' . mysql_error());
  }
echo submitted.html;

mysql_close($con);
?>