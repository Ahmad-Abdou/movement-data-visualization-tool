import pandas as pd
from geojson import LineString, Feature, FeatureCollection

fox_trajectories = pd.read_csv('C:\\Users\\ahmad\\OneDrive\\Desktop\\thesis\\High-Dimensional-Unlabeled-Movement-Data-visualization-tool\\raw csv\\fox_trajectories.csv')

fox_id = 116
fox_data = fox_trajectories[fox_trajectories['fox_id'] == fox_id]

fox_data_sorted = fox_data.sort_values(by='time')

output_file = f'fox_trajectory_{fox_id}.csv'
fox_data_sorted.to_csv(output_file, index=False)

print(f"Trajectory saved to {output_file}")