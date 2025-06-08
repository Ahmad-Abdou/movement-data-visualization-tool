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
    this.type = null
    this.fullPath = null
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
  

  async traject(trajectories, id, selectedFeature, entierTrajectory) {
    try {
      let pathData = null
      let pathEntierTrajectory = null
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
        pathEntierTrajectory = await this.entierTrajectoryConverter(entierTrajectory, id)

        let fitPath = null;
        if (selectedFeature && selectedFeature.includes('distance')) {
          fitPath = pathEntierTrajectory;
        } else {
          fitPath = pathData;
        }
        if (fitPath && fitPath.length > 0) {
          const bounds = {
            minLon: Infinity,
            maxLon: -Infinity,
            minLat: Infinity,
            maxLat: -Infinity
          };
          fitPath.forEach(poly =>
            poly.polygon.forEach(([lon, lat]) => {
              bounds.minLon = Math.min(bounds.minLon, lon);
              bounds.maxLon = Math.max(bounds.maxLon, lon);
              bounds.minLat = Math.min(bounds.minLat, lat);
              bounds.maxLat = Math.max(bounds.maxLat, lat);
            })
          );
          const sw = [bounds.minLon, bounds.minLat];
          const ne = [bounds.maxLon, bounds.maxLat];
          this.map.fitBounds([sw, ne], {
            padding: 50,
            duration: 1500,
            maxZoom: 10
          });
        }

        let layers = []
        Object.keys(this.polygonLayerType[0]).forEach((type) => {
          const category = this.polygonLayerType[0][type]
          const mainLayer = this.polygonGenerator(type, pathData, category, selectedFeature, id, pathEntierTrajectory)
          layers.push(mainLayer)
          
        })

        const directLineLayer = this.generateDirectLineLayer(pathData, selectedFeature, pathEntierTrajectory)
        if (directLineLayer) {
          layers.push(directLineLayer)
        }

        const iconPathLayer = this.iconLayer(selectedFeature)
        if (iconPathLayer) {
          layers.push(iconPathLayer)
        }

          this.deckOverlay.setProps({
            layers:  layers

          })
      }
      await updateLayer()
      if(selectedFeature){
        const type = selectedFeature.split('_')[0]
        this.create_2d_heatmap(id , trajectories, selectedFeature, type)

      }

    } catch (error) {
      console.error('Error updating trajectory:', error)
    }
  }

  generateDirectLineLayer(pathData, selectedFeature, pathEntierTrajectory) {
    if(selectedFeature) {
      const type = selectedFeature.split('_')[0]
      const colorScale = this.colorizing(type, selectedFeature && selectedFeature.includes('distance')? pathEntierTrajectory: pathData)

      let segments = []
      let source = (selectedFeature && selectedFeature.includes('distance')) ? pathEntierTrajectory : pathData
      if (source && source.length > 0) {
        for (let i = 0; i < source.length; i++) {
          const seg = source[i]
          segments.push({
            path: [
              [seg.polygon[0][0], seg.polygon[0][1]],
              [seg.polygon[1][0], seg.polygon[1][1]]
            ],
            value: seg[type],
            tid: seg.tid,
            speed: seg.speed,
            acceleration: seg.acceleration,
            distance: seg.distance,
            angle: seg.angle,
            bearing: seg.bearing
          })
        }
      }

      let displaySegments = segments
      switch(selectedFeature) {
        case 'distance_geometry_1_1':
          displaySegments = segments.length > 0 ? [segments[0], segments[segments.length - 1]] : []
          break
        case 'distance_geometry_2_1':
          displaySegments = segments.slice(0, Math.floor(segments.length / 2))
          break
        case 'distance_geometry_2_2':
          displaySegments = segments.slice(Math.floor(segments.length / 2), segments.length)
          break
        case 'distance_geometry_3_1':
          displaySegments = segments.slice(0, Math.floor(segments.length / 3))
          break
        case 'distance_geometry_3_2':
          displaySegments = segments.slice(Math.floor(segments.length / 3), Math.floor(2 * segments.length / 3))
          break
        case 'distance_geometry_3_3':
          displaySegments = segments.slice(Math.floor(2 * segments.length / 3), segments.length)
          break
        case 'distance_geometry_4_1':
          displaySegments = segments.slice(0, Math.floor(segments.length / 4))
          break
        case 'distance_geometry_4_2':
          displaySegments = segments.slice(Math.floor(segments.length / 4), Math.floor(2 * segments.length / 4))
          break
        case 'distance_geometry_4_3':
          displaySegments = segments.slice(Math.floor(2 * segments.length / 4), Math.floor(3 * segments.length / 4));
          break;
        case 'distance_geometry_4_4':
          displaySegments = segments.slice(Math.floor(3 * segments.length / 4), segments.length);
          break;
        case 'distance_geometry_5_1':
          displaySegments = segments.slice(0, Math.floor(segments.length / 5));
          break;
        case 'distance_geometry_5_2':
          displaySegments = segments.slice(Math.floor(segments.length / 5), Math.floor(2 * segments.length / 5));
          break;
        case 'distance_geometry_5_3':
          displaySegments = segments.slice(Math.floor(2 * segments.length / 5), Math.floor(3 * segments.length / 5));
          break;
        case 'distance_geometry_5_4':
          displaySegments = segments.slice(Math.floor(3 * segments.length / 5), Math.floor(4 * segments.length / 5));
          break;
        case 'distance_geometry_5_5':
          displaySegments = segments.slice(Math.floor(4 * segments.length / 5), segments.length);
          break;
        default:
          displaySegments = segments
      }
      this.fullPath = displaySegments.map(seg => ({ path: seg.path }))

      return new deck.PathLayer({
        id: 'PathLayer',
        data: displaySegments,
        getPath: d => d.path,
        getColor: d => {
          if (selectedFeature?.includes(type)) {
            const value = d.value
            let color = colorScale && typeof value !== 'undefined' && !isNaN(value) ? colorScale(value) : undefined
            if (!Array.isArray(color) || color.length !== 3) {
              color = [255, 255, 255]
            }
            return [...color, 255]
          }
          return [255, 255, 255, 255]
        },
        getWidth: 100,
        pickable: true,
        widthMinPixels: 2,
        parameters: {
          depthMask: false
        },
        getTooltip: ({object}) => object && 
          `Trajectory: ${object.tid ?? 'N/A'}
Speed: ${object.speed ?? 'N/A'}
Acceleration: ${object.acceleration ?? 'N/A'}
Angle: ${object.angle ?? 'N/A'}
Distance: ${object.distance ?? 'N/A'}
Bearing: ${object.bearing ?? 'N/A'}
Value: ${object.value ?? 'N/A'}`
      })
    }
  }

  iconLayer(selectedFeature) {
    if (selectedFeature && this.fullPath && this.fullPath.length > 0) {
      const iconData = [];
      this.fullPath.forEach(pathObj => {
        const coords = pathObj.path;
        for (let i = 0; i < coords.length - 1; i++) {
          const start = coords[i];
          const end = coords[i + 1];
          const mid = [
            (start[0] + end[0]) / 2,
            (start[1] + end[1]) / 2
          ];
          const dx = end[0] - start[0];
          const dy = end[1] - start[1];
          const angle = (Math.atan2(dy, dx) * 180 / Math.PI) - 90;
          iconData.push({
            position: mid,
            angle: angle
          });
        }
      });
      return new deck.IconLayer({
        id: 'ArrowIconLayer',
        data: iconData,
        getIcon: d => ({
          url: '/static/img/arrow.png',
          width: 64,
          height: 64,
          anchorY: 32,
          anchorX: 32
        }),
        getPosition: d => d.position,
        getAngle: d => d.angle,
        sizeScale: 2,
        getSize: 10,
        getColor: [0, 0, 139, 255],
        pickable: false,
        billboard: false
      });
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

  polygonGenerator(type, initialPathData, category, selectedFeature, selectedTrajectory, entierTrajectory) {
    d3.select('#trajectory-parent-group').selectAll("*").remove()
    this.heatmapPositions[selectedTrajectory] = 0;
    const colorScale = this.colorizing(type, selectedFeature && selectedFeature.includes('distance')? entierTrajectory: initialPathData)
    const zOffset = this.layerOrder.indexOf(type) * this.zOffsetStep
  
    const layerConfig = {
      id: `PolygonLayer${type}`,
      data: selectedFeature && entierTrajectory && selectedFeature.includes('distance')? entierTrajectory: initialPathData,
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

  async entierTrajectoryConverter (trajectories, id) {

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

  create_2d_heatmap(id , trajectories, selectedFeature, type) {
    if (type === 'angles'){
      type = 'angle'
    }
    const filtered = trajectories.map((row) => row[type])
    allValues.push(...filtered)

    if(allValues.length >= 20) {
      const colorScale = d3.scaleLinear().domain([d3.min(allValues), d3.max(allValues)]).range(["#ffffcc", "#e31a1c"])
      let traj_group = trajectory_parent_group.append('g').attr('id', `rect-group-${id}`);
  
      trajectory_parent_group.selectAll('#selectedFeature').remove()
      trajectory_parent_group.append('text')
      .attr('id', 'selectedFeature')
      .attr('x', '45%')
      .attr('y', '20%')
      .text(`${selectedFeature.toUpperCase()}`)
      .attr('font-size', 23)  
      
      traj_group.selectAll('rect')
        .data(allValues)
        .join('rect')
        .attr('id', (d,i) => `rect-${id}-${i}`)
        .attr('width', 71)
        .attr('height', 90)
        .attr('x', (d,i) =>  i < 10 ? (70 * i) + 600 : (70 * i) - 100 )
        .attr('y', (d,i) => i < 10 ? 100 : 200)
        .attr('fill', d => colorScale(d))
        .attr('stroke', 'black')
        .attr('stroke-width', '1px')
        .on('mouseover', function(event, d) {
          const [x, y] = d3.pointer(event);

          d3.select(this)
            .attr('stroke','#0080FF')
            .attr('stroke-width', '4px')
            .raise();

          trajectory_parent_group.append('rect')
            .attr('class', 'tooltip-bg')
            .attr('width', 200)
            .attr('height', 40)
            .attr('x', x - 120)
            .attr('y', y - 60)
            .attr('opacity', 0.5);

          trajectory_parent_group.append('text')
            .attr('class', 'tooltip-text')
            .attr('x', x - 110)
            .attr('y', y - 40)
            .text(d)
            .attr('fill', 'white');
        })
        .on('mousemove', function(event, d) {
          const [x, y] = d3.pointer(event);

          d3.select(this)
            .attr('stroke', '#0080FF')
            .attr('stroke-width', '4px');

          trajectory_parent_group.select('.tooltip-bg')
            .attr('x', x - 120)
            .attr('y', y - 60);

          trajectory_parent_group.select('.tooltip-text')
            .attr('x', x - 110)
            .attr('y', y - 40);
        })
        .on('mouseout', function(event, d) {
          d3.select(this)
            .attr('stroke', 'black')
            .attr('stroke-width', '1px');

          trajectory_parent_group.selectAll('.tooltip-bg, .tooltip-text').remove();
        })
        traj_group.append('text')
        .attr('x', (window.innerWidth / 3) - 125)
        .attr('y', '35%')
        .attr('fill', 'black')
        .style('font-size', '14px')
        .text(`Trajectory 1`)

        traj_group.append('text')
        .attr('x', (window.innerWidth / 3) - 125)
        .attr('y', '55%')
        .attr('fill', 'black')
        .style('font-size', '14px')
        .text(`Trajectory 2`)
      
        allValues = []
      } 
  }
}