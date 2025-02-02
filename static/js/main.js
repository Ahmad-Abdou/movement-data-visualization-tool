
const margin_heat = {top: 20, right: -150, bottom: -150, left: 120};
let heatmap = new Heatmap('heat-map', 600, 325, margin_heat, frequency_zone_combinations);
heatmap.render(file_mapping);



const margin_axes= {left: 50, right: 0, top: -35, bottom: 0};
const axesPlot = new AxesPlot('#scatter-plot', 450, 350, margin_axes);


const tree = new Tree('#taxonomy-element', 500, 300, 0);

const  featureDetail = new FeatureDetail('#feature-detail',450, 400, margin_axes )

const mapGl = new MapGl('#mapgl')
const trajectories =  mapGl.generateMapGl('../static/data/fox-point-feats.csv')
mapGl.traject(trajectories);
// mapGl.generateMapGl(data)

// const barChart = new BarChart('.bar-chart', 450, 450);


