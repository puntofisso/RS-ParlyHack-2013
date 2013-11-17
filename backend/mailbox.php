<?php

$topic = $_GET['topic'];


if (($handle = fopen('scripts/emails.csv', 'r')) === false) {
    die('Error opening file');
}

$headers = fgetcsv($handle, 1024, ',');
$complete = array();

while ($row = fgetcsv($handle, 1024, ',')) {
    $complete[] = array_combine($headers, $row);
}

fclose($handle);

if (isset($_GET['topic'])) {
$out[] = array();
foreach ($complete as $element) {
	$mytopic = $element['Topic'];
	if (preg_match("/$topic/i", "$mytopic") {
		$out[] = $element;
	}
}
$complete = $out;
}
echo json_encode($complete);
?>