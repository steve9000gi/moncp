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
//
//  Steve Chall, Renaissance Computing Institute:  stevec@renci.org
//
////////////////////////////////////////////////////////////////////////////////

$(document).ready(function() {
  addOuterElements();
  addReturnText();
  //addLoginControls();
  addColorMaps();
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
  drawRainbowColorMap();
  $(window).resize(function() {
     updateMapSize();
  });
})

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var setupEventHandlers = function() {
  $("#shipDropdown").on("change", selectShipDataVariable);
  $("#satelliteDropdown").on("change", selectSatelliteDataVariable);
  $("#newShipDataButton").on("click", openNewShipData);
  $("#shipColorMapMin").on("change", updateVarMin);
  $("#shipColorMapMax").on("change", updateVarMax);
  $("#getShipDataButton").on("click", getShipData);
  $("#mapSzCtrl").on("change", selectMapSize);
}

////////////////////////////////////////////////////////////////////////////////
//
// Event handler for Ship Data popup: set the variable to be displayed according
// to the menu item selected.
// 
// varMIn and varMax are used to colormap the variable values appropriately.
//
////////////////////////////////////////////////////////////////////////////////
var selectShipDataVariable = function(e) {
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
      alert("selectShipDataVariable: invalid index.");
      return;
  }
  
  ShipDataSet.numIx = this.selectedIndex;
  var name = ShipDataSet.variableTypes[ShipDataSet.numIx] + " "
      + $("#startYearSlider")[0].textContent;

  updateShipDataColorMapInfo();

  var layer = ShipDataSet.map.layers[ShipDataSet.map.layers.length - 1];
  var layerSwitcher =
      ShipDataSet.map.getControlsByClass("OpenLayers.Control.LayerSwitcher")[0];

  if (layer) {
    layer.setName(name);
    layer.redraw();
  }
}

