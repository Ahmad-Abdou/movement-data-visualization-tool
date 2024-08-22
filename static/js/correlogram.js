// Set the dimensions and margins of the graph
const correlogramMargin = {top: 300, right: 30, bottom: 30, left: 230};
const correlograWIDTH = 800; 
const correlograHEIGHT = 800;

// Append the SVG object to the body of the page
const correlogramSvg = d3.select(".correlogram")
  .append("svg")
    .attr("width", correlograWIDTH + correlogramMargin.left + correlogramMargin.right)
    .attr("height", correlograHEIGHT + correlogramMargin.top + correlogramMargin.bottom)
  .append("g")
    .attr("transform", `translate(${correlogramMargin.left},${correlogramMargin.top})`);

d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_correlogram.csv").then(function(rows) {
  
  // Going from wide to long format
  var data = [];
  rows.forEach(function(d) {
    var x = d[""];
    delete d[""];
    for (var prop in d) {
      var y = prop;
      var value = d[prop];
      data.push({
        x: x,
        y: y,
        value: +value
      });
    }
  });

  // List of all variables and number of them
  var domain = Array.from(new Set(data.map(function(d) { return d.x; })));
  var num = Math.sqrt(data.length);

  // Create a color scale
  var color = d3.scaleLinear()
    .domain([-1, 0, 1])
    .range(["#B22222", "#fff", "#000080"]);

  // Create a size scale for bubbles on the top right
  var size = d3.scaleSqrt()
    .domain([0, 1])
    .range([0, 18]);

  // X scale
  var x = d3.scalePoint()
    .range([0, correlograWIDTH])
    .domain(domain);

  // Y scale
  var y = d3.scalePoint()
    .range([0, correlograHEIGHT])
    .domain(domain);

  // Create one 'g' element for each cell of the correlogram
  var cor = correlogramSvg.selectAll(".cor")
    .data(data)
    .enter()
    .append("g")
      .attr("class", "cor")
      .attr("transform", function(d) {
        return "translate(" + x(d.x) + "," + y(d.y) + ")";
      });

  // Low left part + Diagonal: Add the text with specific color
  cor
    .filter(function(d){
      var ypos = domain.indexOf(d.y);
      var xpos = domain.indexOf(d.x);
      return xpos <= ypos;
    })
    .append("text")
      .attr("y", 5)
      .text(function(d) {
        if (d.x === d.y) {
          return d.x;
        } else {
          return d.value.toFixed(2);
        }
      })
      .style("font-size", 28)
      .style("text-align", "center")
      .style("fill", function(d){
        if (d.x === d.y) {
          return "#000";
        } else {
          return color(d.value);
        }
      });

  // Upper right part: add circles
  cor
    .filter(function(d){
      var ypos = domain.indexOf(d.y);
      var xpos = domain.indexOf(d.x);
      return xpos > ypos;
    })
    .append("circle")
      .attr("r", function(d){ return size(Math.abs(d.value)) })
      .style("fill", function(d){
        if (d.x === d.y) {
          return "#000";
        } else {
          return color(d.value);
        }
      })
      .style("opacity", 0.8);
  
}).catch(function(error) {
  console.error("Error loading or processing data:", error);
});
