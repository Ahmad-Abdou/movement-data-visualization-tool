import json
import pandas as pd
import geojson

# Sample data input as a dictionary (can be replaced with reading from a CSV file)
data = pd.read_csv('C:/Users/ahmad/OneDrive/Desktop/thesis/High-Dimensional-Unlabeled-Movement-Data-visualization-tool/raw csv/football_trajectories.csv')

# Create a DataFrame from the data
df = pd.DataFrame(data)

# Initialize an empty list for GeoJSON features
# Initialize an empty list for GeoJSON features
features = []

# Iterate over the DataFrame rows
for _, row in df.iterrows():
    # Create a GeoJSON feature for each row
    feature = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [row['x'], row['y']]
        },
        "properties": {
            "id": row['id'],
            "time": row['time'],
            "displacementTime": row['displacementTime']
        }
    }
    features.append(feature)

# Create a FeatureCollection
geojson_data = {
    "type": "FeatureCollection",
    "features": features
}

# Save the GeoJSON output to a file
with open('fox_trajectory.geojson', 'w') as file:
    json.dump(geojson_data, file, indent=2)