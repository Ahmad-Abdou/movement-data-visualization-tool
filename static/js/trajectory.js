// Set the dimensions and margins of the graph
const trajectoryMargin = {top: 300, right: 30, bottom: 30, left: 230};


// SVG dimensions
var trajectoryWidth = 1400,
trajectoryHeight = 1400;

// Create an SVG container
var trajectorySvg = d3.select(".trajectory-plot").append("svg")
    .attr("width", trajectoryWidth + trajectoryMargin.left + trajectoryMargin.right)
    .attr("height", trajectoryHeight + trajectoryMargin.top + trajectoryMargin.bottom)
    .append("g")
    .attr("transform", `translate(${trajectoryMargin.left},${trajectoryMargin.top})`);

// Define the line generator with the curve basis (equivalent to the old "basis" interpolation)
var line = d3.line()
    .curve(d3.curveBasis);

// Define a straight line generator without interpolation
var lineStraight = d3.line();

// Use the example datasets
// var crazyPoints = [ [86, 20], [100, 100], [400, 100], [400, 500] ];  // original 
var crazyPoints = [[22,45], [68,30], [30,25], [90,60], [86, 20], [100, 100], [400, 100], [400, 500],  [200,150], [80,100], [50,90], [300,600],
                   [425,665], [680,750], [900,750], [1200,1000], [1200, 832], [1200, 556], [1200, 550], [1200, 400], 
                   [1400,150], [1400,100], [1400,90], [1400,46],[1100,150], [850,100], [600,90], [680,46],[500,150], [600,100], [200,90], [50,46]]; 

// To change the path shape, change the datum below.
trajectorySvg.append("path")
   .datum(crazyPoints)
   .style("fill", "none")
   .style("stroke-width", 2)
   .attr("id", "basisPath")
   .attr("d", line)
   .attr("stroke", "gray")
   .attr("stroke-dasharray", "10,10");

// Select the path element and calculate total length for animations
var linePath = d3.select("#basisPath").node(),
    totalLength = linePath.getTotalLength(),
    totalDistance = 1500;

// Function to return the point at a specific distance along the path
var pointAtDistance = function(distance, path) {
  // Get the point at the given distance
  var length = distance / totalDistance * totalLength,
      point = path.getPointAtLength(length);
  
  // Find the perpendicular vector at that point
  var plusLength = length + 4 < totalLength ? length + 4 : totalLength,
      minusLength = length > 4 ? length - 4 : 0,
      pPlus = path.getPointAtLength(plusLength),
      pMinus = path.getPointAtLength(minusLength),
      dX = pPlus.x - pMinus.x,
      dY = pPlus.y - pMinus.y,
      D = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));

  point.perpVector = { x: dY / D , y: -dX / D };
  return point;
}

// Function to return the coordinates of a point to plot along the path
var plotCoords = function(plotPoint, path) {
  var point = pointAtDistance(plotPoint[0], path);
  return [point.x + point.perpVector.x * plotPoint[1] ,
          point.y + point.perpVector.y * plotPoint[1]];
}

// Example datasets
var plotPoints = d3.range(1500).map(function(d){ 
    return [d, 10 * (~~(d / 100) % 5)]; 
});

var axisLines = d3.range(0, 50, 10).map(function(h){ 
    return d3.range(100).map(function(d){ 
        return [d * 15, h]; 
    }); 
});

// Apply the transformation to the dataset (and the axis lines)
var axisLinesData = axisLines.map(function(v) { 
    return v.map(function(d) {
        return plotCoords(d, linePath); 
    }); 
});

var trajectoryData = plotPoints.map(function(d) {
    return plotCoords(d, linePath); 
});

// Draw the parallel lines with axisLinesData
trajectorySvg.selectAll(".axis-line")
   .data(axisLinesData)
   .enter().append("path")
   .style("fill", "none")
   .style("stroke-width", 1)
   .attr("class", "line")
   .attr("stroke", "#ccc")
   .attr("d", lineStraight);

// Draw the orange curve defined in plotPoints
trajectorySvg.append("path")
   .datum(trajectoryData)
   .style("fill", "none")
   .style("stroke-width", 3)
   .attr("class", "line")
   .attr("stroke", "orange")
   .attr("opacity", 0.8)
   .attr("d", lineStraight);
