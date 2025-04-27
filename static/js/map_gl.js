class MapGl {
  constructor(containerId) {
    this.containerId = containerId
    this.allTrajBox = document.getElementById('trajSelect')
    this.groupedByTraj = null
    this.counter = 0
    this.deckOverlay = null
    this.layerOrder = ['speed', 'acceleration', 'distance', 'angle', 'bearing']
    this.zOffsetStep = 1010
    this.zoom = 6
    this.pitch = 60
    this.heatmapPositions = {}
    this.polygonLayerType = [{
      'speed': { elevation: 1000 },
      'acceleration': { elevation: 1000 },
      'distance': { elevation: 1000 },
      'angle': { elevation: 1000 },
      'bearing': { elevation: 1000 },
    }]
    this.counter = 0
    this.views = document.getElementById('views')
  }
  
  async fetchData(id) {
    try {
      if(id === '') {
        return
      } else{
        const response = await fetch(`/api/feats/map?tid=${id}&category_id=${current_category_id}`)
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (!data || data.length === 0) {
            throw new Error('No data received')
        }
        return data
      }
    } catch (error) {
        console.log('Error fetching data:', error)
        return []
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
      let pathData = null
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
          zoom: this.zoom,
          pitch: this.pitch,
          bearing: 30,
          antialias: true,          
          maxPitch: 85,
          preserveDrawingBuffer: true
        })
        this.deckOverlay = new deck.MapboxOverlay({
          layers: [],
          getTooltip: ({object}) => object && 
            `Trajectory ${object.tid} \n Speed: ${object.speed}\n Acceleration: ${object.acceleration}\n Angle: ${object.angle}\n Distance: ${object.distance}\n Bearing: ${object.bearing}`
      })
        
        this.map.addControl(this.deckOverlay)
        await new Promise(resolve => this.map.on('load', resolve))
      }
  
      const updateLayer = async () => {
        pathData = await this.pathConverter(trajectories, id)
        if (pathData && pathData.length > 0) {
          const bounds = {
            minLon: Infinity,
            maxLon: -Infinity,
            minLat: Infinity,
            maxLat: -Infinity
          }
  
          pathData.forEach(poly => {
            poly.polygon.forEach(point => {
              bounds.minLon = Math.min(bounds.minLon, point[0])
              bounds.maxLon = Math.max(bounds.maxLon, point[0])
              bounds.minLat = Math.min(bounds.minLat, point[1])
              bounds.maxLat = Math.max(bounds.maxLat, point[1])
            })
          })
  
          const newCenter = [
            (bounds.minLon + bounds.maxLon) / 2,
            (bounds.minLat + bounds.maxLat) / 2
          ]
  
          this.map.easeTo({
            center: newCenter,
            duration: 1000
          })
        }
  
        let layers = []
        Object.keys(this.polygonLayerType[0]).forEach((type) => {
          const category = this.polygonLayerType[0][type]
          const mainLayer = this.polygonGenerator(type, pathData, category, selectedFeature, id)
          layers.push(mainLayer)
          
        })

        const directLineLayer = this.generateDirectLineLayer(pathData, selectedFeature)
        if (directLineLayer) {
          layers.push(directLineLayer)
        }
          this.deckOverlay.setProps({
            layers:  layers

          })
      }

      await updateLayer()
      
    } catch (error) {
      console.error('Error updating trajectory:', error)
    }
  }

  generateDirectLineLayer(pathData, selectedFeature) {
    if(selectedFeature) {
      const path = []
      path.push([pathData[0].polygon[0][0], pathData[0].polygon[0][1]])
      pathData.forEach(segment => {
        path.push([segment.polygon[1][0], segment.polygon[1][1]])
      })
      let displayPath = path
  
  
      switch(selectedFeature) {
        case 'distance_geometry_1_1':
          displayPath = [ path[0],path[path.length - 1]]
          break
        case 'distance_geometry_2_1':
          displayPath = path.slice(0, Math.floor(path.length / 2))
          break
        case 'distance_geometry_2_2':
          displayPath = path.slice(Math.floor(path.length / 2), path.length)
          break
        case 'distance_geometry_3_1':
          displayPath = path.slice(0, Math.floor(path.length / 3))
          break
        case 'distance_geometry_3_2':
          displayPath = path.slice(Math.floor(path.length / 3), Math.floor(2 * path.length / 3))
          break
        case 'distance_geometry_3_3':
          displayPath = path.slice(Math.floor(2 * path.length / 3), path.length)
          break
        case 'distance_geometry_4_1':
          displayPath = path.slice(0, Math.floor(path.length / 4))
          break
        case 'distance_geometry_4_2':
          displayPath = path.slice(Math.floor(path.length / 4), Math.floor(2 * path.length / 4))
          break
        case 'distance_geometry_4_3':
          displayPath = path.slice(Math.floor(2 * path.length / 4), Math.floor(3 * path.length / 4));
          break;
        case 'distance_geometry_4_4':
          displayPath = path.slice(Math.floor(3 * path.length / 4), path.length);
          break;
        case 'distance_geometry_5_1':
          displayPath = path.slice(0, Math.floor(path.length / 5));
          break;
        case 'distance_geometry_5_2':
          displayPath = path.slice(Math.floor(path.length / 5), Math.floor(2 * path.length / 5));
          break;
        case 'distance_geometry_5_3':
          displayPath = path.slice(Math.floor(2 * path.length / 5), Math.floor(3 * path.length / 5));
          break;
        case 'distance_geometry_5_4':
          displayPath = path.slice(Math.floor(3 * path.length / 5), Math.floor(4 * path.length / 5));
          break;
        case 'distance_geometry_5_5':
          displayPath = path.slice(Math.floor(4 * path.length / 5), path.length);
          break;
        default:
          displayPath = path
      }
      const data = [{ path: displayPath }];
  
      return new deck.PathLayer({
        id: 'PathLayer',
        data: data,
        getPath: d => d.path,
        getColor: [0, 0, 139, 255],
        getWidth: 100,
        pickable: false,
        widthMinPixels: 4,
        parameters: {
          depthMask: false
        }
      })
    }
    
  }

  colorizing (type, initialPathData) {
    if(initialPathData) {
      let colorScale

      if (type === 'speed') {
        const speeds = initialPathData.map(d => d.speed).filter(v => !isNaN(v))
        const minSpeed = Math.min(...speeds)
        const maxSpeed = Math.max(...speeds)
        colorScale = d3.scaleLinear().domain([minSpeed, maxSpeed]).range([[255,255,204], [227,26,28]])
  
      } else if (type === 'acceleration') {
        const accelerations = initialPathData.map((d) => d.acceleration).filter(v => !isNaN(v))
        const minAcc = Math.min(...accelerations)
        const maxAcc = Math.max(...accelerations)
        colorScale = d3.scaleLinear().domain([minAcc, maxAcc]).range([[255,255,204], [227,26,28]])
      }
      else if (type === 'distance') {
        const distances = initialPathData.map((d) => d.distance).filter(v => !isNaN(v))
        const minDist = Math.min(...distances)
        const maxDist = Math.max(...distances)
        colorScale = d3.scaleLinear().domain([minDist, maxDist]).range([[255,255,204], [227,26,28]])
      }
      else if (type === 'angle') {
        const angles = initialPathData.map((d) => d.angle).filter(v => !isNaN(v))
        const minAngle= Math.min(...angles)
        const maxAngle = Math.max(...angles)
        colorScale = d3.scaleLinear().domain([minAngle, maxAngle]).range([[255,255,204], [227,26,28]])
      }
      else if (type === 'bearing') {
        const bearings = initialPathData.map((d) => d.bearing).filter(v => !isNaN(v))
        const minBearing = Math.min(...bearings)
        const maxBearing = Math.max(...bearings)
        colorScale = d3.scaleLinear().domain([minBearing, maxBearing]).range([[255,255,204], [227,26,28]])
      }
      return colorScale
    }

  }

  polygonGenerator(type, initialPathData, category, selectedFeature, selectedTrajectory) {
    d3.select('#trajectory-parent-group').selectAll("*").remove()
    const position = 0
    this.heatmapPositions[selectedTrajectory] = 0;
    const colorScale = this.colorizing(type, initialPathData)
    const zOffset = this.layerOrder.indexOf(type) * this.zOffsetStep
  
    const layerConfig = {
      id: `PolygonLayer${type}`,
      data: initialPathData,
      pickable: true,
      stroked: false,
      filled: true,
      extruded: true,
      wireframe: true,
      getPolygon: d => this.views.value === '2D'? d.polygon.map(point => [0, 0, 0 ]): d.polygon.map(point => [point[0], point[1], point[2] + zOffset]),
      parameters: {
        depthTest: true,
        depthMask: true
      },
      getElevation: this.views.value === '2D'? 0:category.elevation,
      material: {
        ambient: 0.6,
        diffuse: 0.4,
        shininess: 100,
        specularColor: [220, 220, 220]
      }
    }
    if (selectedFeature) {
      layerConfig.getFillColor = d => {
        if(selectedFeature?.includes(type)) {
          const value = d[type]
          const color = colorScale ? colorScale(value) : [255, 255, 255]
          this.create_2d_heatmap(selectedTrajectory,  color, position, value, selectedFeature)
          return [...color, 255]
        } else {
          return [211,211,211, 100]

        }
      }
    } else {
      layerConfig.getFillColor = d => {
        const value = d[type]
        return colorScale ? [...colorScale(value), 255] : [255, 255, 255, 255]
      }
    }
  
    const layer = new deck.PolygonLayer(layerConfig)
    return layer
  }


  async pathConverter (trajectories, id) {

    const data = await trajectories
    if(data) {
      const filtered = data.filter((row) => String(row.tid) === String(id))
      if (filtered.length > 0) {
        const groupedByTraj = {}
        filtered.forEach(row => {
          if (!groupedByTraj[row.tid]) {
            groupedByTraj[row.tid] = []
          }
          const point = [parseFloat(row.lon), parseFloat(row.lat)]
          if (!isNaN(point[0]) && !isNaN(point[1])) {
            groupedByTraj[row.tid].push({
              coordinates: point,
              speed: parseFloat(row.speed),
              acceleration: parseFloat(row.acceleration),
              distance: parseFloat(row.distance),
              angle: parseFloat(row.angle),
              bearing: parseFloat(row.bearing),
            })
          }
        })

        const theWall = await this.generateWall(groupedByTraj)
        return theWall
      }
      return []
    }

  }
  async generateWall(groupedByTraj) {
    const wall = Object.keys(groupedByTraj).map(tid => {
      const path = groupedByTraj[tid]
      const polygons = []
      
      for (let i = 0 ;i < path.length - 1 ;i++) {
        const p1 = path[i]
        const p2 = path[i + 1]
        
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
        })
      }
      return polygons
    }).flat()
    return wall
  }
  
  async generateMapGl(id) {
    try {
      const trajectories = await this.fetchData(id)
      return trajectories

    } catch (error) {
      console.error('Error in main:', error)
    }
  }
  updateView() {
    if (this.deckOverlay && this.deckOverlay._map) {
      const map = this.deckOverlay._map;
      map.setZoom(this.zoom);
      map.setPitch(this.pitch);
    }
  }

  create_2d_heatmap(selectedTrajectory, color, position, value, selectedFeature) {
    if (!this.heatmapPositions[selectedTrajectory]) {
      this.heatmapPositions[selectedTrajectory] = 0;
    }
    
    position = this.heatmapPositions[selectedTrajectory];
    this.heatmapPositions[selectedTrajectory] += 73;
    let yPosition = 0;
    if (selectedTrajectory1) {
      yPosition = (selectedTrajectory === selectedTrajectory1) ? '30%' : '50%';
    }
    const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  
    let traj_group = trajectory_parent_group.append('g').attr('id', `rect-group-${selectedTrajectory}`);
    const centerX = (window.innerWidth / 3) + position -50

    const labelY = selectedTrajectory === selectedTrajectory1 ? '40%' : '60%'
    trajectory_parent_group.selectAll('#selectedFeature').remove()
    trajectory_parent_group.append('text')
    .attr('id', 'selectedFeature')
    .attr('x', '45%')
    .attr('y', '20%')
    .text(`${selectedFeature.toUpperCase()}`)
    .attr('font-size', 23)

    traj_group.append('rect')
      .attr('id', `rect-${selectedTrajectory}-${position}`)
      .attr('width', 71)
      .attr('height', 90)
      .attr('x', centerX)
      .attr('y', yPosition)
      .attr('fill', rgbColor)
      .attr('stroke', 'white')
      .attr('stroke-width', '2px')
      .on('mouseover', (event) => {
        const [x, y] = d3.pointer(event)
        trajectory_parent_group.select(`#rect-${selectedTrajectory}-${position}`)
        .attr('stroke',  kinematicColor)
        .attr('stroke-width', '3px')

        trajectory_parent_group.append('rect')
        .attr('id', 'tooltips-rect')
        .attr('width' , 200)
        .attr('height' , 40)
        .attr('x', x - 120)
        .attr('y', y- 60)
        .attr('opacity', 0.5)

        trajectory_parent_group.append('text')
        .attr('id', 'tooltips')
        .attr('x', x - 110)
        .attr('y', y- 40)
        .text(`${value}`)
        .attr('fill', 'white')

      }).on('mousemove', (event) => {
        const [x, y] = d3.pointer(event)
        trajectory_parent_group.select(`#rect-${selectedTrajectory}-${position}`)
        .attr('stroke',  kinematicColor)
        .attr('stroke-width', '3px')

        trajectory_parent_group.select('#tooltips-rect')
        .attr('x', x - 120)
        .attr('y', y- 60)

        trajectory_parent_group.select('#tooltips')
        .attr('x', x - 110)
        .attr('y', y- 40)

      }).on('mouseout', () => {
        trajectory_parent_group.select(`#rect-${selectedTrajectory}-${position}`).attr('stroke', 'white').attr('stroke-width', '2px')

        trajectory_parent_group.select('#tooltips').remove()
        trajectory_parent_group.select('#tooltips-rect').remove()

      })

      traj_group.append('text')
      .attr('x', (window.innerWidth / 3) - 125)
      .attr('y', labelY)
      .attr('fill', 'black')
      .style('font-size', '14px')
      .text(`Trajectory ${selectedTrajectory === selectedTrajectory1 ? '1' : '2'}`)
  }
}