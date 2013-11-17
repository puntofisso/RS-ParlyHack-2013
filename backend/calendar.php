<?php
// accepts optional argument $_GET['date']

// Harvest Hansard Calendar
$url = "http://services.parliament.uk/calendar/all.rss";
$calendar = file_get_contents($url);
$topics = array("Arts and culture","Borders and immigration","Business and enterprise","Children and young people","Climate change","Community and society","Consumer rights and issues","Crime and policing","Defence and armed forces","Employment","Energy","Environment","Equality, rights and citizenship","Europe","Financial services","Food and farming","Foreign affairs","Further education and skills","Government efficiency, transparency and accountability","Government spending","Higher education","Housing","International aid and development","Law and the justice system","Local government","Media and communications","National Health Service","National security","Northern Ireland","Pensions and ageing society","Planning and building","Public health","Public safety and emergencies","Regulation reform","Rural and countryside","Schools","Science and innovation","Scottish referendum","Social care","Sports and leisure","Tax and revenue","Trade and investment","Transport","UK economy","Wales","Welfare","Wildlife and animal welfare");

$calais_key = "w9b65dq46zucz6v7kdnuvnph";

$doc = new DOMDocument();
$doc->loadXML($calendar);

$items = $doc->getElementsByTagName('item');

$out=array();
foreach ($items as $item) {
	$event = $item->getElementsByTagName('event');
	$subject = $event->item(0)->getElementsByTagName('subject')->item(0)->nodeValue;
	$date = $event->item(0)->getElementsByTagName('date')->item(0)->nodeValue;

	if (isset($_GET['date']))
		if ($date!=$_GET['date'])
			continue;

	$startTime = $event->item(0)->getElementsByTagName('startTime')->item(0)->nodeValue;
	$house = $event->item(0)->getElementsByTagName('house')->item(0)->nodeValue;
	$chamber = $event->item(0)->getElementsByTagName('chamber')->item(0)->nodeValue;

	$thisarray = array();
	$thisarray['date'] = $date;
	$thisarray['subject'] = $subject;
	$thisarray['startTime'] = $startTime;
	$thisarray['house'] = $house;
	$thisarray['chamber'] = $chamber;
	$rand_keys = array_rand($topics, 4);
	
	$thisarray['topics'][0] = $topics[$rand_keys[0]];
	$thisarray['topics'][1] = $topics[$rand_keys[1]];
	$thisarray['topics'][2] = $topics[$rand_keys[2]];
	$thisarray['topics'][3] = $topics[$rand_keys[3]];


	// Call to Open Calais
	// Content and input/output formats
	$content = $subject;
	
	$restURL = "http://api.opencalais.com/enlighten/rest/";
	$paramsXML = "<c:params xmlns:c=\"http://s.opencalais.com/1/pred/\"". 
				 "xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\">".
				 "<c:processingDirectives c:contentType=\"text/raw\"".
				 "c:enableMetadataType=\"GenericRelations\"".
				 "c:outputFormat=\"text/simple\"". 
				 "c:docRDFaccesible=\"true\" >".
				 "</c:processingDirectives>".
				 "<c:userDirectives c:allowDistribution=\"true\" c:allowSearch=\"true\"".
				 "c:externalID=\"17cabs901\"". 
				 "c:submitter=\"ABC\">".
				 "</c:userDirectives><c:externalMetadata></c:externalMetadata></c:params>";

	// Construct the POST data string
	$data = "licenseID=".urlencode($calais_key);
	$data .= "&paramsXML=".urlencode($paramsXML);
	$data .= "&content=".urlencode($content); 

	// Invoke the Web service via HTTP POST
 	//$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $restURL);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_TIMEOUT, 60);
	//$response = curl_exec($ch);
	curl_close($ch);

	
	
	

	$out[] = $thisarray;
}

echo json_encode($out);


?>
