from scipy.stats import skew, kurtosis
import numpy as np
import pandas as pd
from geopy.distance import geodesic

def stats_calc(stats, data):
    feature_name = stats.split('_')[0]
    if feature_name == "angles":
        feature_name = "angle"
    splitted = stats.split('_', 1)[1:]
    operation = "_".join(splitted)

    df = pd.DataFrame(data)
    grouped_by_feature = df.groupby('tid', sort=False)[feature_name].apply(list).reset_index()

    results = []
    for _, row in grouped_by_feature.iterrows():
        tid = row['tid']
        numeric_data = row[feature_name]
        sorted_num = sorted(numeric_data)
        match operation:
            case 'quant_05':
                res = np.percentile(sorted_num, 5)
            case 'quant_10':
                res = np.percentile(sorted_num, 10)
            case 'quant_25':
                res = np.percentile(sorted_num, 25)
            case 'quant_75':
                res = np.percentile(sorted_num, 75)
            case 'quant_90':
                res = np.percentile(sorted_num, 90)
            case 'quant_95':
                res = np.percentile(sorted_num, 95)
            case 'quant_min':
                res = np.min(sorted_num)
            case 'quant_max':
                res = np.max(sorted_num)
            case 'sd':
                res = np.std(sorted_num)
            case '0s':
                res = np.sum(sorted_num)  
            case 'mean':
                res = np.mean(sorted_num)  
            case 'meanse':
                res = np.std(sorted_num) / np.sqrt(len(sorted_num))
            case 'mad':
                res = np.median(np.abs(sorted_num - np.median(sorted_num)))
            case 'kurt':
                res = kurtosis(sorted_num)
            case 'vcoef':
                res = np.std(sorted_num) / np.mean(sorted_num) if np.mean(sorted_num) != 0 else np.nan
            case 'skew':
                res = skew(sorted_num)
            case 'range':
                res = np.ptp(sorted_num)
            case 'quant_median':
                res = np.median(sorted_num) 
            case 'iqr':
                res = np.percentile(sorted_num, 75) - np.percentile(sorted_num, 25)
            case 'geometry_1_1' | 'geometry_2_1' | 'geometry_2_2' | 'geometry_3_1' | 'geometry_3_2' | 'geometry_3_3' | 'geometry_4_1' | 'geometry_4_2' | 'geometry_4_3' | 'geometry_4_4' | 'geometry_5_1' | 'geometry_5_2' | 'geometry_5_3' | 'geometry_5_4' | 'geometry_5_5':
                # Parse level and segment number from operation string
                parts = operation.split('_')
                level = int(parts[1])
                segment = int(parts[2])
                
                # Get trajectory data for current trajectory ID
                trajectory_data = [item for item in data if item['tid'] == tid]
                trajectory_data.sort(key=lambda x: x['time'])  # Sort by time
                
                # Calculate the segment size based on level
                segment_size = len(trajectory_data) // level
                
                # Calculate start and end indices for this segment
                start = (segment - 1) * segment_size
                end = segment * segment_size if segment * segment_size < len(trajectory_data) else len(trajectory_data) - 1
                
                # Calculate direct distance between start and end points
                start_point = (trajectory_data[start]['lat'], trajectory_data[start]['lon'])
                end_point = (trajectory_data[end]['lat'], trajectory_data[end]['lon'])
                direct_distance = geodesic(start_point, end_point).meters
                
                # Calculate sum of segment-wise distances
                segment_distances = []
                for i in range(start, end):
                    if i + 1 < len(trajectory_data):
                        p1 = (trajectory_data[i]['lat'], trajectory_data[i]['lon'])
                        p2 = (trajectory_data[i+1]['lat'], trajectory_data[i+1]['lon'])
                        segment_distances.append(geodesic(p1, p2).meters)
                res = direct_distance
        trajectory_data = [item for item in data if item['tid'] == tid]
        nearest_index = find_nearest(numeric_data, res)
        closest_rows = find_40_closest(nearest_index, trajectory_data)
        results.append({'tid': tid, 'rows': closest_rows, 'operation': res, 'selected_row': trajectory_data[nearest_index], 'entier_trajectory': data})
    return results

def find_nearest(array, value):
    array = np.asarray(array)
    idx = (np.abs(array - value)).argmin()
    return idx

def find_40_closest(index, data):
    total = len(data)
    window = 10
    if total <= window:
        return data

    min_index = max(index - window // 2, 0)
    max_index = min(min_index + window, total)

    if max_index - min_index < window:
        min_index = max(max_index - window, 0)
    return data[min_index:max_index]