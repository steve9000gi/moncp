////////////////////////////////////////////////////////////////////////////////
//
//  moncp.js
//
//  Measurement of Net Community Production (MoNCP) of the World's Oceans:
//
//  A web application that supports the viewing and analysis of data generated
//  by the Nicolas Cassar Laboratory of Duke University's Nicholas School of the
//  Environment.  From http://www.nicholas.duke.edu/people/faculty/cassar/: "Our
//  research focuses on environmental biogeochemistry and physiology, with the
//  objective of constraining the mechanisms governing carbon cycling and
//  climate."
//
//  Web application author:
//    Steve Chall, Renaissance Computing Institute:  stevec@renci.org
//
////////////////////////////////////////////////////////////////////////////////

$(document).ready(function() {
  addOuterElements();
  addReturnText();
  //addLoginControls();
  addColorMaps();
  buildGetRGBFromLinearValueArray();
  addColorMapSelectionOverlay();
  addTimelineSliderTable();
  addMap();
  addNewShipDataControls();
  addCancelDisplayDialog();
  addVisButton();
  addMapSizeControl();
  buildShipDataDropdown();
  buildSatelliteDataDropdown();
  addCassarLink();
  addContact();
  addLogos();
  setupEventHandlers();
  drawColorMap("#shipDataColorMap", ShipDataSet.shipDataColorMapIx);
  drawColorMap("#satDataColorMap", ShipDataSet.satDataColorMapIx);
})

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var setupEventHandlers = function() {
  $("#shipDropdown").on("change", onSelectShipDataVariable);
  $("#satelliteDropdown").on("change", onSelectSatelliteDataVariable);
  $("#newShipDataButton").on("click", openNewShipData);
  $("#shipColorMapMin").on("change", updateVarMin);
  $("#shipColorMapMax").on("change", updateVarMax);
  $("#getShipDataButton").on("click", getShipData);
  $("#shipDataColorMap").on("click", selectColorMap);
  $("#satDataColorMap").on("click", selectColorMap);
  $("#selectRainbowRow").on("click", onSelectRainbowRow);
  $("#selectGrayScaleRow").on("click", onSelectGrayScaleRow);
  $("#selectHeatedBodyRow").on("click", onSelectHeatedBodyRow);
  $("#selectCIEBlueRedRow").on("click", onSelectCIEBlueRedRow);
  $("#mapSzCtrl").on("change", onSelectMapSize);
  $("#hideButton").on("click", hideOverlay);
  $(window).resize(function() {
     updateMapSize();
  });
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var onSelectRainbowRow = function(e) {
  if (ShipDataSet.dataSourceIx == 0) {
    ShipDataSet.shipDataColorMapIx = 0;
  } else if (ShipDataSet.dataSourceIx == 1) {
    ShipDataSet.satDataColorMapIx = 0;
  } else {
    alert("onSelectRainbowRow: unknown data source");
  }
  
  highlightColorMapByDataSource(ShipDataSet.dataSourceIx);
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var onSelectGrayScaleRow = function(e) {
  if (ShipDataSet.dataSourceIx == 0) {
    ShipDataSet.shipDataColorMapIx = 1;
  } else if (ShipDataSet.dataSourceIx == 1) {
    ShipDataSet.satDataColorMapIx = 1;
  } else {
    alert("onSelectGrayscaleRow: unknown data source");
  }
  
  highlightColorMapByDataSource(ShipDataSet.dataSourceIx);
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var onSelectHeatedBodyRow = function(e) {
  if (ShipDataSet.dataSourceIx == 0) {
    ShipDataSet.shipDataColorMapIx = 2;
  } else if (ShipDataSet.dataSourceIx == 1) {
    ShipDataSet.satDataColorMapIx = 2;
  } else {
    alert("onSelectHeatedBodyRow: unknown data source");
  }
  
  highlightColorMapByDataSource(ShipDataSet.dataSourceIx);
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var onSelectCIEBlueRedRow = function(e) {
  if (ShipDataSet.dataSourceIx == 0) {
    ShipDataSet.shipDataColorMapIx = 3;
  } else if (ShipDataSet.dataSourceIx == 1) {
    ShipDataSet.satDataColorMapIx = 3;
  } else {
    alert("onSelectCIEBlueRedRow: unknown data source");
  }
  
  highlightColorMapByDataSource(ShipDataSet.dataSourceIx);
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var addColorMapSelectionOverlay = function() {
  $("body").append("<div id = 'overlay' class = 'groupBox draggable = 'true'>"
      + "</div>");
  $("#overlay").draggable();
  $("#overlay").append("<h3 id = 'clrMapSelect'>Select Color Map"
      + "</h3>"); 
  $("#overlay").append("<table id = 'colorMapSelectTable' class = centeredElt>"
      + "</table>");
  addRainbowToOverlay();
  addGrayScaleToOverlay();
  addHeatedBodyToOverlay();
  addCIEBlueRedToOverlay();
  $("#overlay").append("<input type = 'button' value = 'Done' onclick = "
      + "'hideOverlay' id = 'hideButton'>");
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var addRainbowToOverlay = function() {
  $("#colorMapSelectTable").append("<tr id = 'selectRainbowRow'></tr>");
  $("#selectRainbowRow").append("<td><p id = 'p0'>Rainbow:</p></td>");
  $("#selectRainbowRow").append("<td id = 'rainbowElt'></td>");
  $("#rainbowElt").append("<canvas id = 'selectRainbowColorMap' class = "
      + "'clrMap clrMapSelect' width = '95' height = '19' title = "
      + "'Click to select'></canvas>");
  drawColorMap("#selectRainbowColorMap", 0);
  $("#selectRainbowRow").append("<td></td>");
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var addGrayScaleToOverlay = function() {
  $("#colorMapSelectTable").append("<tr id = 'selectGrayScaleRow'></tr>");
  $("#selectGrayScaleRow").append("<td><p id = 'p1'>Grayscale:</p></td>");
  $("#selectGrayScaleRow").append("<td id = 'grayScaleElt'></td>");
  $("#grayScaleElt").append("<canvas id = 'selectGrayScaleColorMap' class = "
      + "'clrMap clrMapSelect' width = '95' height = '19' title = "
      + "'Click to select'></canvas>");
  drawColorMap("#selectGrayScaleColorMap", 1);
  $("#selectGrayScaleRow").append("<td></td>");
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var addHeatedBodyToOverlay = function() {
  $("#colorMapSelectTable").append("<tr id = 'selectHeatedBodyRow'></tr>");
  $("#selectHeatedBodyRow").append("<td><p id = 'p2'>Black body:</p></td>");
  $("#selectHeatedBodyRow").append("<td id = 'heatedBodyElt'></td>");
  $("#heatedBodyElt").append("<canvas id = 'selectHeatedBodyColorMap' class = "
      + "'clrMap clrMapSelect' width = '95' height = '19' title = "
      + "'Click to select'></canvas>");
  drawColorMap ("#selectHeatedBodyColorMap", 2);
  $("#selectHeatedBodyRow").append("<td></td>");
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var addCIEBlueRedToOverlay = function() {
  $("#colorMapSelectTable").append("<tr id = 'selectCIEBlueRedRow'></tr>");
  $("#selectCIEBlueRedRow").append("<td><p id = 'p3'>Blue-red:</p></td>");
  $("#selectCIEBlueRedRow").append("<td id = 'CIEBlueRedElt'></td>");
  $("#CIEBlueRedElt").append("<canvas id = 'selectCIEBlueRedColorMap' class = "
      + "'clrMap clrMapSelect' width = '95' height = '19' title = "
      + "'Click to select'></canvas>");
  drawColorMap ("#selectCIEBlueRedColorMap", 3);
  $("#selectCIEBlueRedRow").append("<td></td>");
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var highlightColorMapByIndex = function(colorMapIx) {
  switch (colorMapIx) {
    case 0:
      $("#selectRainbowColorMap").css(   {"border-width": "3px",
                                          "margin": "0px"});
      $("#selectGrayScaleColorMap").css( {"border-width": "1px",
                                          "margin": "2px"});
      $("#selectHeatedBodyColorMap").css({"border-width": "1px",
                                          "margin": "2px"});
      $("#selectCIEBlueRedColorMap").css({"border-width": "1px",
                                          "margin": "2px"});
      $("#p0").css({"font-weight": "bold",
                    "text-shadow": "2px 2px #ffffff"});
      $("#p1").css({"font-weight": "normal",
                    "text-shadow": "none"});
      $("#p2").css({"font-weight": "normal",
                    "text-shadow": "none"});
      $("#p3").css({"font-weight": "normal",
                    "text-shadow": "none"});
      break;
    case 1:
      $("#selectRainbowColorMap").css(   {"border-width": "1px",
                                          "margin": "2px"});
      $("#selectGrayScaleColorMap").css( {"border-width": "3px",
                                          "margin": "0px"});
      $("#selectHeatedBodyColorMap").css({"border-width": "1px",
                                          "margin": "2px"});
      $("#selectCIEBlueRedColorMap").css({"border-width": "1px",
                                          "margin": "2px"});
      $("#p0").css({"font-weight": "normal",
                    "text-shadow": "none"});
      $("#p1").css({"font-weight": "bold",
                    "text-shadow": "2px 2px #ffffff"});
      $("#p2").css({"font-weight": "normal",
                    "text-shadow": "none"});
      $("#p3").css({"font-weight": "normal",
                    "text-shadow": "none"});
      break;
    case 2:
      $("#selectRainbowColorMap").css(   {"border-width": "1px",
                                          "margin": "2px"});
      $("#selectGrayScaleColorMap").css( {"border-width": "1px",
                                          "margin": "2px"});
      $("#selectHeatedBodyColorMap").css({"border-width": "3px",
                                          "margin": "0px"});
      $("#selectCIEBlueRedColorMap").css({"border-width": "1px",
                                          "margin": "2px"});
      $("#p0").css({"font-weight": "normal",
                    "text-shadow": "none"});
      $("#p1").css({"font-weight": "normal",
                    "text-shadow": "none"});
      $("#p2").css({"font-weight": "bold",
                    "text-shadow": "2px 2px #ffffff"});
      $("#p3").css({"font-weight": "normal",
                    "text-shadow": "none"});
      break;
    case 3:
      $("#selectRainbowColorMap").css(   {"border-width": "1px",
                                          "margin": "2px"});
      $("#selectGrayScaleColorMap").css( {"border-width": "1px",
                                          "margin": "2px"});
      $("#selectHeatedBodyColorMap").css({"border-width": "1px",
                                          "margin": "2px"});
      $("#selectCIEBlueRedColorMap").css({"border-width": "3px",
                                          "margin": "0px"});
      $("#p0").css({"font-weight": "normal",
                    "text-shadow": "none"});
      $("#p1").css({"font-weight": "normal",
                    "text-shadow": "none"});
      $("#p2").css({"font-weight": "normal",
                    "text-shadow": "none"});
      $("#p3").css({"font-weight": "bold",
                    "text-shadow": "2px 2px #ffffff"});
      break;
    default:
      alert("highlightColorMapByIndex: invalid index");
  }
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var highlightColorMapByDataSource = function(dataSourceIx) {
  if (dataSourceIx == 0) { // ship
    highlightColorMapByIndex(ShipDataSet.shipDataColorMapIx)
  } else if (dataSourceIx == 1) { // satellite
    highlightColorMapByIndex(ShipDataSet.satDataColorMapIx);
  } else {
    alert("highlightColorMapByDataSource: unknown data source index");
  }
}

////////////////////////////////////////////////////////////////////////////////
//
// Event handler in response to user clicking on one of the color maps. Brings'
// up the "Select <x> Data Color Map" overlay, where <x> is either the Ship or 
// Satellite color map the user has clicked on.
// 
////////////////////////////////////////////////////////////////////////////////
var selectColorMap = function(e) {
  $("#overlay")[0].style.display = "block";
  //$("#overlay").modal({"overlayID": "overlay"});

  if (this.attributes["id"].value == "shipDataColorMap") {
    $("#clrMapSelect").text("Select Ship Data Color Map"); 
    ShipDataSet.dataSourceIx = 0;
  } else if (this.attributes["id"].value == "satDataColorMap") {
    $("#clrMapSelect").text("Select Satellite Data Color Map"); 
    ShipDataSet.dataSourceIx = 1;
  } else {
    alert("selectColorMap: failed to identify color map");
  }

  highlightColorMapByDataSource(ShipDataSet.dataSourceIx);
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var hideOverlay = function(e) {
//  $("body").css({"position": "relative"});
  $("#overlay")[0].style.display = "none";

  if (ShipDataSet.dataSourceIx == 0) {
    drawColorMap("#shipDataColorMap", ShipDataSet.shipDataColorMapIx);
  } else if (ShipDataSet.dataSourceIx == 1) {
    drawColorMap("#satDataColorMap", ShipDataSet.satDataColorMapIx);
  }  else {
    alert("hideOverlay: unknown data source");
  }

  ShipDataSet.map.layers[ShipDataSet.map.layers.length - 1].redraw();
}

////////////////////////////////////////////////////////////////////////////////
//
// Event handler for Ship Data dropdown: set the variable to be displayed
// according to the menu item selected.
// 
// varMIn and varMax are used to colormap the variable values appropriately.
//
////////////////////////////////////////////////////////////////////////////////
var onSelectShipDataVariable = function(e) {
  switch (this.selectedIndex) {
    case 0: 
      ShipDataSet.varIx = "o2ar";
      ShipDataSet.varMin = ShipDataSet.o2arMin;
      ShipDataSet.varMax = ShipDataSet.o2arMax;
      break;
    case 1: 
      ShipDataSet.varIx = "ncp";
      ShipDataSet.varMin = ShipDataSet.ncpMin;
      ShipDataSet.varMax = ShipDataSet.ncpMax;
      break;
    case 2: 
      ShipDataSet.varIx = "salinity";
      ShipDataSet.varMin = ShipDataSet.saltMin;
      ShipDataSet.varMax = ShipDataSet.saltMax;
      break;
    case 3: 
      ShipDataSet.varIx = "temperature";
      ShipDataSet.varMin = ShipDataSet.tempMin;
      ShipDataSet.varMax = ShipDataSet.tempMax;
      break;
    case 4: 
      ShipDataSet.varIx = "pressure";
      ShipDataSet.varMin = ShipDataSet.pressureMin;
      ShipDataSet.varMax = ShipDataSet.pressureMax;
      break;
    case 5: 
      ShipDataSet.varIx = "neto2";
      ShipDataSet.varMin = ShipDataSet.neto2Min;
      ShipDataSet.varMax = ShipDataSet.neto2Max;
      break;
    default: 
      alert("onSelectShipDataVariable: invalid index.");
      return;
  }
  
  ShipDataSet.numIx = this.selectedIndex;

  updateShipDataColorMapInfo();

  var layer = ShipDataSet.map.layers[ShipDataSet.map.layers.length - 1];

  if (layer) {
    layer.setName(pointsLayerName());
    layer.redraw();
  }
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var pointsLayerName = function() {
  return ShipDataSet.variableTypes[ShipDataSet.numIx] + " " + rangeString();
}

////////////////////////////////////////////////////////////////////////////////
//
// Set the Satellite color map label to show the name of the currently selected
// variable.
//
////////////////////////////////////////////////////////////////////////////////
var updateSatelliteColorMapInfo = function(e) {
  $("#satDataClrMapSpan")[0].firstChild.textContent =
      SatelliteDataSet.shortVarTypes[SatelliteDataSet.numIx] + ": ";
}

////////////////////////////////////////////////////////////////////////////////
//
// Event handler for Satellite Data dropdown: set the variable to be displayed
// according to the menu item selected.
//
////////////////////////////////////////////////////////////////////////////////
var onSelectSatelliteDataVariable = function(e) {
  SatelliteDataSet.numIx = this.selectedIndex;
  updateSatelliteColorMapInfo();

  if (SatelliteDataSet.variableTypes[this.selectedIndex] != "None") {
    alert("Satellite data: not implemented for "
        + SatelliteDataSet.minVarTypes[this.selectedIndex] + ".");
  }
}

////////////////////////////////////////////////////////////////////////////////
//
// Set number of days in the current month, considering leap year as well.
// Return the current day, which is the "day" input parameter, unless that value
// happens to be larger than the last day of the current month, in which case
// it's set to be that last day of the month. So if the appropriate day slider
// is at 31 or 30 and the current month and year are 2 and 2004, then the
// value returned is 29.
//
// The name of this function refers to its side effects.  The official real
// value of the function is to return the current day for the selected date,
// which will be the same as the value of the daySliderSelector that's passed
// in, unless the month parameter doesn't permit that day value.
//
////////////////////////////////////////////////////////////////////////////////
var setMaxDay = function(year, month, daySliderSelector) {
  var maxDay = 31;
  var currentDay = $(daySliderSelector).slider("option", "value");

  if (month == 2) { // February
    if (year % 4) { // Not a leap year
      maxDay = 28;
    } else {
      maxDay = 29;
    }
  } else if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
    maxDay = 30; // 30 days hath September, April, June and November...
  }

  $(daySliderSelector).slider("option", "max", maxDay);

  if (currentDay > maxDay) {
    $(daySliderSelector).slider("option", "value", maxDay);
    $(daySliderSelector).find("a:first").text(maxDay);
    currentDay = maxDay;
  }
 
  return currentDay;
}

////////////////////////////////////////////////////////////////////////////////
//
// On user selection of Start Year, set the Start Day slider's max value 
// appropriately for the current Start Year and Month.
//
////////////////////////////////////////////////////////////////////////////////
var onSelectStartYear = function(e, ui) {
  ShipDataSet.startDay = setMaxDay(ShipDataSet.startYear,
      $("#startMonthSlider").slider("value"), "#startDaySlider");
}

////////////////////////////////////////////////////////////////////////////////
//
// On user selection of End Year, set the End Day slider's max value
// appropriately for the current End Year and Month.
//
////////////////////////////////////////////////////////////////////////////////
var onSelectEndYear = function(e, ui) {
  ShipDataSet.endDay = setMaxDay(ShipDataSet.endYear,
      $("#endMonthSlider").slider("value"), "#endDaySlider");
}

////////////////////////////////////////////////////////////////////////////////
//
// On user selection of Start Month, set the Start Day slider's max value
// appropriately for the current Start Year and Month.
//
////////////////////////////////////////////////////////////////////////////////
var onSelectStartMonth = function(e, ui) {
  ShipDataSet.startDay = setMaxDay(ShipDataSet.startYear,
      $(this).slider("value"), "#startDaySlider");
}

////////////////////////////////////////////////////////////////////////////////
//
// On user selection of End Month, set the End Day slider's max value
// according to the current End Year and Month.
//
////////////////////////////////////////////////////////////////////////////////
var onSelectEndMonth = function(e, ui) {
  ShipDataSet.endDay = setMaxDay(ShipDataSet.endYear, $(this).slider("value"),
      "#endDaySlider");
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var onSelectStartDay = function(e, ui) {
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var onSelectEndDay = function(e, ui) {
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var addOuterElements = function() {
  $("body").append("<table class = 'noBorder' id = 'bigTable'></table>");

  $("#bigTable").append("<tr id = 'titleRow'></tr>");
  $("#titleRow").append("<th id = 'titleHead' colspan='2'></th>");
  $("#titleHead").append("<h3 id = 'centeredTitle'>Measurements of Net "
      + "Community Production (MoNCP) in the World's Oceans</h3>");

  $("#bigTable").append("<tr id = 'versionRow'></tr>");
  $("#versionRow").append("<td id = 'versionElt' class = 'centeredElt' "
      + "colspan = '2'></td>");
  $("#versionElt").append("<h5 id = 'versionID'>Development Version #" 
      + ShipDataSet.developmentVersion + "</h5>");

  $("#bigTable").append("<tr id = 'topRow'></tr>");
  $("#bigTable").append("<tr id = 'mapRow'></tr>");
  $("#bigTable").append("<tr id = 'bottomRow'></tr>");

  $("#bottomRow").append("<td id = 'bottomLeftElt'></td>");
  $("#bottomLeftElt").append("<table id = 'bottomLeftTable'></table>");
  $("#bottomLeftTable").append("<tr id = 'selectVariablesRow'><\tr>");
  
  $("#selectVariablesRow").append("<td id = 'selectVariablesElt'></td>");
  $("#selectVariablesElt").append("<fieldset class = 'groupBox' id = "
      + "'selectVariablesGroup'></fieldset>");
  $("#selectVariablesGroup").append("<legend class = 'legendText'>Variables "
      + "Displayed</legend>");

  $("#bottomRow").append("<td id = 'bottomRightElt'></td>");
  $("#bottomRightElt").append("<fieldset class = 'groupBox' id = "
      + "'timelineGroup'></fieldset>");
  $("#timelineGroup").append("<legend class = 'legendText'>Select Time Range"
      + "</legend>");
}

////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
var addReturnText = function() {
  $("#topRow").append("<td id = 'returnTextElt'></td>");
  $("#returnTextElt").append("<fieldset class = 'groupBox' title = "
      + "'return text and status' id = 'returnTextGroup'>");
  $("#returnTextGroup").append("<legend class = 'legendText'>Return Status"
      + "</legend>");
  $("#returnTextGroup").append("<div id = 'returnStatus'></div><br>");
  $("#returnTextGroup").append("<div id = 'returnText'></div");
}

////////////////////////////////////////////////////////////////////////////////
//
// Currently a stub, and disabled to boot.
//
////////////////////////////////////////////////////////////////////////////////
var addLoginControls = function() {
  $("#topControls").append("<fieldset class = 'groupBox' title = "
      + "'Not implemented' id = " + "'registerLoginGroup' disabled = 'disabled'"
      + ">Username: <input type = 'text' name = 'user'"
      + "class = 'textEntry'><input type = 'submit' value = 'Login'><br>"
      + "Password:  <input type = 'password' name = 'password' class = "
      + "'textEntry'><input type = 'button' value = 'Register' onclick = "
      + "'window.open(\"./register.html\")'<br>");
  $("#registerLoginGroup").append("<legend class = 'legendText'>Log in or "
      + "Register</legend>");
}

////////////////////////////////////////////////////////////////////////////////
//
// "selector": what JQuerified DOM element to draw into: where to draw.
// "clrMapIx": index into ShipDataSet.getRGBFromLinearValue array of functions:
// what color map to draw.
//
////////////////////////////////////////////////////////////////////////////////
var drawColorMap = function(selector, clrMapIx) {
  var canvas = $(selector)[0];
  if (canvas.getContext) {
    var context = canvas.getContext("2d");
    var width = 95;
    var height = 19;

    context.clearRect(0, 0, width, height);

    for (var i = 0; i < width; i++) {
      var rgb = ShipDataSet.getRGBFromLinearValue[clrMapIx](0, width, i);
      var r =  parseInt(rgb[0]);
      var g =  parseInt(rgb[1]);
      var b =  parseInt(rgb[2]);

      context.strokeStyle = "rgb(" + r + ", " + g + ", " + b + ")";
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i, height);
      context.closePath();
      context.stroke();
    }
  } else {
    alert("Can't draw color map: HTML Canvas not supported");
  }
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var addColorMaps = function() {
  var inputTitle = "'By default, the default Min and Max values are extracted "
      + "from the currently loaded data (for the selected time range), but you "
      + "can change them. If the value for a data point is less than the Min "
      + "displayed, that data point will be black.  If that value is greater "
      + "than the displayed Max, it will be white.'";

  $("#topRow").append("<td id = 'colorMapsElt'></td");
  $("#colorMapsElt").append("<fieldset class = 'groupBox' id = 'colorMapGroup'>"
      + "<legend class = 'legendText'>Color Maps</legend>"
      + "<span class = 'boxSpan' id = 'shipDataClrMapSpan'>Ship Data: "
      + "<label for = 'shipColorMapMin' id = shipColorMapMinLabel>Min</label>"
      + "<input type = 'number' class = 'numEntry' id = 'shipColorMapMin' "
      + "title = " + inputTitle + " size = 3'>"

// begin Canvas ship data color map
      + "<canvas id = 'shipDataColorMap' class = 'clrMap' width = '95' height ="
      + "'19' title = 'Click to change ship data color map.'></canvas>"
/*
*/
// end Canvas color map

      + "<input type = 'number' class = 'numEntry' id = 'shipColorMapMax' "
      + "title = " + inputTitle + "size = 3>"
      + "<label for = 'shipColorMapMax' id = shipColorMapMinLabel>Max</label>"
      + "</span><br>"
      + "<span class = 'boxSpan' id = 'satDataClrMapSpan'>Satellite Data: "
      + "<label for = 'satColorMapMin' id = satColorMapMinLabel>Min</label>"
      + "<input type = 'number' class = 'numEntry' id = 'satColorMapMin' "
      + "title = 'not implemented' size = 3 disabled = 'disabled'>"

// begin Canvas satellite data color map
      + "<canvas id = 'satDataColorMap' class = 'clrMap' width = '95' height ="
      + "'19' title = 'Click to change satellite data color map.'></canvas>"
// end Canvas color map

      + "<input type = 'number' class = 'numEntry' id = 'satColorMapMax' "
      + "title = 'not implemented' size = 3 disabled = 'disabled'>"
      + "<label for = 'satColorMapMax' id = satColorMapMaxLabel>Max</label>"
      + "</span>"
      + "</fieldset>");
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var updateVarExtrema = function() {
  switch (ShipDataSet.numIx) {
    case 0:
      ShipDataSet.varMin = ShipDataSet.o2arMin;
      ShipDataSet.varMax = ShipDataSet.o2arMax;
      break;
    case 1:
      ShipDataSet.varMin = ShipDataSet.ncpMin;
      ShipDataSet.varMax = ShipDataSet.ncpMax;
      break;
    case 2:
      ShipDataSet.varMin = ShipDataSet.saltMin;
      ShipDataSet.varMax = ShipDataSet.saltMax;
      break;
    case 3:
      ShipDataSet.varMin = ShipDataSet.tempMin;
      ShipDataSet.varMax = ShipDataSet.tempMax;
      break;
    case 4:
      ShipDataSet.varMin = ShipDataSet.pressureMin;
      ShipDataSet.varMax = ShipDataSet.pressureMax;
      break;
    case 5:
      ShipDataSet.varMin = ShipDataSet.neto2Min;
      ShipDataSet.varMax = ShipDataSet.neto2Max;
      break;
    default:
      alert("updateVarExtrema: invalid index.");
      return;
  }
}

////////////////////////////////////////////////////////////////////////////////
//
// Updates ShipDataSet.varMin, and then causes all the ship data points to be
// recolored based on the new min value's effect on the color mapping.
//
// Currently does not update the current min value for the selected variable,
// so if you change which ship data variable is being displayed and come back, 
// the min value will have reverted to the actual min among that variable's
// values in the database for the selected time period.
//
////////////////////////////////////////////////////////////////////////////////
var updateVarMin = function(e) {
  ShipDataSet.varMin = parseFloat($("#shipColorMapMin")[0].value);
  ShipDataSet.map.layers[ShipDataSet.map.layers.length - 1].redraw();
}

////////////////////////////////////////////////////////////////////////////////
//
// Updates ShipDataSet.varMax, and then causes all the ship data points to be
// recolored based on the new max value's effect on the color mapping.
//
// Currently does not update the current max value for the selected variable,
// so if you change which ship data variable is being displayed and come back, 
// the max value will have reverted to the actual max among that variable's
// values in the database for the selected time period.
//
////////////////////////////////////////////////////////////////////////////////
var updateVarMax = function(e) {
  ShipDataSet.varMax = parseFloat($("#shipColorMapMax")[0].value);
  ShipDataSet.map.layers[ShipDataSet.map.layers.length - 1].redraw();
}

////////////////////////////////////////////////////////////////////////////////
//
// Compute min and max values for the data points currently extracted from the
// database, not necessarily all the values in the whole database.
//
////////////////////////////////////////////////////////////////////////////////
var computeMinMaxValues = function() {
  o2arMin = Infinity;
  o2arMax = -Infinity;
  ncpMin = Infinity;
  ncpMax = -Infinity;
  saltMin = Infinity;
  saltMax = -Infinity;
  tempMin = Infinity;
  tempMax = -Infinity;
  pressureMin = Infinity;
  pressureMax = -Infinity;
  neto2Min = Infinity;
  neto2Max = -Infinity;

  for (var i = 0; i < ShipDataSet.all.length; i++) {
    if (ShipDataSet.all[i].o2ar < o2arMin) {
      o2arMin = ShipDataSet.all[i].o2ar;
    }
    if (ShipDataSet.all[i].o2ar > o2arMax) {
      o2arMax = ShipDataSet.all[i].o2ar;
    }
    if (ShipDataSet.all[i].ncp < ncpMin) {
      ncpMin = ShipDataSet.all[i].ncp;
    }
    if (ShipDataSet.all[i].ncp > ncpMax) {
      ncpMax = ShipDataSet.all[i].ncp;
    }
    if (ShipDataSet.all[i].salinity < saltMin) {
      saltMin = ShipDataSet.all[i].salinity;
    }
    if (ShipDataSet.all[i].salinity > saltMax) {
      saltMax = ShipDataSet.all[i].salinity;
    }
    if (ShipDataSet.all[i].temperature < tempMin) {
      tempMin = ShipDataSet.all[i].temperature;
    }
    if (ShipDataSet.all[i].temperature > tempMax) {
      tempMax = ShipDataSet.all[i].temperature;
    }
    if (ShipDataSet.all[i].pressure < pressureMin) {
      pressureMin = ShipDataSet.all[i].pressure;
    }
    if (ShipDataSet.all[i].pressure > pressureMax) {
      pressureMax = ShipDataSet.all[i].pressure;
    }
    if (ShipDataSet.all[i].neto2 < neto2Min) {
      neto2Min = ShipDataSet.all[i].neto2;
    }
    if (ShipDataSet.all[i].neto2 > neto2Max) {
      neto2Max = ShipDataSet.all[i].neto2;
    }
  }

  ShipDataSet.o2arMin = o2arMin;
  ShipDataSet.o2arMax = o2arMax;
  ShipDataSet.ncpMin = ncpMin;
  ShipDataSet.ncpMax = ncpMax;
  ShipDataSet.saltMin = saltMin;
  ShipDataSet.saltMax = saltMax;
  ShipDataSet.tempMin = tempMin;
  ShipDataSet.tempMax = tempMax;
  ShipDataSet.pressureMin = pressureMin;
  ShipDataSet.pressureMax = pressureMax;
  ShipDataSet.neto2Min = neto2Min;
  ShipDataSet.neto2Max = neto2Max;
  updateVarExtrema();
}

////////////////////////////////////////////////////////////////////////////////
//
// From http://www.peterrobins.co.uk/it/olchangingprojection.html
//
////////////////////////////////////////////////////////////////////////////////
function formatLonlats(lonLat) {
    var lat = lonLat.lat;
    var long = lonLat.lon;
    var ns = OpenLayers.Util.getFormattedLonLat(lat);
    var ew = OpenLayers.Util.getFormattedLonLat(long,'lon');
    return ns + ', ' + ew;
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var addMap = function() {
  $("#mapRow").append("<td id = 'mapElt' colspan = '2'></td>");
  $("#mapElt").append("<div class = 'groupBox centeredElt' "
      + "id = 'mapGroupBox'></div>");
  $("#mapGroupBox").append("<div class = 'centeredElt' id = 'liveMap'></div>");

  var plateCaree = new OpenLayers.Projection("EPSG:4326"); 
  var sphericalMercator = new OpenLayers.Projection("EPSG:3857"); 

  var options = {
      projection: plateCaree,
      displayProjection: plateCaree
  };

  ShipDataSet.map = new OpenLayers.Map("liveMap", options);
  ShipDataSet.map.addLayer(new OpenLayers.Layer.OSM());

  addShipDataPoints(ShipDataSet.map, plateCaree);

  ShipDataSet.layerSwitcher = new OpenLayers.Control.LayerSwitcher();
  ShipDataSet.map.addControl(ShipDataSet.layerSwitcher);
  ShipDataSet.map.addControl(new OpenLayers.Control.MousePosition(
      {id: "latLonMouse", formatOutput: formatLonlats}));

  ShipDataSet.map.zoomToMaxExtent();
  updateMapSize();
}

////////////////////////////////////////////////////////////////////////////////
//
// Note: hardwired for ship data. Uses the color mapping algorithm indicated by
// ShipDataSet.shipDataColorMapIx.
//
////////////////////////////////////////////////////////////////////////////////
var getColorFromLinearValue = function(min, max, value) {
  return ShipDataSet.getRGBFromLinearValue[ShipDataSet.shipDataColorMapIx](min, max, value);
}

////////////////////////////////////////////////////////////////////////////////
//
// Note: this is for ship data points.
//
////////////////////////////////////////////////////////////////////////////////
var getPointColor = function(feature) {
  var i = feature.attributes["dataIndex"];

  if (ShipDataSet.all[i][ShipDataSet.varIx] > ShipDataSet.varMax) {
    return "rgb(255, 255, 255)";
  }

  if  (ShipDataSet.all[i][ShipDataSet.varIx] < ShipDataSet.varMin) {
    return "rgb(0, 0, 0)";
  }

  var rgb = getColorFromLinearValue(
      ShipDataSet.varMin,
      ShipDataSet.varMax,
      ShipDataSet.all[i][ShipDataSet.varIx]
  );
  var r =  parseInt(rgb[0]);
  var g =  parseInt(rgb[1]);
  var b =  parseInt(rgb[2]);
  return "rgb(" + r + ", " + g + ", " + b + ")";
}

////////////////////////////////////////////////////////////////////////////////
//
// This is to be called when the mouse is hovering over the data point indicated
// by the "feature" input argument.
//
////////////////////////////////////////////////////////////////////////////////
var displayDataPointPopup = function(feature) {
  var i = feature.attributes["dataIndex"];
  var popup = new OpenLayers.Popup.FramedCloud(
      "",
      feature.geometry.getBounds().getCenterLonLat(),
      new OpenLayers.Size(100,100),
      "<div>#" + ShipDataSet.all[i].id + ". "
      + ShipDataSet.variableTypes[ShipDataSet.numIx]
      + ": " +
      + ShipDataSet.all[i][ShipDataSet.varIx]
      + ShipDataSet.units[ShipDataSet.numIx]
      + "<br>" + ShipDataSet.all[i]["year"]
      + "/" + pad(ShipDataSet.all[i]["month"], 2)
      + "/" + pad(ShipDataSet.all[i]["day"], 2)
      + ": Cruise #" + ShipDataSet.all[i].ship
      + "<br>" + ShipDataSet.all[i]["lat"] + "&deg;"
      + ", " + ShipDataSet.all[i]["lon"] + "&deg;"
      + "</div>",
      null,
      true,
      null
  );

  feature.popup = popup;
  ShipDataSet.map.addPopup(popup);
  return true;
}

////////////////////////////////////////////////////////////////////////////////
// 
// The mouse is no longer hovering over the data point indicated by input arg
// "feature."
//
////////////////////////////////////////////////////////////////////////////////
var removeDataPointPopup = function(feature) {
  ShipDataSet.map.removePopup(feature.popup);
  feature.popup.destroy();
  feature.popup = null;
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var addCancelDisplayDialog = function() {
  $("#mapGroupBox").append("<div class = 'dlog' id = 'cancelDisplayDlog'"
      + "title = 'Possibly too much data requested'><p><span class='ui-icon "
      + "ui-icon-alert' style='float: left; margin: 0 7px 20px 0;'></span>"
      + "<div id = 'cancelDisplayDlogText'></div></p></div>");
}

////////////////////////////////////////////////////////////////////////////////
//
// To be called if the user, when confronted with their request to show enough
// data that it might seriously impact performance, chooses to cancel out.
//
////////////////////////////////////////////////////////////////////////////////
var cancelDisplayResponse = function() {
  OpenLayers.Element.removeClass(ShipDataSet.map.viewPortDiv, "olCursorWait");
  window.status = "Done";
  document.body.style.cursor = "default";
  $("#cancelDisplayDlog").dialog("close");
}

////////////////////////////////////////////////////////////////////////////////
//
// To be called if the user, when confronted with their request to show enough
// data that it might seriously impact performance, chooses to go ahead and try
// to display the data anyway.
//
////////////////////////////////////////////////////////////////////////////////
var goAheadResponse = function() {
  displaySelectedShipData(ShipDataSet.shipData);
  $("#cancelDisplayDlog").dialog("close");
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var cancelDisplayDialog = function(nPoints) {
  $("#cancelDisplayDlogText")[0].textContent = "You've just requested "
      + nPoints + " data points.  OpenLayers may not be able to"
      + " display them successfully.  Would you like to cancel, "
      + "reduce the time range, and try again?";

  $("#cancelDisplayDlog").dialog ({
    autoOpen: true,
    height: 225,
    width: 750,
    modal: true,
    buttons: {
      "Cancel display": cancelDisplayResponse,
      "Go ahead anyway": goAheadResponse
    }
  });
}

////////////////////////////////////////////////////////////////////////////////
//
// Based on http://openlayers.org/dev/examples/stylemap.html.
//
// Preconditions: * The timeline sliders have been instantiated and have values.
//                * The Ship color map functionality has all been instantiated.
//
////////////////////////////////////////////////////////////////////////////////
function addShipDataPoints(map, projection) {
  if (ShipDataSet.firstTime) {
    getShipDataSetsByTimeRange(ShipDataSet.startYear, ShipDataSet.startMonth,
                               ShipDataSet.startDay, ShipDataSet.endYear,
                               ShipDataSet.endMonth, ShipDataSet.endDay);
    ShipDataSet.firstTime = false;
  }

  if (ShipDataSet.all.length <= 0) {
    return;
  }

  computeMinMaxValues();
  updateShipDataColorMapInfo();

  var lonSum = 0, latSum = 0, lonAvg = 0, latAvg = 0;
  var l = 0, r = 0, t = 0, b = 0; 

  var shipDataPoints = new Array(ShipDataSet.all.length);

  for (var i = 0; i < ShipDataSet.all.length; i++) {
    shipDataPoints[i] = new OpenLayers.Feature.Vector(
        new OpenLayers.Geometry.Point(
            ShipDataSet.all[i].lon, ShipDataSet.all[i].lat
            ).transform(projection, map.getProjection()),
        { dataIndex: i }
    );
  }

  var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
  renderer = (renderer) ? [renderer] : 
      OpenLayers.Layer.Vector.prototype.renderers;

  var context = {
    getColor: getPointColor,
    getSize: 3
  };

  var template = {
    pointRadius: "${getSize}", 
    fillColor: "${getColor}", 
    strokeColor: "${getColor}"
  };

  var defaultStyle = new OpenLayers.Style(template, {context: context});

  var dataStyles = new OpenLayers.StyleMap({
      "default": defaultStyle,
      "select": new OpenLayers.Style({
          strokeColor: "#ffffff",
          fillColor: "#000000",
          graphicZIndex: 2,
          pointRadius: 6
      })
  });

  var points = new OpenLayers.Layer.Vector(
      ShipDataSet.variableTypes[ShipDataSet.numIx],
      { styleMap: dataStyles, rendererOptions: {zIndexing: true}}
  );
  points.addFeatures(shipDataPoints);
  points.setName(pointsLayerName());

  map.addLayer(points);

  var select = new OpenLayers.Control.SelectFeature(
      points,
      { hover: true,
        onBeforeSelect: displayDataPointPopup,
        onUnselect: removeDataPointPopup,
      }
  );

  map.addControl(select);
  select.activate();
  ShipDataSet.selectControl = select;

  var bounds = shipDataPoints[0].geometry.bounds;

/*
  if (map.zoom) {
    map.zoomToExtent(bounds);
  } else {
*/
    map.setCenter(bounds.getCenterLonLat());
/*
  }
*/
}

////////////////////////////////////////////////////////////////////////////////
//
// Set the ship data color map min and max and update to show the currently
// selected variable name.
//
////////////////////////////////////////////////////////////////////////////////
var updateShipDataColorMapInfo = function() {
  $("#shipColorMapMin")[0].value = ShipDataSet.varMin;
  $("#shipColorMapMax")[0].value = ShipDataSet.varMax;
  $("#shipDataClrMapSpan")[0].firstChild.textContent =
      ShipDataSet.minVarTypes[ShipDataSet.numIx] + " (" 
      + ShipDataSet.minUnits[ShipDataSet.numIx] + "): ";
}

////////////////////////////////////////////////////////////////////////////////
// 
// Map a linear value to a rainbow color map. Various h, s, and l values were
// "empricially" derived to approximate rainbow.png as closely as feasible. 
//
// Assumption: min <= val <= max
//
////////////////////////////////////////////////////////////////////////////////
var getRainbowRGBFromLinearValue = function(min, max, val) {
  var fraction = 1 - (val - min) / (max - min);
  var minHue = 260 / 360;
  var maxHue = 0 / 360;
  var hue = (minHue - maxHue) * fraction;
  var saturation = 0.9; // 0.0 <= saturation <= 1.0
  var lightness = 0.47; // 0.0 <= lightness <= 1.0
  return hslToRgb(hue, saturation, lightness);
}

////////////////////////////////////////////////////////////////////////////////
//
// Assumption: min <= val <= max
//
////////////////////////////////////////////////////////////////////////////////
var getGrayscaleRGBFromLinearValue = function(min, max, val) {
  var n = parseInt(Math.round(((val - min) / (max - min)) * 255.0))
  return [n, n, n];
}

////////////////////////////////////////////////////////////////////////////////
//
// Assumption: min <= val <= max
//
////////////////////////////////////////////////////////////////////////////////
var getHeatedBodyRGBFromLinearValue = function(min, max, val) {
  var i = val - min;
  var width = max - min;
  var h;
  var s = 1.0;
  var v;

  if (i < width / 2) {
    h = 0.0;
    v = (2.0 * i) / width;
  } else {
    h = 2.0 * (i - (width / 2.0)) / (width * 6.0);
    v = 1.0;
  }

  var desatThreshold = 5.0 * width / 6.0; // desaturation threshold

  if (i > desatThreshold) {
    s = 1.0 - (val - desatThreshold ) / (width - desatThreshold);
  }

  return hsvToRgb(h, s, v);
}

////////////////////////////////////////////////////////////////////////////////
//
// rgb min and max values determined by looking at
// ParaviewColorBar_CEIlabBlue2Red.png.
//
////////////////////////////////////////////////////////////////////////////////
var getCEIBlueRedRGBFromLinearValue = function(min, max, val) {
  var i = val - min;
  var width = max - min;
  var mid = width / 2;
  var j = val - mid;

  var rMin = 18;
  var rMid = 148;
  var rMax = 196;
  var gMin = 153;
  var gMid = 137;
  var gMax = 119;
  var bMin = 190;
  var bMid = 138;
  var bMax = 87;

  if (val < mid) {
    var r = rMin + (rMid - rMin) * i / mid;
    var g = gMin + (gMid - gMin) * i / mid;
    var b = bMin + (bMid - bMin) * i / mid;
  } else {
    var r = rMid + (rMax - rMid) * j / mid; + 1
    var g = gMid + (gMax - gMid) * j / mid -1;
    var b = bMid + (bMax - bMid) * j / mid -1;
  }

  return [r, g, b];
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var buildGetRGBFromLinearValueArray = function() {
  ShipDataSet.getRGBFromLinearValue = [ getRainbowRGBFromLinearValue,
                                        getGrayscaleRGBFromLinearValue,
                                        getHeatedBodyRGBFromLinearValue,
                                        getCEIBlueRedRGBFromLinearValue ];
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var addNewShipDataControls = function() {
  $("#mapGroupBox").append("<table id = 'mapZoneCtrlTable'></table>");
    $("#mapZoneCtrlTable").append("<tr id = 'mzctRow'></tr>");
      $("#mzctRow").append("<td id = 'mzctElt1'></td>");
        $("#mzctElt1").append("<input class = 'mapZoneCtrl' "
          + "id = 'newShipDataButton' "
          + "type = 'button' value = 'Add/Change Ship Data'>");
}

////////////////////////////////////////////////////////////////////////////////
//
// Pass the current time range selected as URI parameters when opening the
// "Add/Change Ship Data" webpage.
//
////////////////////////////////////////////////////////////////////////////////
var openNewShipData = function() {
  var clickString = "newshipdata.html?"
                  + "startY=" + ShipDataSet.startYear
                  + "&startM=" + ShipDataSet.startMonth
                  + "&startD=" + ShipDataSet.startDay
                  + "&endY=" + ShipDataSet.endYear
                  + "&endM=" + ShipDataSet.endMonth
                  + "&endD=" + ShipDataSet.endDay;
  window.open(clickString);
}

////////////////////////////////////////////////////////////////////////////////
//
// Precondition: $("#mzctRow") has been instantiated.
//
////////////////////////////////////////////////////////////////////////////////
var addVisButton = function() {
    $("#mzctRow").append("<td id = 'mzctElt2'></td>");
      $("#mzctElt2").append("<input class = 'centeredElt' id = 'visButton' "
        + "type = 'button' value = 'More Visualization Tools' onclick = "
        + "'window.open(\"vis.html\")'>");
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var updateMapSize = function() {

/*
  var width = $(window).width() - 20;
  var height = width / 2 + 20;
  $("#liveMap").css({"width": width});
  $("#liveMap").css({"height": height});
  $("#mapZoneCtrlTable").css({"width": width});
  $("#mapGroupBox").css({"width": width});
*/
}

////////////////////////////////////////////////////////////////////////////////
//
// Precondition: $("#mzctRow") has been instantiated.
//
////////////////////////////////////////////////////////////////////////////////
var addMapSizeControl = function() {
    $("#mzctRow").append("<td id = 'mzctElt3'></td>");
      $("#mzctElt3").append("<p id = 'mapSzP'>Map Size: </p>");
        $("#mapSzP").append("<select id = 'mapSzCtrl'></select>");
          $("#mapSzCtrl").append($("<option>566 X 350</option>"));
          $("#mapSzCtrl").append($("<option>647 X 400</option>"));
          $("#mapSzCtrl").append($("<option>728 X 450</option>"));
          $("#mapSzCtrl").append($("<option>809 X 500</option>"));
          $("#mapSzCtrl").append($("<option>971 X 600</option>"));
          $("#mapSzCtrl").append($("<option>1052 X 650</option>"));
          $("#mapSzCtrl")[0].selectedIndex = 3;
}

////////////////////////////////////////////////////////////////////////////////
//
// Assumes that this.options[this.selectedIndex].text is of the form
// "<width> X <height>" where <width> and <height> are integers.
//
////////////////////////////////////////////////////////////////////////////////
var onSelectMapSize = function() {
  var substrings = this.options[this.selectedIndex].text.split(" ", 3);
  var width = parseInt(substrings[0]);
  var height = parseInt(substrings[2]);
  $("#liveMap").css({"width": width});
  $("#liveMap").css({"height": height});
  $("#mapZoneCtrlTable").css({"width": width})
  $("#mapGroupBox").css({"width": width})
  ShipDataSet.map.baseLayer.redraw();
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var buildShipDataDropdown = function() {
  $("#selectVariablesGroup").append("<span class = 'dropboxName'>Ship: "
      + "</span>");
  $("#selectVariablesGroup").append("<select id = 'shipDropdown'></select>");
  addDropdownItems("#shipDropdown", ShipDataSet.variableTypes);
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var buildSatelliteDataDropdown = function() {
  $("#selectVariablesGroup").append("<span class = 'dropboxName'>Satellite: " +
      "</span>");
  $("#selectVariablesGroup").append("<select id = satelliteDropdown></select>");
  addDropdownItems("#satelliteDropdown", SatelliteDataSet.variableTypes);
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var addDropdownItems = function(dropdown, itemArray) {
  $.each(itemArray,
    function(i, value) {
      $(dropdown).append($("<option>" + value + "</option>"));
    }
  )
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var getShipData = function() {
  getShipDataSetsByTimeRange(ShipDataSet.startYear, ShipDataSet.startMonth,
                             ShipDataSet.startDay, ShipDataSet.endYear,
                             ShipDataSet.endMonth, ShipDataSet.endDay);
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var addTimelineSliderTable = function() {
  $("#timelineGroup").append("<table id = 'timeTable'></table>");
 
    $("#timeTable").append("<thead><tr><th>Start</th><th>End</th><th></th></tr>"
        + "</thead><tbody>");

    //Year:
    $("#timeTable").append("<tr id = 'yearRow'></tr>");

      $("#yearRow").append("<td id = 'startYear'");
        $("#startYear").append("<span class = 'boxSpan' id = 'startYearSpan'>");
        $("#startYearSpan").append("<label for 'startYearSlider'>Year:"
            + "</label><div class = 'slider' id = 'startYearSlider'></div>"
            + "</span></td>");
          $("#startYearSlider").slider( {
              min: ShipDataSet.minYear, 
              max: ShipDataSet.maxYear,
              step: 1,
              value: ShipDataSet.startYear, 
              create: displayStartYearSliderValue,
              slide: applyStartYearSliderValue,
              change: onSelectStartYear
          });
      
      $("#yearRow").append("<td id = 'endYear'");
        $("#endYear").append("<span class = 'boxSpan' id = 'endYearSpan'>");
        $("#endYearSpan").append("<label for 'endYearSlider'>Year:</label>"
            + "<div class = 'slider' id = 'endYearSlider'></div>"
            + "</span></td>");
          $("#endYearSlider").slider( {
              min: ShipDataSet.minYear, 
              max: ShipDataSet.maxYear,
              step: 1,
              value: ShipDataSet.endYear, 
              create: displayEndYearSliderValue,
              slide: applyEndYearSliderValue,
              change: onSelectEndYear
          });

    //Month:
    $("#timeTable").append("<tr id = 'monthRow'></tr>");

      $("#monthRow").append("<td id = 'startMonth'");
        $("#startMonth").append("<span class = 'boxSpan' "
            + "id = 'startMonthSpan'>");
        $("#startMonthSpan").append("<label for 'startMonthSlider'>Month:"
            + "</label><div class = 'slider' id = 'startMonthSlider'></div>"
            + "</span></td>");
          $("#startMonthSlider").slider( {
              min: ShipDataSet.minMonth, 
              max: ShipDataSet.maxMonth,
              step: 1,
              value: ShipDataSet.startMonth, 
              create: displayStartMonthSliderValue,
              slide: applyStartMonthSliderValue,
              change: onSelectStartMonth
          });

      $("#monthRow").append("<td id = 'endMonth'");
        $("#endMonth").append("<span class = 'boxSpan' id = 'endMonthSpan'>");
        $("#endMonthSpan").append("<label for 'endMonthSlider'>Month:"
            + "</label><div class = 'slider' id = 'endMonthSlider'></div>"
            + "</span></td>");
          $("#endMonthSlider").slider( {
              min: ShipDataSet.minMonth, 
              max: ShipDataSet.maxMonth,
              step: 1,
              value: ShipDataSet.endMonth, 
              create: displayEndMonthSliderValue,
              slide: applyEndMonthSliderValue,
              change: onSelectEndMonth
          });

      // Button:
      $("#monthRow").append("<td><input id = 'getShipDataButton' "
      + "type = 'button' value = 'Get Ship Data'></td>");

    //Day:
    $("#timeTable").append("<tr id = 'dayRow'></tr>");

      $("#dayRow").append("<td id = 'startDay'");
        $("#startDay").append("<span class = 'boxSpan' id = 'startDaySpan'>");
        $("#startDaySpan").append("<label for 'startDaySlider'>Day:"
            + "</label><div class = 'slider' id = 'startDaySlider'></div>"
            + "</span></td>");
          $("#startDaySlider").slider( {
              min: ShipDataSet.minDay, 
              max: ShipDataSet.maxDay,
              step: 1,
              value: ShipDataSet.startDay, 
              create: displayStartDaySliderValue,
              slide: applyStartDaySliderValue,
              change: onSelectStartDay
          });
      
      $("#dayRow").append("<td id = 'endDay'");
        $("#endDay").append("<span class = 'boxSpan' id = 'endDaySpan'>");
        $("#endDaySpan").append("<label for 'endDaySlider'>Day:</label>"
            + "<div class = 'slider' id = 'endDaySlider'></div>"
            + "</span></td>");
          $("#endDaySlider").slider( {
              min: ShipDataSet.minDay, 
              max: ShipDataSet.maxDay,
              step: 1,
              value: ShipDataSet.endDay, 
              create: displayEndDaySliderValue,
              slide: applyEndDaySliderValue,
              change: onSelectEndDay
          });

    $("#timeTable").append("</tbody>");
}
 
////////////////////////////////////////////////////////////////////////////////
//
// Display the current Start Year value as an integer on the corresponding
// slider knob and save it to use elsewhere.
//
////////////////////////////////////////////////////////////////////////////////
var applyStartYearSliderValue = function(event, ui){
  $("#startYearSlider").find("a:first").text(ui.value);
  ShipDataSet.startYear = ui.value;
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var displayStartYearSliderValue = function(event, ui){
  $("#startYearSlider").find("a:first").text(ShipDataSet.startYear);
}

////////////////////////////////////////////////////////////////////////////////
//
// Display the current End Year value as an integer on the corresponding
// slider knob and save it to use elsewhere.
//
////////////////////////////////////////////////////////////////////////////////
var applyEndYearSliderValue = function(event, ui){
  $("#endYearSlider").find("a:first").text(ui.value);
  ShipDataSet.endYear = ui.value;
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var displayEndYearSliderValue = function(event, ui){
  $("#endYearSlider").find("a:first").text(ShipDataSet.endYear);
}

////////////////////////////////////////////////////////////////////////////////
//
// Display the current Start Month value as an integer on the corresponding
// slider knob and save it to use elsewhere.
//
////////////////////////////////////////////////////////////////////////////////
var applyStartMonthSliderValue = function(event, ui){
  $("#startMonthSlider").find("a:first").text(ui.value);
  ShipDataSet.startMonth = ui.value;
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var displayStartMonthSliderValue = function(event, ui){
  $("#startMonthSlider").find("a:first").text(ShipDataSet.startMonth);
}

////////////////////////////////////////////////////////////////////////////////
//
// Display the current End Month value as an integer on the corresponding
// slider knob and save it to use elsewhere.
//
////////////////////////////////////////////////////////////////////////////////
var applyEndMonthSliderValue = function(event, ui){
  $("#endMonthSlider").find("a:first").text(ui.value);
  ShipDataSet.endMonth = ui.value;
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var displayEndMonthSliderValue = function(event, ui){
  $("#endMonthSlider").find("a:first").text(ShipDataSet.endMonth);
}

////////////////////////////////////////////////////////////////////////////////
//
// Display the current Start Day value as an integer on the corresponding
// slider knob and save it to use elsewhere.
//
////////////////////////////////////////////////////////////////////////////////
var applyStartDaySliderValue = function(event, ui){
  $("#startDaySlider").find("a:first").text(ui.value);
  ShipDataSet.startDay = ui.value;
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var displayStartDaySliderValue = function(event, ui){
  $("#startDaySlider").find("a:first").text(ShipDataSet.startDay);
}

////////////////////////////////////////////////////////////////////////////////
//
// Display the current End Day value as an integer on the corresponding
// slider knob and save it to use elsewhere.
//
////////////////////////////////////////////////////////////////////////////////
var applyEndDaySliderValue = function(event, ui){
  $("#endDaySlider").find("a:first").text(ui.value);
  ShipDataSet.endDay = ui.value;
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var displayEndDaySliderValue = function(event, ui){
  $("#endDaySlider").find("a:first").text(ShipDataSet.endDay);
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var addContact = function() {
  $("#bottomLeftTable").append("<tr id = 'contactRow'></tr>");
  $("#contactRow").append("<td id = 'contactElt'></td>");
  $("#contactElt").append("<p>Comments? Do you have data to "
      + "add?<a href = "
      + "'mailto:stevec@renci.org?Subject = MoNCP%20website%20comments'>"
      + " Send email</a></p>");
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var addCassarLink = function() {
  $("#bottomLeftTable").append("<tr id = 'cassarLinkRow'></tr>");
  $("#cassarLinkRow").append("<td id = 'cassarLinkElt'></td>");
  $("#cassarLinkElt").append("<p>Read about<a href = "
      + "'http://www.nicholas.duke.edu/people/faculty/cassar/projects.htm'>"
      + " The Cassar Laboratory</a></p>");
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var addLogos = function() {
 $("#bottomLeftTable").append("<tr id = 'logoRowOuter'></tr>");
  $("#logoRowOuter").append("<td id = 'logoElt'></td>");
  $("#logoElt").append("<img class = 'logo' src = './logos.png'>");
}
