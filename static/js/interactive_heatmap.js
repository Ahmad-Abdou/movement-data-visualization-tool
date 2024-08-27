// Fetching data loaded through flask backend
fetch(interactiveHeatmapData)
  .then(function(response) {
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
  })
  .then(function(data) {
      // console.log(data);
      runInteractiveHeatmapFunction(data);
  })
  .catch(function(error) {
      console.error('There was a problem with the fetch operation:', error);
  });

// // set the dimensions and margins of the graph
// var interactiveHeatMargin = {top: 20, right: 25, bottom: 30, left: 40},
//   width = 450 - interactiveHeatMargin.left - interactiveHeatMargin.right,
//   height = 450 - interactiveHeatMargin.top - interactiveHeatMargin.bottom;


  // Set the dimensions and margins of the graph
var interactiveHeatMargin = {top: 20, right: 25, bottom: 30, left: 40},
interactiveHeatWidth = SVGWIDTH,
interactiveHeatheight = SVGHEIGHT;

// Append the SVG object to the body of the page
var interactiveHeatSvg = d3.select(".interactive-heatmap")
    .append("svg")
    .attr("width", interactiveHeatWidth + margin.left + margin.right)
    .attr("height", interactiveHeatheight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Read the data
// d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv").then(function(data) {
function runInteractiveHeatmapFunction(fetchedData) {
  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  const myGroups = Array.from(new Set(fetchedData.map(d => d.group)))
  const myVars = Array.from(new Set(fetchedData.map(d => d.variable)))

  // Build X scales and axis:
  const x = d3.scaleBand()
    .range([ 0, interactiveHeatWidth ])
    .domain(myGroups)
    .padding(0.05);
  interactiveHeatSvg.append("g")
    .style("font-size", 15)
    .attr("transform", `translate(0, ${interactiveHeatheight})`)
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove()

  // Build Y scales and axis:
  const y = d3.scaleBand()
    .range([ interactiveHeatheight, 0 ])
    .domain(myVars)
    .padding(0.05);
  interactiveHeatSvg.append("g")
    .style("font-size", 15)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()

  // Build color scale
  const myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([1,100])

  // create a tooltip
  const tooltip = d3.select(".interactive-heatmap")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  // Three function that change the tooltip when user hover / move / leave a cell
  const mouseover = function(event,d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  const mousemove = function(event,d) {
    tooltip
      .html("The exact value of<br>this cell is: " + d.value)
      .style("left", (event.x)/2 + "px")
      .style("top", (event.y)/2 + "px")
  }
  const mouseleave = function(event,d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

  // add the squares
  interactiveHeatSvg.selectAll()
    .data(fetchedData, function(d) {return d.group+':'+d.variable;})
    .join("rect")
      .attr("x", function(d) { return x(d.group) })
      .attr("y", function(d) { return y(d.variable) })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d.value)} )
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
}

// Add title to graph
interactiveHeatSvg.append("text")
        .attr("x", 0)
        .attr("y", -50)
        .attr("text-anchor", "left")
        .style("font-size", "22px")
        .text("A d3.js heatmap");

// Add subtitle to graph
interactiveHeatSvg.append("text")
        .attr("x", 0)
        .attr("y", -20)
        .attr("text-anchor", "left")
        .style("font-size", "14px")
        .style("fill", "grey")
        .style("max-width", 400)
        .text("A short description of the take-away message of this chart.");

