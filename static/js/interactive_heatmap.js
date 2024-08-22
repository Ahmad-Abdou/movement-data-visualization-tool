// // set the dimensions and margins of the graph
// var interactiveHeatMargin = {top: 20, right: 25, bottom: 30, left: 40},
//   width = 450 - interactiveHeatMargin.left - interactiveHeatMargin.right,
//   height = 450 - interactiveHeatMargin.top - interactiveHeatMargin.bottom;


  // Set the dimensions and margins of the graph
var interactiveHeatMargin = {top: 20, right: 25, bottom: 30, left: 40},
width = SVGWIDTH,
height = SVGHEIGHT;

// Append the SVG object to the body of the page
var interactiveHeatSvg = d3.select(".interactive-heatmap")
.append("svg")
.attr("width", width + interactiveHeatMargin.left + interactiveHeatMargin.right)
.attr("height", height + interactiveHeatMargin.top + interactiveHeatMargin.bottom)
.append("g")
.attr("transform", "translate(" + interactiveHeatMargin.left + "," + interactiveHeatMargin.top + ")");

// Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv").then(function(data) {

// Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
var myGroups = Array.from(new Set(data.map(d => d.group)));
var myVars = Array.from(new Set(data.map(d => d.variable)));

// Build X scales and axis:
var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(0.05);

interactiveHeatSvg.append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove();

// Build Y scales and axis:
var y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0.05);

interactiveHeatSvg.append("g")
    .style("font-size", 15)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove();

// Build color scale
var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([1, 100]);

// Create a tooltip
var Tooltip = d3.select(".interactive-heatmap")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

// Functions to change the tooltip when user hover / move / leave a cell
var mouseover = function(event, d) {
    Tooltip.style("opacity", 1);
    d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1);
};

var mousemove = function(event, d) {
    Tooltip
        .html("The exact value of<br>this cell is: " + d.value)
        .style("left", (d3.pointer(event)[0] + 70) + "px")
        .style("top", (d3.pointer(event)[1]) + "px");
};

var mouseleave = function(event, d) {
    Tooltip.style("opacity", 0);
    d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8);
};

// Add the squares
interactiveHeatSvg.selectAll("rect")
    .data(data, function(d) { return d.group + ':' + d.variable; })
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.group); })
    .attr("y", function(d) { return y(d.variable); })
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", function(d) { return myColor(d.value); })
    .style("stroke-width", 4)
    .style("stroke", "none")
    .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
});
