class FeatureDetail {
  constructor(containerId, width, height, margin){
    this.containerId = containerId
    this.width = width
    this.height = height
    this.margin = margin
    this.availableWidth = width;
    this.availableHeight = height;
    this.svgWidth = 0.7 * this.availableWidth;
    this.svgHeight = 0.7 * this.availableHeight;
    this.offsetX = (this.availableWidth - this.svgWidth) / 2  - margin.right;
    this.offsetY = (this.availableHeight - this.svgHeight) / 2 - margin.top ;
    this.svg = d3.select(containerId).append('svg').attr('width', this.availableWidth).attr('height', this.availableHeight).attr('display', "flex").attr('justify-content', "center").append("g").attr("transform", `translate(${this.offsetX},${this.offsetY-20})`);
    this.xScale = d3.scaleLinear().domain([0,1]).range([0, this.svgWidth])
    this.yScale = d3.scaleLinear().domain([0,1]).range([this.svgHeight, 0])
    this.xAxis = d3.axisBottom(this.xScale)
    this.gx = this.svg.append('g').attr('transform', `translate(${this.margin.left},${this.svgHeight + this.margin.top})`);
    this.yAxis = d3.axisLeft(this.yScale)

    this.gy = this.svg.append('g').attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    this.axisLineGenerator = d3.line().x(d=> this.xScale(d)).y(d=> this.yScale(d))

    this.drawAxis(this.gx, this.gy)
  }

  drawAxis(gx, gy) {
    // this.xAxis(gx)
    // this.yAxis(gy)
  }

  drawAxisLabels(y_title) {
    this.svg.selectAll('.axis-label').remove();

    const labelGroup = this.svg.append("g")
        .attr("class", "axis-label")
        .style("pointer-events", "none");

    labelGroup.append('text')
        .attr('class', 'axis-title-x')
        .text('Time')
        .attr('font-size', 25)
        .attr('x', (this.svgWidth / 2) + 10)
        .attr('y', (this.svgHeight) + 20)
        .attr('text-anchor', 'middle')

    labelGroup.append('text')
        .attr('class', 'axis-title-y')
        .text(y_title)
        .attr('font-size', 20)
        .attr('x', 40)
        .attr('y', (this.svgHeight / 2) - 70)
        .attr('text-anchor', 'middle')
        .attr('transform', `rotate(-90, 40, ${this.svgHeight / 2})`)
  }

  async drawQuantile(name) {
    console.log(selectedTrajectory)
    let splitted = name.split("_")[0]; 
    if (splitted === 'angles') {
      splitted = 'angle'
    }
    const result = [];
    const response = await fetch(`/api/feats/quantile?tid=${selectedTrajectory}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!data || data.length === 0) {
        throw new Error('No data received');
    }

    data.forEach((row) => {
        if (row[splitted] !== undefined) { 
            result.push({
              time: row.time,
              feature: row[splitted]
              
            });
        }
    });

    return result
}

async timeConverter(features) {
  try {
    const data = await features;
    
    this.svg.selectAll(".chart-content").remove();

    const chartGroup = this.svg.append("g")
        .attr("class", "chart-content");

    const timeParsed = d3.timeParse("%Y-%m-%d %H:%M:%S");
    data.forEach(d => {
        d.time = timeParsed(d.time);
        d.feature = +d.feature;
    });

    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.time))
        .range([0, this.width - 100]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.feature)])
        .range([this.height - 150, 0]);

    const line = d3.line()
        .x(d => xScale(d.time))
        .y(d => yScale(d.feature));

    chartGroup.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    const xAxis = d3.axisBottom(xScale)
        .ticks(5)
        .tickFormat(d3.timeFormat("%H:%M:%S"));

    const yAxis = d3.axisLeft(yScale)
        .ticks(5);

    chartGroup.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${this.height - 150})`)
        .call(xAxis);

    chartGroup.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

  } catch (error) {
    console.error("Error drawing line chart:", error);
  }
}

}