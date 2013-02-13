<!DOCTYPE HTML>
<html>
<!--
////////////////////////////////////////////////////////////////////////////////
//
// realData.php
//
// Read Cassar ship data into the ShipDataSet table
// of the moncp MySQL database.
//
////////////////////////////////////////////////////////////////////////////////
-->

  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <title>Real data</title>
  </head>
  <body>
  
    <h3>Real Data 33:</h3>
<?php
require_once("orm/ShipDataSet.php");
//phpinfo();
  ini_set('memory_limit', '-1');
  set_time_limit(120);

  //////////////////////////////////////////////////////////////////////////////
  //
  // Function to read in files larger than file(...) can handle
  //
  //////////////////////////////////////////////////////////////////////////////
  function readBigFile($path, $ra) {
    $handle = @fopen($path, "r"); 
    if ($handle) { 
      while (!feof($handle)) { 
        $ra[] = fgets($handle, 4096); 
        } 
      fclose($handle); 
    } 
  }

  $o2ar = array();
  $crsID = array();
  $lat = array();
  $mn = array();
  $salt = array();
  $yr = array();
  $lon = array();
  $temp = array();
  $pres = array();
  $dy = array();
  $ncp = array();
  $neto2 = array();
  $rowdate = array();

  readBigFile("/var/www/html/moncp/s/data/stO2ar.txt", &$o2ar);
  readBigFile("/var/www/html/moncp/s/data/stCrsID.txt", &$crsID);
  readBigFile("/var/www/html/moncp/s/data/stMn.txt", &$mn);
  readBigFile("/var/www/html/moncp/s/data/stSalt.txt", &$salt);
  readBigFile("/var/www/html/moncp/s/data/stYr.txt", &$yr);
  readBigFile("/var/www/html/moncp/s/data/stLon.txt", &$lon);
  readBigFile("/var/www/html/moncp/s/data/stLat.txt", &$lat);
  readBigFile("/var/www/html/moncp/s/data/stTemp.txt", &$temp);
  readBigFile("/var/www/html/moncp/s/data/stPres.txt", &$pres);
  readBigFile("/var/www/html/moncp/s/data/stDy.txt", &$dy);
  readBigFile("/var/www/html/moncp/s/data/stNcp.txt", &$ncp);
  readBigFile("/var/www/html/moncp/s/data/stNeto2.txt", &$neto2);

//var_dump($o2ar);

  //for ($i = 0; $i < 1000; $i++) {
  //for ($i = 1000; $i < 2000; $i++) {
  //for ($i = 2000; $i < 3000; $i++) {
  //for ($i = 3000; $i < 10000; $i++) {
  //for ($i = 0; $i < 300000; $i++) {
  for ($i = 0; $i < 689566; $i++) {
    if ($i % 40) {
      continue;
    }
    //print("<p>" . $i . "</p>");
    //print("<p>" . "neto2[" . $i . "]: " . (float)$neto2[$i] . "</p>");
    $rowdate[$i] = (int)$yr[$i] . "-"
                 . str_pad((int)$mn[$i], 2, "0", STR_PAD_LEFT) . "-"
                 . str_pad((int)$dy[$i], 2, "0", STR_PAD_LEFT);
    //var_dump($rowdate[$i]);
    $s = ShipDataSet::create((float)$o2ar[$i],
                             (float)$ncp[$i],
                             (float)$salt[$i],
                             (float)$temp[$i],
                             (float)$pres[$i],
                             (int)$crsID[$i],
                             (int)$yr[$i],
                             (int)$mn[$i],
                             (int)$dy[$i],
                             (float)$lon[$i],
                             (float)$lat[$i],
                             (float)$neto2[$i],
                             $rowdate[$i]);
/**/
    print("<div>");
    var_dump($s);
    print("</div><br>");
/**/
  }
  print("<p>done.</p>");
?>
  </body>
</html>
