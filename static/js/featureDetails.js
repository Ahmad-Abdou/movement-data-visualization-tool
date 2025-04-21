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
    this.data_without_filtering1 = null
    this.data_without_filtering2 = null
    this.operation2 = null
    this.sub_trajectory2 = []
  }
  drawAxisLabels(y_title) {
    this.svg.selectAll('.axis-label').remove();

    const labelGroup = this.svg.append("g")
        .attr("class", "axis-label")
        .style("pointer-events", "none");

    labelGroup.append('text')
        .attr('class', 'axis-title-x')
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
    console.log(responseData.results)

    if (!responseData || responseData.length === 0) {
        throw new Error('No data received');
    }
    if(selectedTrajectory1) {
      this.operation = responseData.results[0].operation
      this.data_without_filtering1 = responseData.results[0].rows
      this.sub_trajectory = responseData.results[0].rows
      .map(row => ({
        feature: row[splitted]
      }))
    } if (selectedTrajectory2) {
      this.operation2 = responseData.results[1].operation
      this.data_without_filtering2 = responseData.results[1].rows
      this.sub_trajectory2 = responseData.results[1].rows
      .map(row => ({
        feature: row[splitted]
      }))
    }
}

async showPercentile(y_lablel) {
  try {

    this.svg.selectAll(".chart-content").remove();

    const headerGroup = this.svg.append('g').attr("class","chart-content").attr('id', 'header-group-feature-details')

    headerGroup.append('rect')
    .attr('width' , 70)
    .attr('height' , 15)
    .attr('fill' , kinematicColor)
    .attr('x' , 240)
    .attr('y' , -50)

    headerGroup.append('rect')
    .attr('width' , 70)
    .attr('height' , 15)
    .attr('fill' , geometricColor)
    .attr('x' , 240)
    .attr('y' , -30)

    headerGroup.append('text')
    .text('Trajectory 1')
    .attr('font-size', 10)
    .attr('fill', 'black')
    .attr('x' , 275)
    .attr('y' , -40)
    .attr('font-weight', 700)
    .attr('text-anchor', 'middle')


    headerGroup.append('text')
    .text('Trajectory 2')
    .attr('font-size', 10)
    .attr('fill', 'black')
    .attr('x' , 275)
    .attr('y' , -20)
    .attr('font-weight', 700)
    .attr('text-anchor', 'middle')

    headerGroup.append('text')
    .text(this.operation.toString().slice(0,7))
    .attr('x', 320)
    .attr('y', -38)
    .attr('font-size', 12)
    .attr('font-weight', 700)
    headerGroup.append('text')
    .text(this.operation2.toString().slice(0,7))
    .attr('x', 320)
    .attr('y', -18)
    .attr('font-size', 12)
    .attr('font-weight', 700)

    const chartGroup = this.svg.append("g")
        .attr("class", "chart-content");

    const yScale = d3.scaleLinear()
        .domain([d3.min([...this.sub_trajectory, ...this.sub_trajectory2], d => d.feature), d3.max([...this.sub_trajectory, ...this.sub_trajectory2], d => d.feature)])
        .range([this.height - 150, 0])

    const xScaleIndexed = d3.scaleLinear()
        .domain([0,10])
        .range([0, this.width - 100]);

    const line = d3.line()
        .defined(d => !isNaN(d.feature))
        .x((d,i) => xScaleIndexed(i))
        .y(d => yScale(d.feature));


    if(this.sub_trajectory.length != 0) {
      chartGroup.append("path")
      .datum(this.sub_trajectory)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke","#0080FF")
      .attr("stroke-width", 2)
      .attr("d", line)

      chartGroup.append("path")
      .datum(this.sub_trajectory2)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "#DC143C80")
      .attr("stroke-width", 2)
      .attr("d", line)

      let splitted = y_lablel.split("_").splice(1).join("_"); 
        if (splitted === 'quant_median' || splitted === 'mean'|| splitted === 'mad' || splitted === "meanse") {
          chartGroup.append("line")
          .attr("class", "stat-line")
          .attr("x1", 0)                          
          .attr("x2", this.width - 100)           
          .attr("y1", yScale(this.operation))     
          .attr("y2", yScale(this.operation))     
          .attr("stroke", "#0080FF")
          .attr("stroke-width", 2)
          .style('stroke-dasharray', 5)

          chartGroup.append("line")
          .attr("class", "stat-line")
          .attr("x1", 0)                          
          .attr("x2", this.width - 100)           
          .attr("y1", yScale(this.operation2))     
          .attr("y2", yScale(this.operation2))     
          .attr("stroke", "#DC143C80")
          .attr("stroke-width", 2)
          .style('stroke-dasharray', 5)

        } else {
          chartGroup.append('circle')
          .attr('class', 'stat-circle')
          .attr('r', 5)
          .attr('cx', xScaleIndexed(5) )
          .attr('cy', yScale(this.operation))
          .attr('fill', "#0080FF")

          chartGroup.append('circle')
          .attr('class', 'stat-circle')
          .attr('r', 5)
          .attr('cx', xScaleIndexed(5))
          .attr('cy', yScale(this.operation2))
          .attr('fill', "#DC143C80")
        }
        const xAxis = d3.axisBottom(xScaleIndexed)
        .ticks(5)

    const yAxis = d3.axisLeft(yScale)
        .ticks(5);

    chartGroup.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${this.height - 150})`)
        .call(xAxis);

    chartGroup.append("g")
        .attr("class", "y-axis")
        .call(yAxis);
        const selectedFeature = y_lablel
          await mapGl.traject(this.data_without_filtering1, selectedTrajectory1, selectedFeature);
          await mapGl2.traject(this.data_without_filtering2, selectedTrajectory2, selectedFeature);
    }    
  } catch (error) {
    console.error("Error drawing line chart:", error);
  }
}

}