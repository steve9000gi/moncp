////////////////////////////////////////////////////////////////////////////////
//
// graphvisualization.js: constructor for objects that define how data is
// displayed in a Cartesian graph, either 2 or 3D.  If 2D, caller may just
// leave input parameters for one of the axes blank.
//
//  See www.renci.org/~stevec/Cassar/moncp.html for intended application.
//
////////////////////////////////////////////////////////////////////////////////

var AxisParams = function(scale, label, color) {
  this.scale = scale; // text: "linear" or "logarithmic"?
  this.label = label; // text label to be applied to axis
  this.color = color; // array of 3 numbers between 0.0 and 1.0
}

AxisParams.DEFAULT_SCALE = "linear";
AxisParams.DEFAULT_COLOR = [1.0, 1.0, 1.0];


var GraphVisualization = function(xData, yData, zData, xAxisParams, yAxisParams,
                                  zAxisParams, lineStyle, legendText) {
  this.xData = xData; // array of floats
  this.yData = yData; // array of floats
  this.zData = zData; // array of floats
  this.xAxisParams = xAxisParams;
  this.yAxisParams = yAxisParams;
  this.zAxisParams = zAxisParams;
  this.lineStyle = lineStyle; // int: 0=solid, 1=dotted, 2=dashed
  this.legendText = legendText;
}

GraphVisualization.prototype.getNumberOfAxes = function() {
  var n = 0;

  if (this.xData) {
    n++;
  }

  if (this.yData) {
    n++;
  }

  if (this.zData) {
    n++;
  }

  return n;
}
