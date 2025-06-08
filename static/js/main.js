const margin_heat = {top: 20, right: -150, bottom: -150, left: 120};
let heatmap = new Heatmap('heat-map', 600, 570, margin_heat, frequency_zone_combinations);
heatmap.render(file_mapping);

const margin_axes= {left: 50, right: 0, top: -35, bottom: 0};
const axesPlot = new AxesPlot('#scatter-plot', 450, 430, margin_axes);

const tree = new Tree('#taxonomy-element', 500, 500, 0);
const featureBar = new FeatureBar('.feature-importance-container', 600, 500,null)
featureBar.render()
const mapGl = new MapGl('map')
const mapGl2 = new MapGl('map-2')
const heatmap_2d = d3.select('#heatmap-2d').attr('id', 'heatmap-2d').append('svg').attr("width", "100%").attr("height", "100%").style("background", "#f9f9f9");
const trajectory_parent_group = heatmap_2d.append('g').attr('id', 'trajectory-parent-group')

mapGl.generateMapGl('')
  .then(trajectories => {
    return mapGl.traject(trajectories);
  })
  .catch(error => {
    console.error("Error initializing maps:", error);
  });

  mapGl2.generateMapGl('')
  .then(trajectories => {
    return mapGl2.traject(trajectories);
  })
  .catch(error => {
    console.error("Error initializing maps:", error);
  });

const featureDetail = new FeatureDetail('#feature-detail', 450, 400, margin_axes)


