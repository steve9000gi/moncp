<?php
////////////////////////////////////////////////////////////////////////////////
//
// ShipDataSet.php
//
// author: Steve Chall, closely modeled on Transaction.php, 
// example code written by Ketan Mayer-Patel.
//
////////////////////////////////////////////////////////////////////////////////

ini_set('memory_limit', '-1');
set_time_limit(150);

class ShipDataSet
{
  private $id;
  private $o2ar;
  private $ncp;
  private $salinity;
  private $temperature;
  private $pressure;
  private $shipID;
  private $year;
  private $month;
  private $day;
  private $lon;
  private $lat;
  private $neto2;
  private $rowdate;

  const MIN_YEAR = 1997;
  const MAX_YEAR = 2012;

  public static function getMinYear() {
    return ShipDataSet::MIN_YEAR;
  }

  public static function getMaxYear() {
    return ShipDataSet::MAX_YEAR;
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  private function getConnection() {
    $conn = new mysqli("localhost", "stevec", "J0h43x$", "moncp");
    //$conn = new mysqli("localhost", "<user>", "<password>", "moncp");
    //echo "$conn = " . $conn;

    if (mysqli_connect_errno($conn)) {
      echo "connect error number: " . mysqli_connect_errno($conn);
      echo "moncp failed to connect to MySQL: " . mysqli_connect_error();
      exit();
    }
    return $conn;
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  public static function create($o2ar, $ncp, $salinity, $temperature, $pressure,
                                $shipID, $year, $month, $day, $lon, $lat,
                                $neto2, $rowdate) {
    $mysqli = ShipDataSet::getConnection();
    $q = "INSERT INTO ShipDataSet VALUES (0, '"
       . $o2ar . "', '"
       . $ncp . "', '"
       . $salinity . "', '"
       . $temperature . "', '"
       . $pressure . "', '"
       . $shipID . "', '"
       . $year . "', '"
       . $month . "', '"
       . $day . "', '"
       . $lon . "', '"
       . $lat . "', '"
       . $neto2 . "', '"
       . $rowdate . "')";
    $result = $mysqli->query($q);
    // var_dump($q);

    if ($result) {
      $new_id = $mysqli->insert_id;
      return new ShipDataSet($new_id, $o2ar, $ncp, $salinity, $temperature,
                             $pressure, $shipID, $year, $month, $day, $lon,
                             $lat, $neto2, $rowdate);
    }
    return null;
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  public static function findByID($id) {
    $mysqli = ShipDataSet::getConnection();
    $result = $mysqli->query("SELECT * FROM ShipDataSet WHERE id = " . $id);

    if ($result) {
      if ($result->num_rows == 0){
        return null;
      }

      $ship_info = $result->fetch_array();
      return new ShipDataSet(intval($ship_info["id"]),
                             floatval($ship_info["o2ar"]),
                             floatval($ship_info["ncp"]),
                             floatval($ship_info["salinity"]),
                             floatval($ship_info["temperature"]),
                             floatval($ship_info["pressure"]),
                             intval($ship_info["shipID"]),
                             intVal($ship_info["year"]),
                             intVal($ship_info["month"]),
                             intVal($ship_info["day"]),
                             floatval($ship_info["lon"]),
                             floatval($ship_info["lat"]),
                             floatval($ship_info["neto2"]),
                             $ship_info["rowdate"]);
    }
    return null;
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  // Return an array of every ShipDataSet in the database within the indicated
  // time range.
  //
  // Return null if either year is outside valid range.
  //
  //////////////////////////////////////////////////////////////////////////////
  public static function findByTimeRange($startY, $startM, $startD, $endY,
                                         $endM, $endD) {
    if (   ($startY < ShipDataSet::getMinYear())
        || ($startY > ShipDataSet::getMaxYear())
        || ($endY < ShipDataSet::getMinYear())
        || ($endY > ShipDataSet::getMaxYear())
    ) {
      return null;
    }


    $startDate = (int)$startY . "-"
                 . str_pad((int)$startM, 2, "0", STR_PAD_LEFT) . "-"
                 . str_pad((int)$startD, 2, "0", STR_PAD_LEFT);

    $endDate = (int)$endY . "-"
                 . str_pad((int)$endM, 2, "0", STR_PAD_LEFT) . "-"
                 . str_pad((int)$endD, 2, "0", STR_PAD_LEFT);

    $q = "SELECT id FROM ShipDataSet WHERE rowdate >= '" . $startDate
           . "' AND rowdate <= '" . $endDate . "' ORDER BY id ASC;";
    $mysqli = ShipDataSet::getConnection();
//    echo($q);
    $result = $mysqli->query($q);

    $shipDataSets = array();

    if ($result) {
      $nRows = $result->num_rows;

      for ($i=1; $i<=$nRows; $i++) {
        $next_row = $result->fetch_row();
        if ($next_row) {
          $shipDataSets[] = ShipDataSet::findByID($next_row[0]);
        }
      }
    }
    return $shipDataSets;
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  // Return an array of every ShipDataSet in the database with year = $year.
  // Return null if year is outside valid range.
  //
  //////////////////////////////////////////////////////////////////////////////
  public static function findByYear($year) {
    if (   ($year < ShipDataSet::getMinYear())
        || ($year > ShipDataSet::getMaxYear())) {
      return null;
    }

    $mysqli = ShipDataSet::getConnection();
    $result = $mysqli->query("SELECT id FROM ShipDataSet WHERE year = "
                             . $year . " ORDER BY id ASC");
    $shipDataSets = array();

    if ($result) {
      $nRows = $result->num_rows;

      for ($i=1; $i<=$nRows; $i++) {
        $next_row = $result->fetch_row();
        if ($next_row) {
          $shipDataSets[] = ShipDataSet::findByID($next_row[0]);
        }
      }
    }
    return $shipDataSets;
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  private function __construct($id, $o2ar, $ncp, $salinity, $temperature, 
                               $pressure, $shipID, $year, $month, $day, $lon,
                               $lat, $neto2, $rowdate) {
    $this->id = $id;
    $this->o2ar = $o2ar;
    $this->ncp = $ncp;
    $this->salinity = $salinity;
    $this->temperature = $temperature;
    $this->pressure = $pressure;
    $this->shipID = $shipID;
    $this->year = $year;
    $this->month = $month;
    $this->day = $day;
    $this->lon = $lon;
    $this->lat = $lat;
    $this->neto2 = $neto2;
    $this->rowdate = $rowdate;
  }

  public function getID() {
    return $this->id;
  }

  public function getO2ar() {
    return $this->o2ar;
  }

  public function setO2ar($new_o2ar) {
    $this->o2ar = $new_o2ar;
    return $this->update("o2ar");
  }

  public function getNcp() {
    return $this->ncp;
  }

  public function setNcp($new_ncp) {
    $this->ncp = $new_ncp;
    return $this->update("ncp");
  }

  public function getSalinity() {
    return $this->salinity;
  }

  public function setSalinity($new_salinity) {
    $this->salinity = $new_salinity;
    return $this->update("salinity");
  }

  public function getTemperature() {
    return $this->temperature;
  }

  public function setTemperature($new_temperature) {
    $this->temperature = $new_temperature;
    return $this->update("temperature");
  }

  public function getPressure() {
    return $this->pressure;
  }

  public function setPressure($new_pressure) {
    $this->pressure = $new_pressure;
    return $this->update("pressure");
  }

  public function getShipID() {
    return $this->shipID;
  }

  public function setShipID($new_shipID) {
    $this->shipID = $new_shipID;
    return $this->update("shipID");
  }

  public function getYear() {
    return $this->year;
  }

  public function setYear($new_year) {
    $this->year = $new_year;
    return $this->update("year");
  }

  public function getMonth() {
    return $this->month;
  }

  public function setMonth($new_month) {
    $this->month = $new_month;
    return $this->update("month");
  }

  public function getDay() {
    return $this->day;
  }

  public function setDay($new_day) {
    $this->day = $new_day;
    return $this->update("day");
  }

  public function getLon() {
    return $this->lon;
  }

  public function setLon($new_lon) {
    $this->lon = $new_lon;
    return $this->update("lon");
  }

  public function getLat() {
    return $this->lat;
  }

  public function setLat($new_lat) {
    $this->lat = $new_lat;
    return $this->update("lat");
  }

  public function getNeto2() {
    return $this->neto2;
  }

  public function setNeto2($new_neto2) {
    $this->neto2 = $new_neto2;
    return $this->update("neto2");
  }

  public function getDate() {
    return $this->rowdate;
  }

  public function setDate($new_date) {
    $this->rowdate = $new_date;
    return $this->update("rowdate");
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  public function getJSON() {
    $json_rep = array();
    $json_rep["id"] = $this->id;
    $json_rep["o2ar"] = $this->o2ar;
    $json_rep["ncp"] = $this->ncp;
    $json_rep["salinity"] = $this->salinity;
    $json_rep["temperature"] = $this->temperature;
    $json_rep["pressure"] = $this->pressure;
    $json_rep["shipID"] = $this->shipID;
    $json_rep["year"] = $this->year;
    $json_rep["month"] = $this->month;
    $json_rep["day"] = $this->day;
    $json_rep["lon"] = $this->lon;
    $json_rep["lat"] = $this->lat;
    $json_rep["neto2"] = $this->neto2;
    $json_rep["rowdate"] = $this->rowdate;
    return $json_rep;
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  private function update($varName) {
    $mysqli = ShipDataSet::getConnection();
    $q = "UPDATE ShipDataSet SET " . $varName . " = " . $this->$varName
       . " WHERE id = " . $this->id;
    $result = $mysqli->query($q);
    return $result;
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  public function delete() {
    $mysqli = ShipDataSet::getConnection();
    $result = $mysqli->query("DELETE FROM ShipDataSet WHERE id = " . $this->id);
    return $result;
  }
}
?>
