// // var map = L.map('map').setView([72.88, -79.80], 10);

// // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
// //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// // }).addTo(map);

// // let activeTrajectories = [];

// // function showTrajectoryOnMap(id) {
// //     if (!id) return;
    
// //     // Clear previous trajectories
// //     activeTrajectories.forEach(layer => map.removeLayer(layer));
// //     activeTrajectories = [];
    
// //     const datasetFolder = getCurrentDatasetFolder();
// //     const geojsonPath = `../static/${datasetFolder}/${id}.geojson`;
    
// //     fetch(geojsonPath)
// //         .then(response => {
// //             if (!response.ok) {
// //                 throw new Error(`HTTP error! status: ${response.status}`);
// //             }
// //             return response.json();
// //         })
// //         .then(data => {
// //             const trajectory = L.geoJSON(data, {
// //                 style: {
// //                     color: isChecked ? '#D70040' : '#69b3a2',
// //                     weight: 2,
// //                     opacity: 0.8
// //                 }
// //             }).addTo(map);

// //             activeTrajectories.push(trajectory);
// //             map.fitBounds(trajectory.getBounds());
// //         })
// //         .catch(error => {
// //             console.error('Error loading trajectory:', error);
// //             console.log('Failed to load:', geojsonPath);
// //         });
// // }
// import {PolygonLayer} from '@deck.gl/layers';
// import { csvParse } from 'd3-dsv';
// import {MapboxOverlay} from '@deck.gl/mapbox';
// import { scaleLinear } from 'd3-scale';
// import { color } from 'd3';

// const allTrajBox = document.getElementById('trajSelect')
// const data = '../data/modefied-fox.csv'

// const polygonLayerType = [{
//   'speed':{
//     'elevation': 25000,
//     'color': [146, 43, 33,255]
//   },
//   'acceleration':{
//     'elevation': 20000,

//     'color': [33, 47, 61,255]
//   },
//   'distance':{
//     'elevation': 15000,
//     'color': [98, 101, 103 ,255]
//   },
//   'angle':{
//     'elevation': 10000,

//     'color': [29, 131, 72 ,255]
//   },
//   'bearing':{
//     'elevation': 5000,
//     'color': [26, 82, 118,255]
//   },
// }]


// const fetchData = async function(url) {
//   try {
//     const response = await fetch(url)
//     if(!response.ok) {
//       throw new Error('file not found or something!!!!!')
//     }
//     const csvText = await response.text()

//     const data = csvParse(csvText)
//     return data
//   } catch (error) {
//     console.error(error)
//     return []
//   }
// }

// const filteringTrajectories = async function(trajectories, id) {
//   try {
//     const data = await trajectories
//     const selectedTrajectory =  data.filter((item) =>{
//       return (String(item.tid) === String(id))
//     })
//     return selectedTrajectory
//   } catch (error) {
//     console.error(error)
//     return []
//   }
 
// }

// const getTrajId = async function(trajectories){
//   try {
//     const data = await trajectories
//     const trajIDs = data.flatMap((item) =>{
//       return item.tid
//     })
//     return [... new Set(trajIDs)]
//   } catch (error) {
//     console.error(error)
//     return []
//   }

// }

// const showTrajIdAsOption = async function(trajectories, updateLayer) {
  
//   const trajIDs = await getTrajId(trajectories)

//   trajIDs.forEach((id) =>{
//     const option = document.createElement('option')
//     option.id = id
//     option.textContent = id
//     allTrajBox.appendChild(option)
//   })

//   allTrajBox.addEventListener('change', async (e) =>{
//     let newTrajectories
//     if(e.target.value === 'all') {
//       newTrajectories = await trajectories
//     } else {
//       newTrajectories = await filteringTrajectories(trajectories, e.target.value)
//     }
//     updateLayer(newTrajectories)
//   })
//   return trajectories
// }


// const traject = async function(trajectories) {
//   const initialPathData = await pathConverter(trajectories);
  
//   // Calculate center from actual data
//   const bounds = {
//     minLon: Infinity,
//     maxLon: -Infinity,
//     minLat: Infinity,
//     maxLat: -Infinity
//   };

//   initialPathData.forEach(poly => {
//     poly.polygon.forEach(point => {
//       bounds.minLon = Math.min(bounds.minLon, point[0]);
//       bounds.maxLon = Math.max(bounds.maxLon, point[0]);
//       bounds.minLat = Math.min(bounds.minLat, point[1]);
//       bounds.maxLat = Math.max(bounds.maxLat, point[1]);
//     });
//   });

//   const centerLon = (bounds.minLon + bounds.maxLon) / 2;
//   const centerLat = (bounds.minLat + bounds.maxLat) / 2;

//   const map = new maplibregl.Map({
//     container: 'map',
//     style: {
//       version: 8,
//       sources: {
//         'osm': {
//           type: 'raster',
//           tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
//           tileSize: 256
//         }
//       },
//       layers: [{
//         id: 'osm',
//         type: 'raster',
//         source: 'osm',
//         minzoom: 0,
//         maxzoom: 19
//       }]
//     },
//     center: [centerLon, centerLat],
//     zoom: 3,
//     pitch: 60,
//     bearing: 30,
//     antialias: true
//   });

//   await new Promise(resolve => map.on('load', resolve));


//   const layers = Object.keys(polygonLayerType[0]).map((type) => {
//     const category = polygonLayerType[0][type];
//      return polygonGenerator(type, initialPathData, category);
//   });


//   const deckOverlay = new MapboxOverlay({
//     layers: [layers],
//     getTooltip: ({object}) => object && `Trajectory ${object.tid} \n Speed: ${object.speed}\n Acceleration: ${object.acceleration}\n Angle: ${object.angle}\n Distance: ${object.distance}\n Bearing: ${object.bearing}`
//   });

