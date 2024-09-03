// Fetching data loaded through flask backend
fetch(heatmapData)
  .then(function(response) {
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
  })
  .then(function(data) {
      // console.log(data);
      runHeatmapFunction(data);
  })
  .catch(function(error) {
      console.error('There was a problem with the fetch operation:', error);
  });


// set the dimensions and heatMapMargins of the graph
const heatMapMargin = {top: 30, right: 30, bottom: 30, left: 230}

// append the svg object to the body of the page
const heatMapSvg = d3.select(".heat-map")
.append("svg")
  .attr("width", SVGWIDTH + heatMapMargin.left + heatMapMargin.right)
  .attr("height", SVGHEIGHT + heatMapMargin.top + heatMapMargin.bottom)
.append("g")
  .attr("transform", `translate(${heatMapMargin.left},${heatMapMargin.top})`);

// Labels of row and columns
const myGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
const myVars = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"]

// Build X scales and axis:
const x = d3.scaleBand()
  .range([ 0, SVGWIDTH ])
  .domain(myGroups)
  .padding(0.01);
  heatMapSvg.append("g")
  .attr("transform", `translate(0, ${SVGHEIGHT})`)
  .call(d3.axisBottom(x))

// Build X scales and axis:
const y = d3.scaleBand()
  .range([ SVGHEIGHT, 0 ])
  .domain(myVars)
  .padding(0.01);
  heatMapSvg.append("g")
  .call(d3.axisLeft(y));

// Build color scale
const myColor = d3.scaleLinear()
  .range(["white", "#69b3a2"])
  .domain([1,100])

//Read the data
// d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv").then( function(data) {
function runHeatmapFunction(fetchedData) {
  // create a tooltip
  const tooltip = d3.select(".heat-map")
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
    tooltip.style("opacity", 1)
  }
  const mousemove = function(event,d) {
    tooltip
      .html("The exact value of<br>this cell is: " + d.value)
      .style("left", (event.x)/2 + "px")
      .style("top", (event.y)/2 + "px")
  }
  const mouseleave = function(d) {
    tooltip.style("opacity", 0)
  }

  // add the squares
  heatMapSvg.selectAll()
    .data(fetchedData, function(d) {return d.group+':'+d.variable;})
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.group) })
      .attr("y", function(d) { return y(d.variable) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d.value)} )
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
}
