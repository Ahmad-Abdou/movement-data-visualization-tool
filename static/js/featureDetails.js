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
    this.operation = null
    this.sub_trajectory = []
    this.data_without_filtering = null
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
        .attr('y', (this.svgHeight / 2) - 80)
        .attr('text-anchor', 'middle')
        .attr('transform', `rotate(-90, 40, ${this.svgHeight / 2})`)
  }

  async drawQuantile(name) {
    let splitted = name.split("_")[0]; 
    if (splitted === 'angles') {
      splitted = 'angle'
    }
    const result = [];

    const response = await fetch(`/api/feats/quantile?tid=${selectedTrajectory1},${selectedTrajectory2}&stats=${name}`);
    
    if(!selectedTrajectory1) {
      notifyMessage('Please select a trajectory first')
    }
    if (name.split("_")[1] == 'geometry') {
      notifyMessage("Ask Amilcar!!!!")
      return
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    if (!responseData || responseData.length === 0) {
        throw new Error('No data received');
    }
    const data = responseData.data
    this.operation = responseData.operation
    this.data_without_filtering = responseData.rows
    this.sub_trajectory = responseData.rows
    .filter(row => row && row[splitted] !== undefined && row.time)
    .map(row => ({
      time: row.time,
      feature: row[splitted]
    }))

    data.forEach((row) => {
        if (row[splitted] !== undefined) { 
            result.push({
              time: row.time,
              feature: row[splitted],
            });
        }
    });
    return result
}

async showPercentile(y_lablel) {
  try {

    this.svg.selectAll(".chart-content").remove();

    const chartGroup = this.svg.append("g")
        .attr("class", "chart-content");

    const timeParsed = d3.timeParse("%Y-%m-%d %H:%M:%S");

    this.sub_trajectory.forEach(d => {
      d.time = timeParsed(d.time);
      d.feature = +d.feature;
  });
    const xScale = d3.scaleTime()
        .domain(d3.extent(this.sub_trajectory, d => d.time))
        .range([0, this.width - 100]);

    const yScale = d3.scaleLinear()
        .domain([d3.min(this.sub_trajectory, d => d.feature), d3.max(this.sub_trajectory, d => d.feature)])
        .range([this.height - 150, 0]);

    const line = d3.line()
        .defined(d => !isNaN(d.feature))
        .x(d => xScale(d.time))
        .y(d => yScale(d.feature));

    if(this.sub_trajectory.length != 0) {
      chartGroup.append("path")
      .datum(this.sub_trajectory)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", () => kinematic.includes(y_lablel) ? "#0080FF" : "#DC143C80")
      .attr("stroke-width", 2)
      .attr("d", line);

      chartGroup.append('text')
      .text(this.operation)
      .attr('x', 130)
      .attr('y', -40)
      .attr('font-size', 15)
      .attr('font-weight', 500)

      let splitted = y_lablel.split("_").splice(1).join("_"); 
        if (splitted === 'quant_median' || splitted === 'mean'|| splitted === 'mad' || splitted === "meanse") {
          chartGroup.append("line")
          .attr("class", "stat-line")
          .attr("x1", 0)                          
          .attr("x2", this.width - 100)           
          .attr("y1", yScale(this.operation))     
          .attr("y2", yScale(this.operation))     
          .attr("stroke", kinematic.includes(y_lablel) ? "#DC143C80" : "#0080FF")
          .attr("stroke-width", 4)
          .style('stroke-dasharray', 15)
        } else {
          chartGroup.append('circle')
          .attr('class', 'stat-circle')
          .attr('r', 5)
          .attr('cx', yScale(this.operation))
          .attr('cy', 100)
          .attr('fill', kinematic.includes(y_lablel) ? "#DC143C80" : "#0080FF")

        }
    const xAxis = d3.axisBottom(xScale)
        .ticks(5)
        .tickFormat(d3.timeFormat("%b:%d"));

    const yAxis = d3.axisLeft(yScale)
        .ticks(5);

    chartGroup.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${this.height - 150})`)
        .call(xAxis);

    chartGroup.append("g")
        .attr("class", "y-axis")
        .call(yAxis);
          await mapGl.traject(this.data_without_filtering, selectedTrajectory1);
          await mapGl2.traject(this.data_without_filtering, selectedTrajectory2);

    }


        
  } catch (error) {
    console.error("Error drawing line chart:", error);
  }
}

}