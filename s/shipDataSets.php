<?php
////////////////////////////////////////////////////////////////////////////////
//
// shipDataSets.php
//
// author: Steve Chall, closely modeled on transactions.php, example code
// written by Ketan Mayer-Patel.
//
// This file creates RESTful interfaces for input into COMP426"s rest-test.html
// according to the following conventions:
//
// Create: POST http:resource.php creates a new row in the database with values
// as set in the Parameters name-value pairs.
// 
// Read all rows with year=<year>: GET resource.php?year=<year>.
//
// Read individual row with id = <id>: GET resource.php/<id>
// 
// Update: POST resource.php/<id> updates row with id = <id> to values 
//         corresponding to Parameters name-value pairs.
// 
// Delete row with id = <id>: GET resource.php/<id>?delete
//
////////////////////////////////////////////////////////////////////////////////
 
require_once("orm/ShipDataSet.php");

if ($_SERVER["REQUEST_METHOD"] == "GET") {
  if (is_null($_SERVER["PATH_INFO"])) { 
    //var_dump($_GET);
    if (!is_null($_GET["startY"])) { // READ TIME RANGE
      $startY = $_GET["startY"];

      if (!IS_NULL($_GET["startM"])) {
        $startM = $_GET["startM"];
      } else {
        header("HTTP/1.1 400 Bad Request");
        print("Read Time Range error: Invalid start month specification");
        exit();
      }

      if (!IS_NULL($_GET["startD"])) {
        $startD = $_GET["startD"];
      }
      else {
        header("HTTP/1.1 400 Bad Request");
        print("Read Time Range error: Invalid start daday specification");
        exit();
      }

      if (!IS_NULL($_GET["endY"])) {
        $endY = $_GET["endY"];
      }
      else {
        header("HTTP/1.1 400 Bad Request");
        print("Read Time Range error: Invalid end year specification");
        exit();
      }

      if (!IS_NULL($_GET["endM"])) {
        $endM = $_GET["endM"];
      }
      else {
        header("HTTP/1.1 400 Bad Request");
        print("Read Time Range error: Invalid end month specification");
        exit();
      }

      if (!IS_NULL($_GET["endD"])) {
        $endD = $_GET["endD"];
      }
      else {
        header("HTTP/1.1 400 Bad Request");
        print("Read Time Range error: Invalid end day specification");
        exit();
      }

      $shipDataSets = ShipDataSet::findByTimeRange($startY, $startM, $startD,
                                                   $endY, $endM, $endD);

      if (is_null($shipDataSets)) {
        header("HTTP/1.1 400 Bad Request");
        print("Read by Year error: illegal time range specification "
              . $year);
        exit();
      }

      $shipDataSet_json_objs = array();
      foreach ($shipDataSets as $sds) {
        $shipDataSet_json_objs[] = $sds->getJSON();
      }
      header("Content-type: application/json");
      print(json_encode($shipDataSet_json_objs));
      exit();
    } else if (!is_null($_GET["year"])) { // READ BY YEAR
      $year = $_GET["year"];
      $shipDataSets = ShipDataSet::findByYear($year);

      if (is_null($shipDataSets)) {
	header("HTTP/1.1 400 Bad Request");
	print("Read by Year error: illegal year specification " 
              . $year);
	exit();
      }

      $shipDataSet_json_objs = array();
      foreach ($shipDataSets as $sds) {
	$shipDataSet_json_objs[] = $sds->getJSON();
      }
      header("Content-type: application/json");
      print(json_encode($shipDataSet_json_objs));
      exit();
    }
  } else { // $_SERVER["PATH_INFO"]) is not NULL
    $shipDataSet_id = intval(substr($_SERVER["PATH_INFO"], 1));
    $shipDataSet = ShipDataSet::findByID($shipDataSet_id);
    
    if (is_null($shipDataSet)) {
      header("HTTP/1.1 404 Not Found");
      print("Read by id error: ShipDataSet id " . $shipDataSet_id
            . " specified either not found or not legal");
      exit();
    }
    if (is_null($_GET["delete"])) { // READ ROW
      header("Content-type: application/json");
      print(json_encode($shipDataSet->getJSON()));
      exit();
    } else { // DELETE ROW
      $shipDataSet->delete();
      header("Content-type: application/json");
      print(json_encode(true));
      exit();
    }
  }
} else if ($_SERVER["REQUEST_METHOD"] == "POST") {
  if (is_null($_SERVER["PATH_INFO"])) { // CREATE
    $shipID = intval($_POST["shipID"]);
    if ($shipID <= 0) {
      header("HTTP/1.1 400 Bad Request");
      print("Create error: shipID " . $shipID . " is illegal");
      exit();
    }

    $year = intval($_POST["year"]);
    if (   ($year < ShipDataSet::getMinYear())
        || ($year > ShipDataSet::getMaxYear())) {

      header("HTTP/1.1 400 Bad Request");
      print("Create error: year " . $year . " is illegal");
      exit();
    }
    $month = intval($_POST["month"]);
    $day = intval($_POST["day"]);
    $o2ar = floatval($_POST["o2ar"]);
    $ncp = floatval($_POST["ncp"]);
    $salinity = floatval($_POST["salinity"]);
    $temperature = floatval($_POST["temperature"]);
    $pressure = floatval($_POST["pressure"]);
    $lon = floatval($_POST["lon"]);
    $lat = floatval($_POST["lat"]);
    $o2ar = floatval($_POST["o2ar"]);
    $neto2 = floatval($_POST["neto2"]);
    $rowdate = $year . "-"
             . str_pad($month, 2, "0", STR_PAD_LEFT) . "-"
             . str_pad($day, 2, "0", STR_PAD_LEFT);

    $shipDataSet = ShipDataSet::create($o2ar, $ncp, $salinity, $temperature,
                                       $pressure, $shipID, $year, $month, $day,
                                       $lon, $lat, $neto2, $rowdate);
    if (is_null($shipDataSet)) {
      header("HTTP/1.1 400 Bad Request");
      print("Create error: ShipDataSet failed at database");
      exit();
    }

    header("Content-type: application/json");
    print(json_encode($shipDataSet->getJSON()));
    exit();
  } else { // UPDATE
    $shipDataSet_id = intval(substr($_SERVER["PATH_INFO"], 1));
    $shipDataSet = ShipDataSet::findByID($shipDataSet_id);
    if ($shipDataSet == null) {
      header("HTTP/1.1 404 Not Found");
      print("Update error: ShipDataSet id " . $shipDataSet_id
            . "specified either not found or not legal");
      exit();
    }
    
    if (!is_null($_POST["shipID"])) {
      $shipID = intval($_POST["shipID"]);
      if ($shipID <= 0) {
        header("HTTP/1.1 400 Bad Request");
        print("Update error: shipID " . $shipID . " is illegal");
        exit();
      }
      $shipDataSet->setShipID($shipID);
    }

    if (!is_null($_POST["year"])) {
      $year = intval($_POST["year"]);
      if (   ($year < ShipDataSet::getMinYear())
          || ($year > ShipDataSet::getMaxYear())) {
        header("HTTP/1.1 400 Bad Request");
        print("Update error: year " . $year . " is illegal");
        exit();
      }
      $shipDataSet->setYear($year);
    }

    // 2do: error checking for valid month and day

   if (!is_null($_POST["month"])) {
      $month = intval($_POST["month"]);
      $shipDataSet->setMonth($month);
    }

   if (!is_null($_POST["day"])) {
      $day = intval($_POST["day"]);
      $shipDataSet->setDay($day);
    }

   if (!is_null($_POST["o2ar"])) {
      $o2ar = floatval($_POST["o2ar"]);
      $shipDataSet->setO2ar($o2ar);
    }

   if (!is_null($_POST["ncp"])) {
      $ncp = floatval($_POST["ncp"]);
      $shipDataSet->setNcp($ncp);
    }

   if (!is_null($_POST["salinity"])) {
      $salinity = floatval($_POST["salinity"]);
      $shipDataSet->setSalinity($salinity);
    }

   if (!is_null($_POST["temperature"])) {
      $temperature = floatval($_POST["temperature"]);
      $shipDataSet->setTemperature($temperature);
    }

   if (!is_null($_POST["pressure"])) {
      $pressure = floatval($_POST["pressure"]);
      $shipDataSet->setPressure($pressure);
    }

   if (!is_null($_POST["lon"])) {
      $lon = floatval($_POST["lon"]);
      $shipDataSet->setLon($lon);
    }

   if (!is_null($_POST["lat"])) {
      $lat = floatval($_POST["lat"]);
      $shipDataSet->setLat($lat);
    }

   if (!is_null($_POST["neto2"])) {
      $neto2 = floatval($_POST["neto2"]);
      $shipDataSet->setNeto2($neto2);
    }

    header("Content-type: application/json");
    print(json_encode($shipDataSet->getJSON()));
    exit();
  }
}
  
header("HTTP/1.1 400 Bad Request");
print("URL did not match any known action.");
?>
