tree_element_1 = null
tree_element_2 = null

// const heatMapSVG = d3.select('.heat-map')
const heatMapSVG = d3.select('#heat-map')
  .append('svg')
  .attr('width', SVGWIDTH + 150)
  .attr('height', SVGHEIGHT);

const width_heatMap = (SVGWIDTH + 100) - margin.left - margin.right;
const height_heatMap = (SVGHEIGHT + 30) - margin.top - margin.bottom;

const heatmapGroup = heatMapSVG.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top - 10})`);

const myGroups = ["Zone 0", "Zone 1", "Zone 2", "Zone 3"];
// const myVars = [
//   "Speed Acceleration", "Indentation Speed", "Indentation Acceleration",
//   "Acceleration Curvature", "Curvature Speed", "Curvature Indentation",
//   "Geometric Acceleration", "Geometric Speed", "Kinematic Indentation",
//   "Kinematic Curvature", "Kinematic Geometric"
// ];

const myVars = [
  "Kinematic Geometric", "Speed Acceleration", "Indentation Curvature", 
  "Curvature Speed", "Indentation Speed",
  "Curvature Acceleration", "Indentation Acceleration"
  
];
const xScale_heatMap = d3.scaleBand()
  .domain(myGroups)
  .range([0, width_heatMap])
  .padding(0.01);

const yScale_heatMap = d3.scaleBand()
  .domain(myVars)
  .range([0, height_heatMap])
  .padding(0.01);

const myColor = d3.scaleLinear()
  .domain([0,36])
  .range(['#ffffb2' , '#e31a1c']);

const transformDataForHeatmap = (data) => {
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
};

let combinations_data = [
  { path: `../static/${outlier_dataset_name}/Xkinematic_Ygeometric_decision_scores.csv`, key: 'Kinematic Geometric' },
  { path: `../static/${outlier_dataset_name}/Xspeed_Yacceleration_decision_scores.csv`, key: 'Speed Acceleration' },
  { path: `../static/${outlier_dataset_name}/Xindentation_Ycurvature_decision_scores.csv`, key: 'Indentation Curvature' },
  { path: `../static/${outlier_dataset_name}/Xcurvature_Yspeed_decision_scores.csv`, key: 'Curvature Speed' },
  { path: `../static/${outlier_dataset_name}/Xindentation_Yspeed_decision_scores.csv`, key: 'Indentation Speed' },
  { path: `../static/${outlier_dataset_name}/Xcurvature_Yacceleration_decision_scores.csv`, key: 'Curvature Acceleration' },
  { path: `../static/${outlier_dataset_name}/Xindentation_Yacceleration_decision_scores.csv`, key: 'Indentation Acceleration' }
  
];
let frequency_zone_combinations = {
  "Kinematic Geometric": [],
  "Speed Acceleration": [],
  "Indentation Curvature": [],
  "Curvature Speed": [],
  "Indentation Speed": [],
  "Curvature Acceleration": [],
  "Indentation Acceleration": []  
};


let counter_z_0 = 0, counter_z_1 = 0, counter_z_2 = 0, counter_z_3 = 0;
Promise.all(combinations_data.map(({ path, key }) => {
  return d3.csv(path).then(data => {
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

    frequency_zone_combinations[key].push(counter_z_0, counter_z_1, counter_z_2, counter_z_3);
    counter_z_0 = 0;
    counter_z_1 = 0;
    counter_z_2 = 0;
    counter_z_3 = 0;
  }).catch(error => {
    console.error(`Error processing ${path}:`, error);
  });
})).then(() => {
  createHeatmap(frequency_zone_combinations);
});


const createHeatmap = (data) => {
  
  const heatmapData = transformDataForHeatmap(data);
  all_data = heatmapData
    heatmapGroup.selectAll('rect')
    .data(heatmapData)
    .join('rect')
    .attr('id', d => `${d.combination}`)
    .attr('x', d => xScale_heatMap(d.zone) + 70)
    .attr('y', d => yScale_heatMap(d.combination))
    .attr('width', xScale_heatMap.bandwidth())
    .attr('height', yScale_heatMap.bandwidth())
    .attr('stroke-width', 3)
    .attr('fill', d => d.combination.split(" ") == unsorted_combination.split(" ") ? '#cbeef3' : myColor(d.value))
    // .attr('stroke', d => d.combination.split(" ").sort().join(" ").trim() == unsorted_combination.split(" ").sort().join(" ").trim() ? 'white' : '')
    // .on('mouseover', function(event, d) {
    //   const tooltip = heatmapGroup.append('g')
    //     .attr('class', 'tooltip')
    //     .style('pointer-events', 'none');
    //   const tooltipRect = tooltip.append('rect')
    //     .attr('width', 60)
    //     .attr('height', 40)
    //     .attr('fill', 'rgba(255, 255, 255, 0.9)')
    //     .attr('stroke', '#999')
    //     .attr('rx', 4);

    //   tooltip.append('text')
    //     .text(`${d.value}`)
    //     .attr('x', 30)
    //     .attr('y', 20)
    //     .attr('fill', 'black')
    //     .attr('text-anchor', 'middle')
    //     .attr('dominant-baseline', 'middle');
    // })
    // .on('mousemove', function(event) {
    //   const [mouseX, mouseY] = d3.pointer(event);
    //   const tooltip = heatmapGroup.select('.tooltip');
    //   tooltip.attr('transform', `translate(${mouseX + 10}, ${mouseY - 10})`);
    // })
    // .on('mouseout', function() {
    //   heatmapGroup.select('.tooltip').remove();
    // })
    .on('click', function(e, d){
      combinationList = d.combination.split(" ")
      showData(combinationList[0], combinationList[1]);
      AxesSvg.selectAll('path.axes-zone').remove();
      axes_coloring_zone(d.zone.slice(4), all_data)
      colorTreeElement(combinationList[0], combinationList[1])      
    })
  

    heatmapGroup.selectAll('text')
      .data(heatmapData)
      .join('text')
      .attr('x', d => xScale_heatMap(d.zone) + xScale_heatMap.bandwidth() / 2 + 70)
      .attr('y', d => yScale_heatMap(d.combination) + yScale_heatMap.bandwidth() / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', d => d.combination.split(" ") == unsorted_combination.split(" ") ? 'black' : 'black')
      .attr('font-size', 20)
      .text( d=>`${d.value}`)
      


  heatmapGroup.append('g')
    .attr('transform', `translate(70, 0)`)
    .call(d3.axisLeft(yScale_heatMap))


  heatmapGroup.append('g')
    .attr('transform', `translate(70, 0)`)
    .call(d3.axisTop(xScale_heatMap))
    .selectAll('text')  
    .style('font-size', '12px');

};
