const margin_heat = {top: 20, right: -150, bottom: -150, left: 120};
let heatmap = new Heatmap('heat-map', 600, 325, margin_heat, frequency_zone_combinations);
heatmap.render(file_mapping);

const margin_axes= {left: 50, right: 0, top: -35, bottom: 0};
const axesPlot = new AxesPlot('#scatter-plot', 450, 350, margin_axes);

const tree = new Tree('#taxonomy-element', 500, 300, 0);

const mapGl = new MapGl('map')
const mapGl2 = new MapGl('map-2')

// mapGl.generateMapGl('')
//   .then(trajectories => {
//     return mapGl.traject(trajectories);
//   })
//   .catch(error => {
//     console.error("Error initializing maps:", error);
//   });

//   mapGl2.generateMapGl('')
//   .then(trajectories => {
//     return mapGl2.traject(trajectories);
//   })
//   .catch(error => {
//     console.error("Error initializing maps:", error);
//   });

const featureDetail = new FeatureDetail('#feature-detail', 450, 400, margin_axes)


