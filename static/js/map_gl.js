class MapGl {
  constructor(id) {
    this.id = id
    this.allTrajBox = document.getElementById('trajSelect')
    this.groupedByTraj = null
    this.counter = 0
    this.deckOverlay = null
    this.polygonLayerType = [{
      'speed':{
        'elevation': 25000,
        'color': [146, 43, 33,255]
      },
      'acceleration':{
        'elevation': 20000,
    
        'color': [33, 47, 61,255]
      },
      'distance':{
        'elevation': 15000,
        'color': [98, 101, 103 ,255]
      },
      'angle':{
        'elevation': 10000,
    
        'color': [29, 131, 72 ,255]
      },
      'bearing':{
        'elevation': 5000,
        'color': [26, 82, 118,255]
      },
    }]

  }
  
  async fetchData(id) {
    try {
        const response = await fetch(`/api/data/map?tid=${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data || data.length === 0) {
            throw new Error('No data received');
        }
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
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
  

  async traject (trajectories, id) {
    try {
      let pathData = null
      const updateLayer = async () => {
        pathData = await this.pathConverter(trajectories, id);
        const updatedLayers = Object.keys(this.polygonLayerType[0]).map((type) => {
          const category = this.polygonLayerType[0][type];
          this.polygonGenerator(type, pathData, category);
        });
        if(this.deckOverlay) {
          this.deckOverlay.setProps({
            layers: updatedLayers
          });
        }

        
  
        };
        await updateLayer()
      // const initialPathData = await this.pathConverter(trajectories, id);
      
      let centerLon = 0;
      let centerLat = 0;
      
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
  
        centerLon = (bounds.minLon + bounds.maxLon) / 2;
        centerLat = (bounds.minLat + bounds.maxLat) / 2;
      }
  
      if (isNaN(centerLon) || isNaN(centerLat)) {
        console.warn('Invalid coordinates, using default center');
        centerLon = 0;
        centerLat = 0;
      }
  
      const map = new maplibregl.Map({
        container: 'map',
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
            maxzoom: 8
          }]
        },
        center: [centerLon, centerLat],
        zoom: 3,
        pitch: 60,
        bearing: 30,
        antialias: true
      });
  
      await new Promise(resolve => map.on('load', resolve));
  
  
      const layers = Object.keys(this.polygonLayerType[0]).map((type) => {
        const category = this.polygonLayerType[0][type];
         return this.polygonGenerator(type, pathData, category);
      });
  
      
      this.deckOverlay = new deck.MapboxOverlay({
        layers: [layers],
        getTooltip: ({object}) => object && `Trajectory ${object.tid} \n Speed: ${object.speed}\n Acceleration: ${object.acceleration}\n Angle: ${object.angle}\n Distance: ${object.distance}\n Bearing: ${object.bearing}`
      });
      map.addControl(this.deckOverlay);
  

      // await this.showTrajIdAsOption(trajectories, updateLayer);

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  colorizing (type, initialPathData) {
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

  polygonGenerator(type, initialPathData, category) {
    const colorScale = this.colorizing(type, initialPathData)
    const layer = new deck.PolygonLayer({
      id: `PolygonLayer${type}`,
      data: initialPathData,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: true,
      wireframe: true,
      getPolygon: d => d.polygon,
      getFillColor: d => {
        if (type === 'speed' && colorScale) {
          const color = colorScale(d.speed);
          return [...color, 255];
  
        } else if(type === 'acceleration') {
          const color = colorScale(d.acceleration)
          return [...color, 255];
  
        } else if(type === 'distance') {
          const color = colorScale(d.distance)
          return [...color, 255];
  
        }
        else if(type === 'angle') {
          const color = colorScale(d.angle)
          return [...color, 255];
  
        }
        else if(type === 'bearing') {
          const color = colorScale(d.bearing)
          return [...color, 255];
  
        }
      },
      getLineColor: [0, 0, 0],
      getLineWidth: 2,
      getElevation: category.elevation,
      material: {
        ambient: 0.64,                     
        diffuse: 0.6,
        shininess: 32,
        specularColor: [51, 51, 51]
      }
    });
    return layer
  }

  async pathConverter (trajectories, id) {

    const data = await trajectories;

    const filtered = await data.filter((t)=>{
      return t.tid === id
    })

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
  };
  async generateWall (groupedByTraj) {
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
            [p2.coordinates[0], p2.coordinates[1], 5000],
            [p1.coordinates[0], p1.coordinates[1], 5000]
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