<?php

  $url = "http://www.mediauk.com/newspapers/starting-with/c";

$out[] = array();

  $input = @file_get_contents($url) or die("Could not access file: $url");
  $regexp = "<a\s[^>]*href=(\"??)([^\" >]*?)\\1[^>]*>(.*)<\/a>";
  if(preg_match_all("/$regexp/siU", $input, $matches, PREG_SET_ORDER)) {
    foreach($matches as $match) {
      // $match[2] = link address
      // $match[3] = link text
    	$address = $match[2];
    	if ((preg_match("/\/newspapers\/[0-9]/","$address")) && (!(preg_match("/starting-with/","$address")))) {
    		$newspaper_url="http://www.mediauk.com".str_replace("'","",$address);
    		$newspaper_input = @file_get_contents($newspaper_url) or die("Could not access file: $url");


    		$doc = new DOMDocument();
			$doc->loadHTML($newspaper_input);
			$xpath = new DOMXpath($doc);

			$results_pc = $xpath->query("*/meta[@property='og:postal-code']");
			$postcode = $results_pc->item(0)->getAttribute('content');
			print $postcode;
			
			//$title = $xpath->query("*/title")->item(0)->nodeValue;
			
			//$this_array = array();
			//$this_array['title'] = $title;
			//$this_array['postcode'] = $postcode;
			

			//$out[] = $this_array;
			
			//die();

    		}
    	}
  }


  echo json_encode($out);
?>