// ...existing imports and code...

const data = '/static/data/modefied-fox.csv';  // Update the data path

const traject = async function(trajectories) {
  const initialPathData = await pathConverter(trajectories);
  
  // ...existing bounds calculation code...

  const map = new maplibregl.Map({
    container: 'map',
    style: {
      version: 8,
      sources: {
        'osm': {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors'
        }
      },
      layers: [{
        id: 'osm',
        type: 'raster',
        source: 'osm',
        minzoom: 0,
        maxzoom: 19
      }]
    },
    center: [centerLon, centerLat],
    zoom: 3,
    pitch: 45,  // Adjusted for better initial view
    bearing: 0,
    antialias: true
  });

  // ...rest of existing code...
};

// Make sure the map initializes after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', main);

// Update map container styles
const mapContainer = document.getElementById('map');
mapContainer.style.position = 'relative';
mapContainer.style.height = '100%';
mapContainer.style.width = '100%';

// Update the controls position
const controls = document.getElementById('controls');
controls.style.position = 'absolute';
controls.style.top = '10px';
controls.style.left = '10px';
controls.style.zIndex = '1';
controls.style.background = 'white';
controls.style.padding = '10px';
controls.style.borderRadius = '4px';

// ...rest of existing code...
