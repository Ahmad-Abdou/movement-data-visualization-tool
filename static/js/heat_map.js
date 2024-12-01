class Heatmap {
  constructor(containerId, width, height, margin, data, colorRange = ['#ffffb2', '#e31a1c']) {
    this.containerId = containerId;
    this.width = width;
    this.height = height;
    this.margin = margin;
    this.data = data;
    this.zones = []
    // Define scales, color, and SVG elements
    this.colorScale = d3.scaleLinear().range(colorRange);
    this.xScale = d3.scaleBand().domain(["Zone 0", "Zone 1", "Zone 2", "Zone 3"]).range([0, width - 150]).padding(0.01);
    this.yScale = d3.scaleBand().domain([
      "Kinematic Geometric", "Speed Acceleration", "Indentation Curvature", 
      "Curvature Speed", "Indentation Speed", "Curvature Acceleration", "Indentation Acceleration"
    ]).range([0, height - 150]).padding(0.01);
    
    // clear the container first
    document.getElementById(`${containerId}`).innerHTML = "";    
    this.svg = d3.select(`#${containerId}`).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    this.heatmapGroup = this.svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  }
  prepareData(combinations_data){    
      const dataEntries = Object.entries(combinations_data).map(([key, path]) => ({ key, path }));
      return Promise.all(dataEntries.map(({ path, key }) => {
        return d3.csv(path).then(data => {
          let counter_z_0 = 0;
          let counter_z_1 = 0;
          let counter_z_2 = 0;
          let counter_z_3 = 0;
          data.forEach(function (row) {
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
          frequency_zone_combinations[key] = []    
          frequency_zone_combinations[key].push(counter_z_0, counter_z_1, counter_z_2, counter_z_3);     
    
        }).catch(error => {
          console.error(`Error processing ${path}:`, error);
        });
      }))
    
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

  render(combinations_data) {
    // Process data for heatmap    
    this.prepareData(combinations_data).then(f => {
      let heatmapData = this.transformData(this.data);    
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
        .attr('font-size', 15)
        .text(d => `${d.value}`);

      // Add axes
      this.heatmapGroup.append('g').call(d3.axisLeft(this.yScale));
      this.heatmapGroup.append('g').call(d3.axisTop(this.xScale));
      }).catch(error => {
        console.error(`Error processing ${path}:`, error);
      });    
  }

  highlightRow(combination) {
    // Reset all cells to their original colors
    this.heatmapGroup.selectAll('rect')
        .attr('fill', d => this.colorScale(d.value));
        
    // Highlight the matching row with a light blue background
    this.heatmapGroup.selectAll('rect')
        .filter(d => d.combination === combination)
        .attr('fill', '#0080FF').attr('opacity', 0.5);
        current_selected_combination = combination
  }

  async onCellClick(d) {
    const combinationList = d.combination.split(" ");

    
    // Find the corresponding tree boxes and trigger their toggleColor
    const firstBox = tree.treeGroup.select(`rect#${combinationList[0]}`);
    const secondBox = tree.treeGroup.select(`rect#${combinationList[1]}`);
    
    if (firstBox.node() && secondBox.node()) {
        // Reset previous selections
        tree.selectedRects.forEach(rect => rect.element.attr('fill', 'white'));
        tree.selectedRects = [];
        
        // Trigger toggleColor on both boxes
        tree.toggleColor(firstBox, combinationList[0]);
        tree.toggleColor(secondBox, combinationList[1]);
    }
    axesPlot.svg.selectAll('path.axes-zone').remove();
    axesPlot.colorZone(parseInt(d.zone.slice(5)), this.data);
    
    // Send data to Python
    // await sendDataToPython(d.combination, d.zone);
    displayselectedZone()

  }
}
