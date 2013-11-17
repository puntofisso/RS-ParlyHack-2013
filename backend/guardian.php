<?php

$topic = $_GET['topic'];
$fromdate = $_GET['fromdate']; // yyyy-mm-dd
$todate = $_GET['todate'];
$apikey = "zyret6heyhfegfdmnbf38vmp";

$url = "http://content.guardianapis.com/search?q=".$topic."+and+investment&from-date=".$fromdate."&to-date=".$todate."&page-size=50&&api-key=".$apikey;

$json = json_decode(file_get_contents($url),30);

$titleaggr = "";
foreach($json['response']['results'] as $article) {
	$articleurl = $article['webUrl'];
	$title = $article['webTitle'];
	$titleaggr = $titleaggr . " " . $title;
}

echo $titleaggr;
?>