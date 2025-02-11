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

  drawAxisLabels(x_title) {
    this.svg.selectAll('text.axis-title-x').remove()
    this.svg.append('text')
    .attr('class', 'axis-title-x')
    .text('Time')
    .attr('font-size', 30)
    .attr('x', (this.svgWidth /2 ) + 20 )
    .attr('y', (this.svgHeight ) + 20)
    .attr('text-anchor', 'middle')

    this.svg.append('text')
    .attr('class', 'axis-title-x')
    .text(x_title)

    .attr('font-size', 30)
    .attr('x', 40 )
    .attr('y', (this.svgHeight / 2) - 50 )
    .attr('text-anchor', 'middle')
    .attr('transform', `rotate(-90, 13, ${this.svgHeight / 2})`)
  }

  renderTrajectoryFeature(data) {
    const lineGenerator = d3.line().x(d=>d[0]).y(d=>d[1])
    console.log(data)
    // this.svg.append('path')
    // .data(data)
    // .attr('class', 'feature-detail')
    // .attr('d', lineGenerator())
  }
  async drawQuantile(name) {
    let splitted = name.split("_")[0]; 
    const result = [];
    const response = await fetch('/api/feats/quantile');
    console.log(response)
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
  const data = await features
  const timeParsed = d3.timeParse("%Y-%m-%d %H:%M:%S")
  data.forEach(d => {
    d.time = timeParsed(d.time)
  })
  const xScale = d3.scaleTime().domain(d3.extent(data, d => d.time)).range([0, this.width - 20])
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.feature)])
    .range([this.height - this.margin.bottom - 200, this.margin.top - 40]);
  const line = d3.line()
    .x(d => xScale(d.time))
    .y(d => yScale(d.feature)); 

  this.svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);

    const xAxis = d3.axisBottom(xScale)
    .ticks(5) 
    .tickFormat(d3.timeFormat("%H:%M:%S"));

this.svg.append("g")
    .attr("transform", `translate(0, ${this.height} )`)
    .call(xAxis);
}

}