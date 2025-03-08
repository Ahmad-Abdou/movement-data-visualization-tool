class MapGl {
  constructor(containerId) {
    this.containerId = containerId;
    this.allTrajBox = document.getElementById('trajSelect');
    this.groupedByTraj = null;
    this.counter = 0;
    this.deckOverlay = null;
    this.layerOrder = ['speed', 'acceleration', 'distance', 'angle', 'bearing'];
    this.zOffsetStep = 1010;
    this.polygonLayerType = [{
      'speed': { elevation: 1000 },
      'acceleration': { elevation: 1000 },
      'distance': { elevation: 1000 },
      'angle': { elevation: 1000 },
      'bearing': { elevation: 1000 },
    }];
  }
  
  async fetchData(id) {
    try {
      if(id === '') {
        return
      } else{
        const response = await fetch(`/api/feats/map?tid=${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data || data.length === 0) {
            throw new Error('No data received');
        }
        return data;
      }
    } catch (error) {
        console.log('Error fetching data:', error);
        return [];
    }
}

  async filteringTrajectories (trajectories, id) {
    try {
      const data = await trajectories
      const selectedTrajectory =  data.filter((item) =>{
        return (String(item.tid) === String(id))
      })
      return selectedTrajectory
    } catch (error) {
      console.error(error)
      return []
    }
   
  }
  

  async traject(trajectories, id, selectedFeature) {
    try {
      let pathData = null;
      
      if (!this.map) {
        this.map = new maplibregl.Map({
          container: this.containerId.replace('#', ''),
          style: {
            version: 8,
            sources: {
              'osm': {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256
              }
            },
            layers: [{
              id: 'osm',
              type: 'raster',
              source: 'osm',
              minzoom: 0,
              maxzoom: 12
            }]
          },
          center: [25.0, 50.0],
          zoom: 6,
          pitch: 60,
          bearing: 30,
          antialias: true,
          preserveDrawingBuffer: true
        });
  
        this.deckOverlay = new deck.MapboxOverlay({
          layers: [],
          getTooltip: ({object}) => object && 
            `Trajectory ${object.tid} \n Speed: ${object.speed}\n Acceleration: ${object.acceleration}\n Angle: ${object.angle}\n Distance: ${object.distance}\n Bearing: ${object.bearing}`
      })
        
        this.map.addControl(this.deckOverlay);
        await new Promise(resolve => this.map.on('load', resolve));
      }
  
      const updateLayer = async () => {
        pathData = await this.pathConverter(trajectories, id);
        
        if (pathData && pathData.length > 0) {
          const bounds = {
            minLon: Infinity,
            maxLon: -Infinity,
            minLat: Infinity,
            maxLat: -Infinity
          };
  
          pathData.forEach(poly => {
            poly.polygon.forEach(point => {
              bounds.minLon = Math.min(bounds.minLon, point[0]);
              bounds.maxLon = Math.max(bounds.maxLon, point[0]);
              bounds.minLat = Math.min(bounds.minLat, point[1]);
              bounds.maxLat = Math.max(bounds.maxLat, point[1]);
            });
          });
  
          const newCenter = [
            (bounds.minLon + bounds.maxLon) / 2,
            (bounds.minLat + bounds.maxLat) / 2
          ];
  
          this.map.easeTo({
            center: newCenter,
            duration: 1000
          });
        }
  
        const layers = [];
        Object.keys(this.polygonLayerType[0]).forEach((type) => {
          const category = this.polygonLayerType[0][type];
          const mainLayer = this.polygonGenerator(type, pathData, category, selectedFeature);
          layers.push(mainLayer);
          
          // Add outline layer for selected feature
          if (selectedFeature?.includes(type)) {
            const outlineLayer = this.createOutlineLayer(type, pathData, category);
            layers.push(outlineLayer);
          }
        });

        this.deckOverlay.setProps({
          layers: layers
        });
      };

      await updateLayer();
      
    } catch (error) {
      console.error('Error updating trajectory:', error);
    }
  }

  createOutlineLayer(type, initialPathData, category) {
    const zOffset = this.layerOrder.indexOf(type) * this.zOffsetStep;
    
    return new deck.PolygonLayer({
      id: `OutlineLayer${type}`,
      data: initialPathData,
      pickable: false,
      stroked: true,
      filled: false,
      extruded: true,
      wireframe: true,
      getPolygon: d => d.polygon.map(point => [point[0], point[1], point[2] + zOffset]),
      getLineWidth: 500,
      lineWidthScale: 200,
      lineWidthMinPixels: 150,
      lineWidthMaxPixels: 1000,
      getLineColor: [0, 255, 0, 255],
      parameters: {
        depthTest: false
      }
    });
  }

  colorizing (type, initialPathData) {
    if(initialPathData) {
      let colorScale;

      if (type === 'speed') {
        const speeds = initialPathData.map(d => d.speed).filter(v => !isNaN(v));
        const minSpeed = Math.min(...speeds);
        const maxSpeed = Math.max(...speeds);
        colorScale = d3.scaleLinear().domain([minSpeed, maxSpeed]).range([[254,229,217], [165,15,21]]);
  
      } else if (type === 'acceleration') {
        const accelerations = initialPathData.map((d) => d.acceleration).filter(v => !isNaN(v))
        const minAcc = Math.min(...accelerations)
        const maxAcc = Math.max(...accelerations)
        colorScale = d3.scaleLinear().domain([minAcc, maxAcc]).range([[254,229,217], [165,15,21]])
      }
      else if (type === 'distance') {
        const distances = initialPathData.map((d) => d.distance).filter(v => !isNaN(v))
        const minDist = Math.min(...distances)
        const maxDist = Math.max(...distances)
        colorScale = d3.scaleLinear().domain([minDist, maxDist]).range([[254,229,217], [165,15,21]])
      }
      else if (type === 'angle') {
        const angles = initialPathData.map((d) => d.angle).filter(v => !isNaN(v))
        const minAngle= Math.min(...angles)
        const maxAngle = Math.max(...angles)
        colorScale = d3.scaleLinear().domain([minAngle, maxAngle]).range([[254,229,217], [165,15,21]])
      }
      else if (type === 'bearing') {
        const bearings = initialPathData.map((d) => d.bearing).filter(v => !isNaN(v))
        const minBearing = Math.min(...bearings)
        const maxBearing = Math.max(...bearings)
        colorScale = d3.scaleLinear().domain([minBearing, maxBearing]).range([[254,229,217], [165,15,21]])
      }
      return colorScale
    }

  }

  polygonGenerator(type, initialPathData, category, selectedFeature) {
    const colorScale = this.colorizing(type, initialPathData);
    const zOffset = this.layerOrder.indexOf(type) * this.zOffsetStep;
  
    const layerConfig = {
      id: `PolygonLayer${type}`,
      data: initialPathData,
      pickable: true,
      stroked: false,  // Remove default stroke
      filled: true,
      extruded: true,
      wireframe: true,
      getPolygon: d => d.polygon.map(point => [point[0], point[1], point[2] + zOffset]),
      parameters: {
        depthTest: false
      },
      getElevation: category.elevation,
      material: {
        ambient: 0.6,
        diffuse: 0.4,
        shininess: 100,
        specularColor: [220, 220, 220]
      }
    };
  
    if (selectedFeature) {
      layerConfig.getFillColor = d => {
        const value = d[type];
        const color = colorScale ? colorScale(value) : [255, 255, 255];
        return [...color, 255];
      };
    } else {
      layerConfig.getFillColor = d => {
        const value = d[type];
        return colorScale ? [...colorScale(value), 255] : [255, 255, 255, 255];
      };
    }
  
    const layer = new deck.PolygonLayer(layerConfig);
    return layer;
  }


  async pathConverter (trajectories, id) {

    const data = await trajectories;
    if(data) {
      const filtered = data.filter((row) => String(row.tid) === String(id));
      if (filtered.length > 0) {
        const groupedByTraj = {};
        filtered.forEach(row => {
          if (!groupedByTraj[row.tid]) {
            groupedByTraj[row.tid] = [];
          }
          const point = [parseFloat(row.lon), parseFloat(row.lat)];
          if (!isNaN(point[0]) && !isNaN(point[1])) {
            groupedByTraj[row.tid].push({
              coordinates: point,
              speed: parseFloat(row.speed),
              acceleration: parseFloat(row.acceleration),
              distance: parseFloat(row.distance),
              angle: parseFloat(row.angle),
              bearing: parseFloat(row.bearing),
            });
          }
        });

        const theWall = await this.generateWall(groupedByTraj);

        return theWall;
      }
      return [];
    }

  };
  async generateWall(groupedByTraj) {
    const wall = Object.keys(groupedByTraj).map(tid => {
      const path = groupedByTraj[tid];
      const polygons = [];
      
      for (let i = 0; i < path.length - 1; i++) {
        const p1 = path[i];
        const p2 = path[i + 1];
        
        polygons.push({
          tid: tid,
          speed: p2.speed,
          acceleration: p2.acceleration,
          distance: p2.distance,
          angle: p2.angle,
          bearing: p2.bearing,
          polygon: [
            [p1.coordinates[0], p1.coordinates[1], 0],
            [p2.coordinates[0], p2.coordinates[1], 0],     
            [p2.coordinates[0], p2.coordinates[1], 1],
            [p1.coordinates[0], p1.coordinates[1], 1] 
          ]
        });
      }
      return polygons;
    }).flat();
    return wall;
  };
  
  async generateMapGl(id) {
    try {
      const trajectories = await this.fetchData(id);
      return trajectories

    } catch (error) {
      console.error('Error in main:', error);
    }
  }

}