var map = L.map('map').setView([72.88, -79.80], 10);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let activeTrajectories = [];

function showTrajectoryOnMap(id) {
    if (!id) return;
    
    // Clear previous trajectories
    activeTrajectories.forEach(layer => map.removeLayer(layer));
    activeTrajectories = [];
    
    const datasetFolder = getCurrentDatasetFolder();
    const geojsonPath = `../static/${datasetFolder}/${id}.geojson`;
    
    fetch(geojsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const trajectory = L.geoJSON(data, {
                style: {
                    color: isChecked ? '#D70040' : '#69b3a2',
                    weight: 2,
                    opacity: 0.8
                }
            }).addTo(map);

            activeTrajectories.push(trajectory);
            map.fitBounds(trajectory.getBounds());
        })
        .catch(error => {
            console.error('Error loading trajectory:', error);
            console.log('Failed to load:', geojsonPath);
        });
}