////////////////////////////////////////////////////////////////////////////////
//
// Event handler for Satellite Data popup: set the variable to be displayed
// according to the menu item selected.
//
////////////////////////////////////////////////////////////////////////////////
var selectSatelliteDataVariable = function(e) {
  alert("Satellite data: not implemented for "
      + SatelliteDataSet.minVarTypes[this.selectedIndex] + ".");
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

  if (month === 2) { // February
    if (year % 4) { // Not a leap year
      maxDay = 28;
    } else {
      maxDay = 29;
    }
  } else if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
    maxDay = 30;
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
// Event handler for startYear slider
//
////////////////////////////////////////////////////////////////////////////////
var selectStartYear = function(e, ui) {
  ShipDataSet.startDay = setMaxDay(ShipDataSet.startYear,
      $("#startMonthSlider").slider("value"), "#startDaySlider");
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var selectEndYear = function(e, ui) {
  ShipDataSet.endDay = setMaxDay(ShipDataSet.endYear,
      $("#endMonthSlider").slider("value"), "#endDaySlider");
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var selectStartMonth = function(e, ui) {
  ShipDataSet.startDay = setMaxDay(ShipDataSet.startYear,
      $(this).slider("value"), "#startDaySlider");
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var selectEndMonth = function(e, ui) {
  ShipDataSet.endDay = setMaxDay(ShipDataSet.endYear, $(this).slider("value"),
      "#endDaySlider");
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var selectStartDay = function(e, ui) {
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var selectEndDay = function(e, ui) {
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var addOuterElements = function() {
  $("body").append("<table class = 'noBorder' id = 'bigTable'>"
      + "</table>");

  $("#bigTable").append("<tr id = 'titleRow'></tr>");
  $("#titleRow").append("<th id = 'titleHead' colspan='2'></th>");
  $("#titleHead").append("<h2 id = 'centeredTitle'>Measurements of Net "
      + "Community Production (MoNCP) in the World's Oceans</h2>");

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
  $("#returnTextGroup").append("<legend class = 'legendText'>Return Text and "
      + "Status</legend>");
  $("#returnTextGroup").append("<div id = 'returnStatus'></div><br>");
  $("#returnTextGroup").append("<div id = 'returnText'></div");
}

////////////////////////////////////////////////////////////////////////////////
//
// Currently a stub, thus disabled.
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
////////////////////////////////////////////////////////////////////////////////
var drawRainbowColorMap = function() {
  var canvas = $("#shipDataColorMap")[0];
  if (canvas.getContext) {
    var context = canvas.getContext("2d");
    var width = 95;
    var height = 19;

    for (var i = 0; i < width; i++) {
      var rgb = getColorFromLinearValue(0, width, i);
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
  $("#topRow").append("<td id = 'colorMapsElt'></td");
  $("#colorMapsElt").append("<fieldset class = 'groupBox' id = 'colorMapGroup'>"
      + "<legend class = 'legendText'>Color Maps</legend>"
      + "<span class = 'boxSpan' id = 'shipDataClrMapSpan'>Ship Data: "
      + "<label for = 'shipColorMapMin' id = shipColorMapMinLabel>Min</label>"
      + "<input type = 'number' class = 'numEntry' id = 'shipColorMapMin'"
      + "size = 3'>"

// Canvas color map
      + "<canvas id = 'shipDataColorMap' class = 'clrMap' width = '95' height ="
      + "'19' title = 'By default, the Min and Max values are extracted from "
      + "the currently loaded data (for selected year and selected time "
      + "period). You can change the Min and Max values dynamically. If the "
      + "value for a data point is less than the Min displayed, that data point"
      + " will be colored black.  If that value is greater than the displayed "
      + "Max, it will be colored white.'></canvas>"
// end Canvas color map

//      + "<img class = 'clrMap' src = './rainbow.png' alt = 'ship"
//      + " data color map' title = 'Click to change (not implemented)'>"
      + "<input type = 'number' class = 'numEntry' id = 'shipColorMapMax'"
      + "size = 3>"
      + "<label for = 'shipColorMapMax' id = shipColorMapMinLabel>Max</label>"
      + "</span><br>"
      + "<span class = 'boxSpan'>Satellite Data: "
      + "<label for = 'satColorMapMin' id = satColorMapMinLabel>Min</label>"
      + "<input type = 'number' class = 'numEntry' id = 'satColorMapMin'"
      + "size = 3 disabled = 'disabled'>"
      + "<img class = 'clrMap' src = './grayScale.png' alt = "
      + "'satellite data color map' title = 'Click to change (not implemented)'"
      + "><input type = 'number' class = 'numEntry' id = 'satColorMapMax'"
      + "size = 3 disabled = 'disabled'>"
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
// This function updates ShipDataSet.varMin, and then causes all the ship data
// points to be recolored based on the new min value.
//
// It currently does not update the current min value for the selected variable,// so if you change which ship data variable is being displayed and come back, 
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
// This function updates ShipDataSet.varMax, and then causes all the ship data
// points to be recolored based on the new max value.
//
// It currently does not update the current max value for the selected variable,// so if you change which ship data variable is being displayed and come back, 
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
// http://www.peterrobins.co.uk/it/olchangingprojection.html
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
  sphericalMercator = new OpenLayers.Projection("EPSG:3857"); 

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
// Rainbow color map only.
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
// See http://openlayers.org/dev/examples/stylemap.html.
//
// Preconditions: * The timeline slider has been instantiated and has a value.
//                * The Ship color map functionailty has all been instantiated.
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
//      getColor: getPointColor(feature),
 /**/   getColor: function(feature) {
      var i = feature.attributes["dataIndex"];

      // Value too big? color it white:
      if (ShipDataSet.all[i][ShipDataSet.varIx] > ShipDataSet.varMax) {
        return "rgb(255, 255, 255)";
      }

      // Too small? make it black:
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
    },
/**/
    getSize: function(feature) {
      return 3;
    }
  };

  var template = {
    pointRadius: "${getSize}", // using context.getSize(feature)
    fillColor: "${getColor}",  // using context.getColor(feature)
    strokeColor: "${getColor}"
  };

  var defaultStyle = new OpenLayers.Style(template, {context: context});

  var dataStyles = new OpenLayers.StyleMap({
      "default": defaultStyle,
      "select": new OpenLayers.Style({
	  //fillColor: "#66ccff",
	  //strokeColor: "#3399ff",
	  strokeColor: "#ffffff",
	  fillColor: "#000000",
	  graphicZIndex: 2
      })
  });

  var points = new OpenLayers.Layer.Vector(
      ShipDataSet.variableTypes[ShipDataSet.numIx] + " "
          + ShipDataSet.startYear,
      {
	styleMap: dataStyles,
	rendererOptions: {zIndexing: true}
      }
  );
  points.addFeatures(shipDataPoints);

  map.addLayer(points);

  var select = new OpenLayers.Control.SelectFeature(
      points,
      { hover: true,
	onBeforeSelect: function(feature) {
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
	  map.addPopup(popup);
	  return true;
	},
	onUnselect: function(feature) {
	  map.removePopup(feature.popup);
	  feature.popup.destroy();
	  feature.popup = null;
	}
      }
  );

  map.addControl(select);
  select.activate();
  ShipDataSet.selectControl = select;

  map.setCenter(new OpenLayers.LonLat(0, 0), 1);

  //computeMinMaxValues();
  //updateShipDataColorMapInfo();
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
////////////////////////////////////////////////////////////////////////////////
var getColorFromLinearValue = function(min, max, val) {
  var fraction = 1 - (val - min) / (max - min);
  var minHue = 260 / 360;
  var maxHue = 0 / 360;
  var hue = (minHue - maxHue) * fraction;
  var saturation = 0.9; // 0.96; // 0.0 <= saturation <= 1.0
  var lightness = 0.47;  // 0.0 <= saturation <= 1.0
  return hslToRgb(hue, saturation, lightness);
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
          $("#mapSzCtrl").append($("<option>600 X 300</option>"));
          $("#mapSzCtrl").append($("<option>800 X 400</option>"));
          $("#mapSzCtrl").append($("<option>900 X 450</option>"));
          $("#mapSzCtrl").append($("<option>1000 X 500</option>"));
          $("#mapSzCtrl").append($("<option>1200 X 600</option>"));
          $("#mapSzCtrl")[0].selectedIndex = 2;
}

////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////
var selectMapSize = function() {
  var height;
  var width;

  switch (this.selectedIndex) {
    case 0:
      width = 600;
      height = 300;
      break;
    case 1:
      width = 800;
      height = 400;
      break;
    case 2:
      width = 900;
      height = 450;
      break;
    case 3:
      width = 1000;
      height = 500;
      break;
    case 4:
      width = 1200;
      height = 600;
      break;
    default:
      alert("selectMapSize: invalid selection");
      return;
  }

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
              change: selectStartYear
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
              change: selectEndYear
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
              change: selectStartMonth
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
              change: selectEndMonth
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
              change: selectStartDay
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
              change: selectEndDay
          });

    $("#timeTable").append("</tbody>");
}
 
////////////////////////////////////////////////////////////////////////////////
//
// Display it as a number on the slider and save it to use elsewhere.
// Do with the current year selected what needs to be done: display it on the
// slider and save it to use elsewhere.
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
// Display it as a number on the slider and save it to use elsewhere.
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
// Display it as a number on the slider and save it to use elsewhere.
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
// Display it as a number on the slider and save it to use elsewhere.
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
// Display it as a number on the slider and save it to use elsewhere.
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
// Display it as a number on the slider and save it to use elsewhere.
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
