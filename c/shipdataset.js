////////////////////////////////////////////////////////////////////////////////
//
// shipdataset.js: constructors for Ship and ShipDataSet objects. This is data
// acquired by ships equipped with sensors designed and constructed by Duke
// University's Nicolas Cassar.  These sensors record data on variables such
// as salinity and temperature for use in studying the effects of the oceans
// on concentrations of atmospheric oxygen and carbon dioxide.
//
// A ShipDataSet contains 1D arrays of multiple measured variables, ordered
// by time of acquisition (year).
//
// Author: Steve Chall, Renaissance Computing Institute:  stevec@renci.org
//
////////////////////////////////////////////////////////////////////////////////

var Ship = function(id, shipName, affiliation, researchers) {
  this.id = id;
  this.shipName = shipName; 	   
  this.affiliation = affiliation; 
  this.researchers = researchers;
  //Ship.all.push(this);
}

Ship.all = [];

Ship.selectedIndex = 0; // for "View or Change Ship Data" Ship dropdown


var ShipDataSet = function(id, o2ar, ncp, salinity, temperature, pressure, ship,
                           year, month, day, lon, lat, neto2) {
  this.id = id; // id from the database table for later retreival
  this.o2ar = o2ar;                
  this.ncp = ncp;                 
  this.salinity = salinity;      
  this.temperature = temperature;  
  this.pressure = pressure;       
  this.ship = ship;              
  this.year = year;     
  this.month = month;     
  this.day = day;     
  this.lon = lon;              
  this.lat = lat;             
  this.neto2 = neto2;             
}

ShipDataSet.all = [];

ShipDataSet.variableTypes = [ "O&#8322;/Ar", 
                              "NCP", 
                              "Salinity",
                              "Temperature", 
                              "Pressure",
                              "Net O&#8322;" ];

ShipDataSet.minVarTypes = [   "O2/Ar",  // HTML won't show special chars
                              "NCP", 
                              "Salinity",
                              "Temperature", 
                              "Pressure",
                              "Net O2" ];

ShipDataSet.units = [         " %", 
                              " &#956;mol O&#8322; m&#8315;&sup2;d&#8315;&"
                                  + "sup1;",
                              " PSU",
                              "&deg; C.", 
                              " millibars",
                              " units" ];

ShipDataSet.minUnits = [      "%", 
                              "mmol O2 m^-2 d^-1",
                              "PSU",
                              "degrees C", 
                              "millibars",
                              "units" ];

ShipDataSet.colorMap = [      "Rainbow",
                              "Grayscale",
                              "Heated body" ];

ShipDataSet.dataSource = [    "ship",
                              "satellite"];

// These are temp approximate "reasonable" values for placing dummy data within
// appropriate ranges.  When real data are being used, the max and min values
// for each variable are dynamically computed from input.
//
ShipDataSet.o2arMin = -2.1;
ShipDataSet.o2arMax = 9.0;
ShipDataSet.ncpMin = -10.0;
ShipDataSet.ncpMax = 40.0;
ShipDataSet.saltMin = 33.0;
ShipDataSet.saltMax = 37.0;
ShipDataSet.tempMin = -2.0;         // degrees C.
ShipDataSet.tempMax = 29.0;
ShipDataSet.pressureMin = 99.0;     // millibars
ShipDataSet.pressureMax = 1003.0;
ShipDataSet.neto2Min = 2.0;
ShipDataSet.neto2Max = 22.0;

// Pseudo-static variables: pseudo-global access:
//
ShipDataSet.varMin = ShipDataSet.o2arMin;
ShipDataSet.varMax = ShipDataSet.o2arMax;
ShipDataSet.varIx = "o2ar";
ShipDataSet.numIx = 0;
ShipDataSet.minYear = 1997;
ShipDataSet.maxYear = 2012;
ShipDataSet.startYear = 2008;
//ShipDataSet.startYear = 2000;
ShipDataSet.endYear = 2008;
//ShipDataSet.endYear = 2000;
ShipDataSet.minMonth = 1;
ShipDataSet.maxMonth = 12;
ShipDataSet.startMonth = ShipDataSet.minMonth;
ShipDataSet.endMonth = 2;
ShipDataSet.minDay = 1;
ShipDataSet.maxDay = 31;
ShipDataSet.startDay = ShipDataSet.minDay;
ShipDataSet.endDay = 23;
//ShipDataSet.endDay = 3;
ShipDataSet.firstTime = true;
ShipDataSet.map;
ShipDataSet.selectedIndex = 0;
ShipDataSet.selectControl;
ShipDataSet.layerSwitcher;
ShipDataSet.shipData;
ShipDataSet.dataSourceIx = 0;       // "ship"
ShipDataSet.shipDataColorMapIx = 0; // "Rainbow";
ShipDataSet.satDataColorMapIx = 1;  // "Grayscale";
ShipDataSet.dataColorMapIx = { "shipIx": 0,
                               "satIx": 1
                             };
ShipDataSet.getRGBFromLinearValue;  // array of functions
ShipDataSet.colorMapSelector;  // array of selector strings for color maps
ShipDataSet.colorMapPSelector; // array of selector strings for color map labels
ShipDataSet.developmentVersion = 232;
