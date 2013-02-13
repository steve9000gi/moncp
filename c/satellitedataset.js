////////////////////////////////////////////////////////////////////////////////
//
// satellitedataset.js: constructor for SatelliteDataSet objects. 
//
// A SatelliteDataSet contains a 2D numeric array of a single variable, ordered
// by latitude and longitude for a given day. This variable may be chlorophyll,r
// one of two sets of NPP values (each derived by a different algorithm),
// phytoplankton size distribution, particle size distribution, etc.
//
//  See www.renci.org/~stevec/Cassar/moncp.html for intended application.
//
////////////////////////////////////////////////////////////////////////////////

var SatelliteDataSet = function(satelliteInfo, day, variableType, variable) {
  this.satelliteInfo = satelliteInfo; // satellite name, sponsoring org., etc.
  this.variableType = variableType;   // string: "chlorophyll", "NPP1", "NPP2"..
  this.variable = variable;           // "2D" array of floats, as 1D vector
}

SatelliteDataSet.variableTypes = [ "None",
                                   "Bathymetry",
                                   "Chlorophyll",
                                   "NPP&#8321;",
                                   "NPP&#8322;",
                                   "Phytoplankton Size",
                                   "Particle Size" ];


SatelliteDataSet.minVarTypes =    [ "none",
                                   "bathymetry",
                                   "chlorophyll",
                                   "NPP1",
                                   "NPP2",
                                   "phytoplankton size distribution",
                                   "particle size distribution" ];


