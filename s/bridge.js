////////////////////////////////////////////////////////////////////////////////
// 
// bridge.js
//
// Measurement of Net Community Production (MoNCP) of the World's Oceans:
//
// A web application that supports the viewing and analysis of data generated by
// the Nicolas Cassar Laboratory of Duke University's Nicholas School of the
// Environment.  From http://www.nicholas.duke.edu/people/faculty/cassar/: "Our
// research focuses on environmental biogeochemistry and physiology, with the
// objective of constraining the mechanisms governing carbon cycling and
// climate."
//
// Web application author:
//   Steve Chall, Renaissance Computing Institute: stevec@renci.org
//
// This file contains functions to move data back and forth between client and
// server.
//
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var getShipDataSetsByTimeRange = function(startY, startM, startD, endY, endM,
                                          endD) {
  var ajax_url =
    "http://etta.renci.duke.edu/moncp/s/shipDataSets.php";

  ajax_url += "?startY=" + startY + "&startM=" + startM + "&startD=" + startD
            + "&endY=" + endY + "&endM=" + endM + "&endD=" + endD;
  var data_pairs = {};

  var settings = {
      type: "GET",
      data: data_pairs,
      success: getShipDataSets_success_handler,
      error: ajax_error_handler,
      cache: false
  };

  $.ajax(ajax_url, settings);
  window.status = "Retreiving requested ship data from database...";
  document.body.style.cursor = "wait";

  if (typeof(OpenLayers) != "undefined") {
    OpenLayers.Element.addClass(ShipDataSet.map.viewPortDiv, "olCursorWait");
  }
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var getShipDataSetsByYear = function(year) {
  var ajax_url = 
    "http://etta.renci.duke.edu/moncp/s/shipDataSets.php";

  ajax_url += "?year=" + year;

  var data_pairs = {};

  var settings = {
      type: "GET",
      data: data_pairs,
      success: getShipDataSets_success_handler,
      error: ajax_error_handler,
      cache: false
  };

  $.ajax(ajax_url, settings);
  window.status = "Retreiving requested ship data from database...";
  document.body.style.cursor = "wait";
  
  if (typeof(OpenLayers) != "undefined") {
    OpenLayers.Element.addClass(ShipDataSet.map.viewPortDiv, "olCursorWait");
  }
}

////////////////////////////////////////////////////////////////////////////////
//
// http://www.electrictoolbox.com/pad-number-zeroes-javascript/
//
////////////////////////////////////////////////////////////////////////////////
function pad(number, length) {
  var str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }
 
  return str;
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var rangeString = function() {
  return ShipDataSet.startYear + "/"
      + pad(ShipDataSet.startMonth, 2) + "/"
      + pad(ShipDataSet.startDay, 2) + "-"
      + ShipDataSet.endYear + "/"
      + pad(ShipDataSet.endMonth, 2) + "/"
      + pad(ShipDataSet.endDay, 2);
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var displaySelectedShipData = function(shipData) {
  $('#returnText').html(ShipDataSet.all.length
                        + " data point"
                        + ((ShipDataSet.all.length != 1) ? "s" : "")
                        + " outgoing");
  $('#returnStatus').html(shipData.length
                          + " point"
                          + ((shipData.length != 1) ? "s " : " ")
                          + "returned for "
                          + rangeString());

  buildShipDataSetArray(shipData);

  if (!ShipDataSet.map) { // then this is not being called from moncp.html
    if (typeof $("#viewShipDataDropdown") === 'undefined') {
      console.log("displaySelectedShipData(...): \$(\"#viewShipDataDropdown\") "
          + "undefined");
    } else { // called from newshipdata.html
      $("#viewShipDataDropdown")[0].selectedIndex = ShipDataSet.selectedIndex;
      add_ViewOrChangeShipData_ShipDataSetDropdownItems();
      populate_ViewOrChangeShipData_inputFields();
    }
  } else {
    if (ShipDataSet.map.layers.length > 2) {
      ShipDataSet.selectControl.destroy();
      ShipDataSet.map.layers[2].destroy();
    }

    var plateCaree = new OpenLayers.Projection("EPSG:4326");
    addShipDataPoints(ShipDataSet.map, plateCaree);
    OpenLayers.Element.removeClass(ShipDataSet.map.viewPortDiv, "olCursorWait");
  }

  window.status = "Done";
  document.body.style.cursor = "default";
}

////////////////////////////////////////////////////////////////////////////////
//
// Assume this function is an AJAX call as a result of success in getting a 
// selected subset of the ShipDataSet table.  Extract that ShipDataSet data
// (included in the jqXHR input parameter) into variable shipData, convert that
// into a fresh new ShipDataSet.all array, and update the data points in
// moncp.html accordingly.
//
////////////////////////////////////////////////////////////////////////////////
var getShipDataSets_success_handler = function(data, textStatus, jqXHR) {
  ShipDataSet.shipData = $.parseJSON(jqXHR.responseText);

  if ((ShipDataSet.map) && (ShipDataSet.shipData.length > 5000)) {
    cancelDisplayDialog(ShipDataSet.shipData.length);
  } else {
    displaySelectedShipData(ShipDataSet.shipData);
  }
}

////////////////////////////////////////////////////////////////////////////////
// 
// Something went wrong.
//
////////////////////////////////////////////////////////////////////////////////
var ajax_error_handler = function(jqXHR, textStatus, errorThown) {
  $('#returnStatus').html(jqXHR.status);
  $('#returnText').html(jqXHR.responseText);
  window.status = "Done";
  document.body.style.cursor = "default";
}

////////////////////////////////////////////////////////////////////////////////
//
// Empty out the ShipDataSet.all array and repopulate it with objects whose
// values correspond to those in the shipData JSON expression.
//
////////////////////////////////////////////////////////////////////////////////
var buildShipDataSetArray = function(shipData) {
  ShipDataSet.all.splice(0, ShipDataSet.all.length);

  for (var i = 0; i < shipData.length; i++) {
    ShipDataSet.all.push(new ShipDataSet(
        parseInt(shipData[i]["id"]),
        parseFloat(shipData[i]["o2ar"]),
        parseFloat(shipData[i]["ncp"]),
        parseFloat(shipData[i]["salinity"]),
        parseFloat(shipData[i]["temperature"]),
        parseFloat(shipData[i]["pressure"]),
        parseInt(shipData[i]["shipID"]),
        parseInt(shipData[i]["year"]),
        parseInt(shipData[i]["month"]),
        parseInt(shipData[i]["day"]),
        parseFloat(shipData[i]["lon"]),
        parseFloat(shipData[i]["lat"]),
        parseFloat(shipData[i]["neto2"])
    ));
  }
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var insertShipDataSet = function() {
  var ajax_url = "http://etta.renci.duke.edu/moncp/s/shipDataSets.php";

  var rowdate = parseInt($("#year").val()) + "-"
           + pad(parseInt($("#month").val()), 2) + "-"
           + pad(parseInt($("#day").val()), 2);

  var data_pairs = {
    "o2ar": parseFloat($("#o2ar").val()), 
    "ncp": parseFloat($("#ncp").val()),
    "salinity": parseFloat($("#sal").val()),
    "temperature": parseFloat($("#temp").val()),
    "pressure": parseFloat($("#press").val()),
    "year": parseInt($("#year").val()),
    "month": parseInt($("#month").val()),
    "day": parseInt($("#day").val()),
    "shipID": parseInt($("#cruiseID").val()),
    "lat": parseFloat($("#lat").val()),
    "lon": parseFloat($("#lon").val()),
    "neto2": parseFloat($("#neto2").val()),
    "rowdate": rowdate
  };

  var settings = {
      type: "POST",
      data: data_pairs,
      success: cudShipDataSet_success_handler,
      error: ajax_error_handler,
      cache: false
  };

  $.ajax(ajax_url, settings);
};

////////////////////////////////////////////////////////////////////////////////
//
// Works for Create, Update, and Delete (hence cud).
//
// Make sure the ShipDataSet.all array is up to date after the completion of
// whatever call triggered this function invocation.
//
////////////////////////////////////////////////////////////////////////////////
var cudShipDataSet_success_handler = function(data, textStatus, jqXHR) {
  getShipDataSetsByTimeRange(ShipDataSet.startYear, ShipDataSet.startMonth,
                             ShipDataSet.startDay, ShipDataSet.endYear,
                             ShipDataSet.endMonth, ShipDataSet.endDay);

  if (typeof $("#viewShipDataDropdown") != 'undefined') {
    $("#viewShipDataDropdown")[0].selectedIndex = ShipDataSet.selectedIndex;
  }

  if ($("#viewShipDataDropdown")[0].length === 0 ) {
    $("#cruiseID2")[0].value = "";
    $("#year2")[0].value = "";
    $("#month2")[0].value = "";
    $("#day2")[0].value = "";
    $("#lon2")[0].value = "";
    $("#lat2")[0].value = "";
    $("#o2ar2")[0].value = "";
    $("#ncp2")[0].value = "";
    $("#sal2")[0].value = "";
    $("#temp2")[0].value = "";
    $("#press2")[0].value = "";
    $("#neto2_2")[0].value = "";
  }
}

////////////////////////////////////////////////////////////////////////////////
//
// Event handler that modifies the currently selected ShipDataSet according to
// the values in the "View or Change Ship Data" group box when the user clicks
// on the "Save Changed Values" button.
//
////////////////////////////////////////////////////////////////////////////////
var updateShipDataSet = function() {
  if ($("#viewShipDataDropdown")[0].length === 0 ) {
    alert("Can't update: no data point available.");
    return;
  }

  var ajax_url =
    "http://etta.renci.duke.edu/moncp/s/shipDataSets.php/"
    + ShipDataSet.all[$("#viewShipDataDropdown")[0].selectedIndex].id;

  var data_pairs = {
    "o2ar": parseFloat($("#o2ar2").val()),
    "ncp": parseFloat($("#ncp2").val()),
    "salinity": parseFloat($("#sal2").val()),
    "temperature": parseFloat($("#temp2").val()),
    "pressure": parseFloat($("#press2").val()),
    "year": parseInt($("#year2").val()),
    "month": parseInt($("#month2").val()),
    "day": parseInt($("#day2").val()),
    "shipID": parseInt($("#cruiseID2").val()),
    "lat": parseFloat($("#lat2").val()),
    "lon": parseFloat($("#lon2").val()),
    "neto2": parseFloat($("#neto2_2").val())
  };

  var settings = {
      type: "POST",
      data: data_pairs,
      success: cudShipDataSet_success_handler,
      error: ajax_error_handler,
      cache: false
  };

  if (typeof $("#viewShipDataDropdown") != 'undefined') {
    ShipDataSet.selectedIndex = $("#viewShipDataDropdown")[0].selectedIndex;
  }

  $.ajax(ajax_url, settings);
};

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var deleteShipDataSet = function() {
  var ajax_url =
    "http://etta.renci.duke.edu/moncp/s/shipDataSets.php/"
    + ShipDataSet.all[$("#viewShipDataDropdown")[0].selectedIndex].id
    + "?delete";

  var data_pairs = {};

  var settings = {
      type: "GET",
      data: data_pairs,
      success: cudShipDataSet_success_handler,
      error: ajax_error_handler,
      cache: false
  };
 
  ShipDataSet.selectedIndex = 0;

  $.ajax(ajax_url, settings);
};

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var getAllShips = function() {
  var ajax_url =
    "http://etta.renci.duke.edu/moncp/s/ships.php";

  var data_pairs = {};

  var settings = {
      type: "GET",
      data: data_pairs,
      success: getAllShips_success_handler,
      error: ajax_error_handler,
      cache: false
  };

  $.ajax(ajax_url, settings);
};

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var getAllShips_success_handler = function(data, textStatus, jqXHR) {
  var sData = $.parseJSON(jqXHR.responseText);

  Ship.all.splice(0, Ship.all.length);

  for (var i = 0; i < sData.length; i++) {
    Ship.all.push(new Ship(sData[i]["id"],
                           sData[i]["name"],
                           sData[i]["affiliationID"]));
  }

  if (typeof $("#shipDropdown") === 'undefined') {
    console.log("\$(\"#shipDropdown\") undefined");
  } else {
    add_NewShipData_ShipDropdownItems();
    add_ViewOrChangeShipData_ShipDropdownItems();
  }
}

////////////////////////////////////////////////////////////////////////////////
//
// Instantiate a Ship object with the values currently displayed in the "New
// Ship" group box.
// 
////////////////////////////////////////////////////////////////////////////////
var createShip = function() {
  var ajax_url =
    "http://etta.renci.duke.edu/moncp/s/ships.php";

  var data_pairs = {
    "name": $("#shipName").val(),
    "affiliationID": parseInt($("#affiliation").val())
  };

  var settings = {
      type: "POST",
      data: data_pairs,
      success: createShip_success_handler,
      error: ajax_error_handler,
      cache: false
  };

  $.ajax(ajax_url, settings);
}

////////////////////////////////////////////////////////////////////////////////
//
// Add the new ship to the Ship dropdown menus.
//
////////////////////////////////////////////////////////////////////////////////
var createShip_success_handler = function(data, textStatus, jqXHR) {
  var sData = $.parseJSON(jqXHR.responseText);

  if (typeof $("#shipDropdown") === 'undefined') {
    console.log("\$(\"#shipDropdown\") undefined");
  } else {
    getAllShips();
    add_NewShipData_ShipDropdownItems();
    add_ViewOrChangeShipData_ShipDropdownItems();
  }
}
