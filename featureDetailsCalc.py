from scipy.stats import skew, kurtosis
import numpy as np
import pandas as pd

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
            case 'geometry_1_1':
                res = (0,0)
            case 'geometry_2_1':
                res = (0,0)
            case 'geometry_2_2':
                res = (0,0)
            case 'geometry_3_1':
                res = (0,0)
            case 'geometry_3_2':
                res = (0,0)
            case 'geometry_3_3':
                res = (0,0)
            case 'geometry_4_1':
                res = (0,0)
            case 'geometry_4_2':
                res = (0,0)
            case 'geometry_4_3':
                res = (0,0)
            case 'geometry_4_4':
                res = (0,0)
            case 'geometry_5_1':
                res = (0,0)
            case 'geometry_5_2':
                res = (0,0)
            case 'geometry_5_3':
                res = (0,0)
            case 'geometry_5_4':
                res = (0,0)
            case 'geometry_5_5':
                res = (0,0)
            case _:
                raise ValueError("Unknown stats parameter")           
        trajectory_data = [item for item in data if item['tid'] == tid]
        
        nearest_index = find_nearest(numeric_data, res)
        
        closest_rows = find_40_closest(nearest_index, trajectory_data)
        results.append({'tid': tid, 'rows': closest_rows, 'operation': res, 'selected_row': trajectory_data[nearest_index]})
    return results

def find_nearest(array, value):
    array = np.asarray(array)
    idx = (np.abs(array - value)).argmin()
    return idx

def find_40_closest(index, data):
    min_index = max(index - 5, 0)
    max_index = min(index + 6, len(data))
    return data[min_index:max_index]