const views = document.getElementById('views')
const view3D = document.getElementById('view-3d')
const map_container = document.querySelector('.map-container')
const mapContainer1 = document.getElementById('map-container-1')
const mapContainer2 = document.getElementById('map-container-2')
const heatmap2d = document.getElementById('heatmap-2d')

views.addEventListener('change', (e) => {
  if (e.target.value === '2D'){
    view3D.className = 'view-2d'
    
    view3D.style.display = 'flex'
    view3D.style.flexDirection = 'column'
    view3D.style.width = '100%'
    view3D.style.height = '100%'
    
    heatmap2d.style.display = 'block'
    heatmap2d.style.height = '50%'
    heatmap2d.style.width = '100%'
    heatmap2d.style.order = '1'
    
    let mapsWrapper = document.getElementById('maps-wrapper')
    if (!mapsWrapper) {
      mapsWrapper = document.createElement('div')
      mapsWrapper.id = 'maps-wrapper'
      mapsWrapper.style.display = 'flex'
      mapsWrapper.style.flexDirection = 'row'
      mapsWrapper.style.width = '100%'
      mapsWrapper.style.height = '50%'
      mapsWrapper.style.order = '2'
      
      view3D.appendChild(mapsWrapper)
      mapGl.zoom = 2
      mapGl.pitch = 0
      mapGl.updateView()
      mapGl2.zoom = 2
      mapGl2.pitch = 0
      mapGl2.updateView()
      mapsWrapper.appendChild(mapContainer1)
      mapsWrapper.appendChild(mapContainer2)
    }
    

    mapContainer1.style.width = '50%'
    mapContainer1.style.height = '100%'
    mapContainer1.style.float = 'none'
    
    mapContainer2.style.width = '50%'
    mapContainer2.style.height = '100%'
    mapContainer2.style.float = 'none'
    
  } else {  
    view3D.className = 'view-3d'
    view3D.style.flexDirection = 'column'
    
    const mapsWrapper = document.getElementById('maps-wrapper')
    if (mapsWrapper) {
      view3D.appendChild(mapContainer1)
      view3D.appendChild(mapContainer2)
      
      mapsWrapper.remove()
    }
    
    mapContainer1.style.width = '100%'
    mapContainer1.style.height = '100%'
    
    mapContainer2.style.width = '100%'
    mapContainer2.style.height = '100%'
    
    heatmap2d.style.display = 'none'
    mapGl.zoom = 6
    mapGl.pitch = 60
    mapGl.updateView()
    mapGl2.zoom = 6
    mapGl2.pitch = 60
    mapGl2.updateView()
  }
  
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'))
  }, 100)
})
