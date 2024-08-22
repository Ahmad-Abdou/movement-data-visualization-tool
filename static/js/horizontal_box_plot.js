// Set the dimensions and margins of the graph
var hor_box_margin = {top: 150, right: 0, bottom: 250, left: 70},
    horBoxplotWidth = 1200 - hor_box_margin.left - hor_box_margin.right,
    horBoxplotheight = 1400 - hor_box_margin.top - hor_box_margin.bottom;

// Append the svg object to the body of the page
var horBoxSvg = d3.select(".horizontal-box-plot")
  .append("svg")
    .attr("width", horBoxplotWidth + hor_box_margin.left + hor_box_margin.right)
    .attr("height", horBoxplotheight + hor_box_margin.top + hor_box_margin.bottom)
  .append("g")
    .attr("transform", "translate(" + hor_box_margin.left + "," + hor_box_margin.top + ")")
    .attr("class", "tooltip");
// Read the data and compute summary statistics for each species
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv").then(function(data) {

  // Compute quartiles, median, inter quantile range, min, and max
  var sumstat = Array.from(
    d3.group(data, d => d.Species),
    ([key, values]) => {
      var q1 = d3.quantile(values.map(g => +g.Sepal_Length).sort(d3.ascending), 0.25);
      var median = d3.quantile(values.map(g => +g.Sepal_Length).sort(d3.ascending), 0.5);
      var q3 = d3.quantile(values.map(g => +g.Sepal_Length).sort(d3.ascending), 0.75);
      var interQuantileRange = q3 - q1;
      var min = q1 - 1.5 * interQuantileRange;
      var max = q3 + 1.5 * interQuantileRange;
      return {
        key: key,
        value: { q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max }
      };
    }
  );

  // Show the Y scale
  var y = d3.scaleBand()
    .range([horBoxplotheight, 0])
    .domain(["setosa", "versicolor", "virginica"])
    .padding(.4);
  horBoxSvg.append("g")
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove();

  // Show the X scale
  var x = d3.scaleLinear()
    .domain([4, 8])
    .range([0, horBoxplotWidth]);
  horBoxSvg.append("g")
    .attr("transform", "translate(0," + horBoxplotheight + ")")
    .call(d3.axisBottom(x).ticks(5))
    .select(".domain").remove();

  // Color scale
  var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([2, 7]); // original was 4 and 8

  // Add X axis label
  horBoxSvg.append("text")
    .attr("text-anchor", "end")
    .attr("x", horBoxplotWidth)
    .attr("y", horBoxplotheight + hor_box_margin.top + 30)
    .text("Sepal Length");

  // Show the main vertical line
  horBoxSvg
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", d => x(d.value.min))
      .attr("x2", d => x(d.value.max))
      .attr("y1", d => y(d.key) + y.bandwidth() / 2)
      .attr("y2", d => y(d.key) + y.bandwidth() / 2)
      .attr("stroke", "black")
      .style("width", 40);

  // Rectangle for the main box
  horBoxSvg
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
      .attr("x", d => x(d.value.q1))
      .attr("width", d => x(d.value.q3) - x(d.value.q1))
      .attr("y", d => y(d.key))
      .attr("height", y.bandwidth())
      .attr("stroke", "black")
      .style("fill", "#69b3a2")
      .style("opacity", 0.8);

  // Show the median
  horBoxSvg
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("y1", d => y(d.key))
      .attr("y2", d => y(d.key) + y.bandwidth() / 2)
      .attr("x1", d => x(d.value.median))
      .attr("x2", d => x(d.value.median))
      .attr("stroke", "black")
      .style("width", 80);

  // Create a tooltip
  var tooltip = d3.select(".horizontal-box-plot")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("font-size", "36px");

  // Functions to change the tooltip when user hovers/moves/leaves a cell
  var mouseover = function(d) {
    tooltip.transition().duration(200).style("opacity", 1);
    tooltip.html("<span style='color:grey'>Sepal length: </span>" + d.Sepal_Length)
      .style("left", (d3.pointer(d)[0] + 30) + "px")
      .style("top", (d3.pointer(d)[1] + 30) + "px");
  };
  var mousemove = function(d) {
    tooltip.style("left", (d3.pointer(d)[0] + 30) + "px")
      .style("top", (d3.pointer(d)[1] + 30) + "px");
  };
  var mouseleave = function(d) {
    tooltip.transition().duration(200).style("opacity", 0);
  };

  // Add individual points with jitter
  var jitterWidth = 150;
  horBoxSvg
    .selectAll("indPoints")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", d => x(d.Sepal_Length))
      .attr("cy", d => y(d.Species) + (y.bandwidth() / 2) - jitterWidth / 2 + Math.random() * jitterWidth)
      .attr("r", 4)
      .style("fill", d => myColor(+d.Sepal_Length))
      .attr("stroke", "black")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

}).catch(function(error) {
  console.error("Error loading or processing data:", error);
});
