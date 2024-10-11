const heatMapSVG = d3.select('.heat-map')
  .append('svg')
  .attr('width', SVGWIDTH + 100)
  .attr('height', SVGHEIGHT);

const width_heatMap = (SVGWIDTH + 100) - margin.left - margin.right;
const height_heatMap = (SVGHEIGHT + 30) - margin.top - margin.bottom;

const heatmapGroup = heatMapSVG.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const myGroups = ["Zone 0", "Zone 1", "Zone 2", "Zone 3"];
const myVars = [
  "Speed Acceleration", "Indentation Speed", "Indentation Acceleration",
  "Acceleration Curvature", "Curvature Speed", "Curvature Indentation",
  "Geometric Acceleration", "Geometric Speed", "Kinematic Indentation",
  "Kinematic Curvature", "Kinematic Geometric"
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
  .domain([0,5 ,10, 20,30,40,50])
  .range(['#EEF7FC', '#97CFED' , '#74BFE7', '#3FA7DE' ,'#2188C0', '#18638C' , '#124A69']);

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
  { path: '../static/data_combination_foxes/foxes_Xkinematic_Ygeometric_decision_scores.csv', key: 'Kinematic Geometric' },
  { path: '../static/data_combination_foxes/foxes_Xkinematic_Ycurvature_decision_scores.csv', key: 'Kinematic Curvature' },
  { path: '../static/data_combination_foxes/foxes_Xkinematic_Yindentation_decision_scores.csv', key: 'Kinematic Indentation' },
  { path: '../static/data_combination_foxes/foxes_Xgeometry_Yspeed_decision_scores.csv', key: 'Geometric Speed' },
  { path: '../static/data_combination_foxes/foxes_Xgeometry_Yacceleration_decision_scores.csv', key: 'Geometric Acceleration' },
  { path: '../static/data_combination_foxes/foxes_Xspeed_Yacceleration_decision_scores.csv', key: 'Speed Acceleration' },
  { path: '../static/data_combination_foxes/foxes_Xcurvature_Yspeed_decision_scores.csv', key: 'Curvature Speed' },
  { path: '../static/data_combination_foxes/foxes_Xindentation_Yspeed_decision_scores.csv', key: 'Indentation Speed' },
  { path: '../static/data_combination_foxes/foxes_Xcurvature_Yacceleration_decision_scores.csv', key: 'Acceleration Curvature' },
  { path: '../static/data_combination_foxes/foxes_Xindentation_Yacceleration_decision_scores.csv', key: 'Indentation Acceleration' },
  { path: '../static/data_combination_foxes/foxes_Xindentation_Ycurvature_decision_scores.csv', key: 'Curvature Indentation' }
];

const frequency_zone_combinations = {
  "Kinematic Geometric": [],
  "Kinematic Curvature": [],
  "Kinematic Indentation": [],
  "Geometric Speed": [],
  "Geometric Acceleration": [],
  "Speed Acceleration": [],
  "Curvature Speed": [],
  "Indentation Speed": [],
  "Acceleration Curvature": [],
  "Indentation Acceleration": [],
  "Curvature Indentation": []
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

  heatmapGroup.selectAll('rect')
    .data(heatmapData)
    .join('rect')
    .attr('id', d => `${d.combination}`)
    .attr('x', d => xScale_heatMap(d.zone) + 70)
    .attr('y', d => yScale_heatMap(d.combination))
    .attr('width', xScale_heatMap.bandwidth())
    .attr('height', yScale_heatMap.bandwidth())
    .attr('fill', d => myColor(d.value))
    .attr('stroke', d => d.combination.split(" ").sort().join(" ").trim() == unsorted_combination.split(" ").sort().join(" ").trim() ? '#212529' : '')
    .attr('stroke-width', 3)
    .on('mouseover', function(event, d) {
      const tooltip = heatmapGroup.append('g')
        .attr('class', 'tooltip')
        .style('pointer-events', 'none');
      const tooltipRect = tooltip.append('rect')
        .attr('width', 60)
        .attr('height', 40)
        .attr('fill', 'rgba(255, 255, 255, 0.9)')
        .attr('stroke', '#999')
        .attr('rx', 4);

      tooltip.append('text')
        .text(`${d.value}`)
        .attr('x', 30)
        .attr('y', 20)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle');
    })
    .on('mousemove', function(event) {
      const [mouseX, mouseY] = d3.pointer(event);
      const tooltip = heatmapGroup.select('.tooltip');
      tooltip.attr('transform', `translate(${mouseX + 10}, ${mouseY - 10})`);
    })
    .on('mouseout', function() {
      heatmapGroup.select('.tooltip').remove();
    });

  heatmapGroup.append('g')
    .attr('transform', `translate(70, 0)`)
    .call(d3.axisLeft(yScale_heatMap));

  heatmapGroup.append('g')
    .attr('transform', `translate(70, ${height_heatMap})`)
    .call(d3.axisBottom(xScale_heatMap));
};

