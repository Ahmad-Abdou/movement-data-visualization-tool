// Fetching data from the
fetch(foxTrajectoriesData)
  .then(function(response) {
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
  })
  .then(function(data) {
      // console.log(data);
      addPolygon(data);
  })
  .catch(function(error) {
      console.error('There was a problem with the fetch operation:', error);
  });



function addPolygon(fetchedData) {
    // Settings lar and long with fetched data
    const latitudes = Array.from(new Set(fetchedData.map(data => data.x)))
    const longitudes = Array.from(new Set(fetchedData.map(data => data.y)))
    // Mapping lists of Xs with Ys.
    let selectedPoints = latitudes.map((lat, index) => {
        return [lat, longitudes[index]];
        });

    var map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            // .setContent("You clicked the map at " + e.latlng.toString())                                 
            // .openOn(map);
            L.marker(e.latlng).bindPopup(`${e.latlng}`).addTo(map)
        }

    map.on('click', onMapClick);   

    var polygon2 = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
    ]).addTo(map);
    polygon2.setStyle({fillColor: '#FF0000'})

    // // Polygon using 1000 samples fetched from Flask.
    // console.log(selectedPoints);
    // var polygon2 = L.polygon(selectedPoints).addTo(map);
    // polygon2.setStyle({fillColor: '#FF0000'})

    // Sample for first 6 entries in the fox_trajectories.csv file.
    // var polygon3 = L.polygon([
    //     [1702.75588872087, -4883.99554634231],
    //     [1704.88662972688, -4843.16160268573],
    //     [1960.01057141359, -4801.62981479616],
    //     [1898.2200467445, -4823.76547528762],
    //     [1315.71100912601, -5025.03268269556],
    //     [1696.98327056273, -4913.38702864198]
    // ]).addTo(map);
    // polygon3.setStyle({fillColor: '#FF0000'})
}