//   map.addControl(deckOverlay);

//   const updateLayer = async (newData) => {
//     const pathData = await pathConverter(newData);
//     const updatedLayers = Object.keys(polygonLayerType[0]).map((type) => {
//       const category = polygonLayerType[0][type];
//       return polygonGenerator(type, pathData, category);
//     });
  
//     deckOverlay.setProps({
//       layers: updatedLayers
//     });
//   };

//   await showTrajIdAsOption(trajectories, updateLayer);
  
//   // Cleanup on unmount
//   // return () => {
//   //   map.remove();
//   // };
// };

// const colorizing = function (type, initialPathData) {
//   let colorScale;
//   if (type === 'speed') {
//     const speeds = initialPathData.map(d => d.speed).filter(v => !isNaN(v));
//     const minSpeed = Math.min(...speeds);
//     const maxSpeed = Math.max(...speeds);
//     colorScale = scaleLinear().domain([minSpeed, maxSpeed]).range([[254,229,217], [165,15,21]]);
//   } else if (type === 'acceleration') {
//     const accelerations = initialPathData.map((d) => d.acceleration).filter(v => !isNaN(v))
//     const minAcc = Math.min(...accelerations)
//     const maxAcc = Math.max(...accelerations)
//     colorScale = scaleLinear().domain([minAcc, maxAcc]).range([[254,229,217], [165,15,21]])
//   }
//   else if (type === 'distance') {
//     const distances = initialPathData.map((d) => d.distance).filter(v => !isNaN(v))
//     const minDist = Math.min(...distances)
//     const maxDist = Math.max(...distances)
//     colorScale = scaleLinear().domain([minDist, maxDist]).range([[254,229,217], [165,15,21]])
//   }
//   else if (type === 'angle') {
//     const angles = initialPathData.map((d) => d.angle).filter(v => !isNaN(v))
//     const minAngle= Math.min(...angles)
//     const maxAngle = Math.max(...angles)
//     colorScale = scaleLinear().domain([minAngle, maxAngle]).range([[254,229,217], [165,15,21]])
//   }
//   else if (type === 'bearing') {
//     const bearings = initialPathData.map((d) => d.bearing).filter(v => !isNaN(v))
//     const minBearing = Math.min(...bearings)
//     const maxBearing = Math.max(...bearings)
//     colorScale = scaleLinear().domain([minBearing, maxBearing]).range([[254,229,217], [165,15,21]])
//   }
//   return colorScale
// }

// const polygonGenerator = function(type, initialPathData, category) {
//   const colorScale = colorizing(type, initialPathData)
//   const layer = new PolygonLayer({
//     id: `PolygonLayer${type}`,
//     data: initialPathData,
//     pickable: true,
//     stroked: true,
//     filled: true,
//     extruded: true,
//     wireframe: false,
//     getPolygon: d => d.polygon,
//     getFillColor: d => {
//       if (type === 'speed' && colorScale) {
//         const color = colorScale(d.speed);
//         return [...color, 255];

//       } else if(type === 'acceleration') {
//         const color = colorScale(d.acceleration)
//         return [...color, 255];

//       } else if(type === 'distance') {
//         const color = colorScale(d.distance)
//         return [...color, 255];

//       }
//       else if(type === 'angle') {
//         const color = colorScale(d.angle)
//         return [...color, 255];

//       }
//       else if(type === 'bearing') {
//         const color = colorScale(d.bearing)
//         return [...color, 255];

//       }
//     },
//     getLineColor: [0, 0, 0],
//     getLineWidth: 2,
//     getElevation: category.elevation,
//     material: {
//       ambient: 0.64,                     
//       diffuse: 0.6,
//       shininess: 32,
//       specularColor: [51, 51, 51]
//     }
//   });
//   return layer
// }

// const pathConverter = async function(trajectories) {
//   const data = await trajectories;
//   const groupedByTraj = {};
  
//   data.forEach(row => {
//     if (!groupedByTraj[row.tid]) {
//       groupedByTraj[row.tid] = [];
//     }
//     const point = [parseFloat(row.lon), parseFloat(row.lat)];
//     if (!isNaN(point[0]) && !isNaN(point[1])) {
//       groupedByTraj[row.tid].push({
//         coordinates: point,
//         speed: parseFloat(row.speed),
//         acceleration: parseFloat(row.acceleration),
//         distance: parseFloat(row.distance),
//         angle: parseFloat(row.angle),
//         bearing: parseFloat(row.bearing),


//       });
//     }
//   });
//   const theWall = generateWall(groupedByTraj);
//   return theWall;
// };

// const generateWall = async function(groupedByTraj) {
//   const wall = Object.keys(groupedByTraj).map(tid => {
//     const path = groupedByTraj[tid];
//     const polygons = [];
    
//     for (let i = 0; i < path.length - 1; i++) {
//       const p1 = path[i];
//       const p2 = path[i + 1];
//       polygons.push({
//         tid: tid,
//         speed: p2.speed,
//         acceleration: p2.acceleration,
//         distance: p2.distance,
//         angle: p2.angle,
//         bearing: p2.bearing,
//         polygon: [
//           [p1.coordinates[0], p1.coordinates[1], 0],
//           [p2.coordinates[0], p2.coordinates[1], 0],
//           [p2.coordinates[0], p2.coordinates[1], 5000],
//           [p1.coordinates[0], p1.coordinates[1], 5000]
//         ]
//       });
//     }
//     return polygons;
//   }).flat();
//   return wall;
// };


// const main = async function() {
//   const trajectories = await fetchData(data)
//   traject(trajectories)
//   pathConverter(trajectories)
// }

// main()