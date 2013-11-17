<?php

$topic = $_GET['topic'];


if (($handle = fopen('scripts/emails.csv', 'r')) === false) {
    die('Error opening file');
}

$headers = fgetcsv($handle, 1024, ',');
$headers[] = "Id";
$complete = array();
$i=0;
while ($row = fgetcsv($handle, 1024, ',')) {
	
	$row[] = $i;
	
    $complete[] = array_combine($headers, $row);
    $i++;
}

fclose($handle);

if (isset($_GET['topic'])) {
$out[] = array();
foreach ($complete as $element) {
	$mytopic = $element['Topic'];
	if (preg_match("/$topic/i", "$mytopic")) {
		$out[] = $element;
	}
}
$complete = $out;
}
echo json_encode($complete);
?>