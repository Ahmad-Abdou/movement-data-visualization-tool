class Heatmap {
  constructor(containerId, width, height, margin, data, colorRange = ['#ffffb2', '#e31a1c']) {
    this.containerId = containerId;
    this.width = width;
    this.height = height;
    this.margin = margin;
    this.data = data;

    // Define scales, color, and SVG elements
    this.colorScale = d3.scaleLinear().range(colorRange);
    this.xScale = d3.scaleBand().domain(["Zone 0", "Zone 1", "Zone 2", "Zone 3"]).range([0, width - margin.left - margin.right]).padding(0.01);
    this.yScale = d3.scaleBand().domain([
      "Kinematic Geometric", "Speed Acceleration", "Indentation Curvature", 
      "Curvature Speed", "Indentation Speed", "Curvature Acceleration", "Indentation Acceleration"
    ]).range([0, height - margin.top - margin.bottom]).padding(0.01);
    
    // clear the container first
    document.getElementById(`${containerId}`).innerHTML = "";    
    this.svg = d3.select(`#${containerId}`).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    this.heatmapGroup = this.svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  }

  async prepareData(combinations_data){
    let counter_z_0 = 0, counter_z_1 = 0, counter_z_2 = 0, counter_z_3 = 0;    
    for (const [ key, path] of Object.entries(combinations_data)) {
      try {
        console.log('Key '+key);
        console.log('PATH '+path);
        let data = await d3.csv(path);
        data.forEach(row => {
          if (row.x < 0.5 && row.y < 0.5) {
            counter_z_0++;
          } else if (row.x < 0.5 && row.y > 0.5 && row.x < (row.y - 0.5)) {
            counter_z_1++;
          } else if (row.x > 0.5 && row.y < (row.x - 0.5)) {
            counter_z_2++;
          } else {
            counter_z_3++;
          }
        });
        // Store counters for the current key and reset them
        frequency_zone_combinations[key] = [];
        frequency_zone_combinations[key].push(counter_z_0, counter_z_1, counter_z_2, counter_z_3);
        counter_z_0 = 0;
        counter_z_1 = 0;
        counter_z_2 = 0;
        counter_z_3 = 0;

      } catch (error) {
        console.error(`Error processing ${path}:`, error);
      }
    }    
  }

  transformData(data) {
    const heatmapData = [];    
    Object.entries(data).forEach(([combination, values]) => {
      values.forEach((value, zoneIndex) => {
        if (zoneIndex < 4) {
          heatmapData.push({
            combination: combination,
            zone: `Zone ${zoneIndex}`,
            value: value || 0
          });
        }
      });
    });
    return heatmapData;
  }

  async render(combinations_data) {
    // Process data for heatmap    
    await this.prepareData(combinations_data);
    let heatmapData = this.transformData(this.data);
    console.log(`Data: ${JSON.stringify(heatmapData)}`)
    let minValue = d3.min(heatmapData, d => d.value);
    let maxValue = d3.max(heatmapData, d => d.value);
    this.colorScale.domain([minValue, maxValue]);

    // Clear existing elements to ensure a fresh render
    this.heatmapGroup.selectAll('rect').remove();
    this.heatmapGroup.selectAll('text').remove();

    // Create the heatmap cells
    this.heatmapGroup.selectAll('rect')
      .data(heatmapData)
      .join('rect')
      .attr('class', 'heatmap-rect')
      .attr('id', d => `${d.combination}`)
      .attr('x', d => this.xScale(d.zone))
      .attr('y', d => this.yScale(d.combination))
      .attr('width', this.xScale.bandwidth())
      .attr('height', this.yScale.bandwidth())
      .attr('stroke-width', 3)
      .attr('fill', d => this.colorScale(d.value))
      .on('click', (e, d) => this.onCellClick(d));

    // Add text labels for values in each cell
    this.heatmapGroup.selectAll('text')
      .data(heatmapData)
      .join('text')
      .attr('x', d => this.xScale(d.zone) + this.xScale.bandwidth() / 2)
      .attr('y', d => this.yScale(d.combination) + this.yScale.bandwidth() / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', 'black')
      .attr('font-size', 20)
      .text(d => `${d.value}`);

    // Add axes
    this.heatmapGroup.append('g').call(d3.axisLeft(this.yScale));
    this.heatmapGroup.append('g').call(d3.axisTop(this.xScale));
  }

  onCellClick(d) {
    const combinationList = d.combination.split(" ");
    showData(combinationList[0], combinationList[1]);
    AxesSvg.selectAll('path.axes-zone').remove();
    axes_coloring_zone(d.zone.slice(4), this.data);
    colorTreeElement(combinationList[0], combinationList[1]);
  }
}
