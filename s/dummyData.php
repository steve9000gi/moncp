<!DOCTYPE HTML>
<html>
<!--
////////////////////////////////////////////////////////////////////////////////
//
// dummyData.php
//
// Generate some fake ShipDataSets and insert them into the ShipDataSet table
// of the comp42625db MySQL database.
//
////////////////////////////////////////////////////////////////////////////////
-->

  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <title>Dummy data</title>
  </head>
  <body>
  
    <h3>Dummy Data 11:</h3>
<?php
require_once("orm/ShipDataSet.php");
phpinfo();
  //////////////////////////////////////////////////////////////////////////////
  //
  // Return a random float value r such that min <= r <= max.
  //
  //////////////////////////////////////////////////////////////////////////////
  function randFloat($min, $max) {
    $factor = 10000;
    return mt_rand($min * $factor, $max * $factor) / $factor;
  }

  $O2AR_MIN = -2.0;
  $O2AR_MAX = 9.0;
  $NCP_MIN = -180.0;
  $NCP_MAX = 180.0;
  $SAL_MIN = 33.0;
  $SAL_MAX = 37.0;
  $TEMP_MIN = -2.0;         // degrees C.
  $TEMP_MAX = 29.0;
  $PRESSURE_MIN = 99.0;     // millibars
  $PRESSURE_MAX = 1003.0;

  for ($i = 0; $i < 1000; $i++) {
    print("<p>" . $i . "</p>");
    $o2ar = randFloat(0, $O2AR_MAX - $O2AR_MIN) + $O2AR_MIN;
    $ncp = randFloat(0, $NCP_MAX - $NCP_MIN) + $NCP_MIN;
    $salinity = randFloat($SAL_MIN, $SAL_MAX);
    $temperature = randFloat(0, $TEMP_MAX - $TEMP_MIN) + $TEMP_MIN;
    $pressure = randFloat(0, $PRESSURE_MAX - $PRESSURE_MIN) + $PRESSURE_MIN;
    $shipID = mt_rand(0, 6);
    $dateTime = mt_rand(ShipDataSet::getMinYear(), ShipDataSet::getMaxYear());
    $lon = 360 *  randFloat(0,1) - 180;
    $lat = -90 * randFloat(0, 1);

    $s = ShipDataSet::create($o2ar, $ncp, $salinity, $temperature, $pressure,
                                $shipID, $dateTime, $lon, $lat);

    print("<div>");
    var_dump($s);
    print("</div>");

  }
?>
  </body>
</html>
