from scipy.stats import skew, kurtosis
import numpy as np
import pandas as pd

def stats_calc(stats, data):
    feature_name = stats.split('_')[0]
    if feature_name == "angles":
        feature_name = "angle"
    splitted = stats.split('_', 1)[1:]
    operation = "_".join(splitted)

    numeric_data = [d[feature_name] for d in data]
    sorted_num = sorted(numeric_data)
    match operation:
        case 'quant_05':
            result = np.percentile(sorted_num, 5)
        case 'quant_10':
            result = np.percentile(sorted_num, 10)
        case 'quant_25':
            result = np.percentile(sorted_num, 25)
        case 'quant_75':
            result = np.percentile(sorted_num, 75)
        case 'quant_90':
            result = np.percentile(sorted_num, 90)
        case 'quant_95':
            result = np.percentile(sorted_num, 95)
        case 'quant_min':
            result = np.min(sorted_num)
        case 'quant_max':
            result = np.max(sorted_num)
        case 'sd':
            result = np.std(sorted_num)
        case '0s':
            result = np.sum(sorted_num)  
        case 'mean':
            result = np.mean(sorted_num)  
        case 'meanse':
            result = np.std(sorted_num) / np.sqrt(len(sorted_num))
        case 'mad':
            result = np.median(np.abs(sorted_num - np.median(sorted_num)))
        case 'kurt':
            result = kurtosis(sorted_num)
        case 'vcoef':
            result = np.std(sorted_num) / np.mean(sorted_num) if np.mean(sorted_num) != 0 else np.nan
        case 'skew':
            result = skew(sorted_num)
        case 'range':
            result = np.ptp(sorted_num)
        case 'quant_median':
            result = np.median(sorted_num) 
        case 'iqr':
            result = np.percentile(sorted_num, 75) - np.percentile(sorted_num, 25)
        case 'geometry_1_1':
            result = (0,0)
        case 'geometry_2_1':
            result = (0,0)
        case 'geometry_2_2':
            result = (0,0)
        case 'geometry_3_1':
            result = (0,0)
        case 'geometry_3_2':
            result = (0,0)
        case 'geometry_3_3':
            result = (0,0)
        case 'geometry_4_1':
            result = (0,0)
        case 'geometry_4_2':
            result = (0,0)
        case 'geometry_4_3':
            result = (0,0)
        case 'geometry_4_4':
            result = (0,0)
        case 'geometry_5_1':
            result = (0,0)
        case 'geometry_5_2':
            result = (0,0)
        case 'geometry_5_3':
            result = (0,0)
        case 'geometry_5_4':
            result = (0,0)
        case 'geometry_5_5':
            result = (0,0)
        case _:
            raise ValueError("Unknown stats parameter")           
    if isinstance(result, (np.float64, np.int64)):
        nearest_index_row = find_nearest(numeric_data, result, data)
        get_40_rows = find_40_closest(nearest_index_row, data)
        return result.item(), get_40_rows

    return result

def find_nearest(array, value, data):
    array = np.asarray(array)
    idx = (np.abs(array - value)).argmin()
    return idx

def find_40_closest(index, data):
    # min_index = 0
    # max_index = len(data) - 1
    # if index - 20 >= 0:
    #     min_index = index - 20
    # if max_index <= (len(data) - 1) + 20:
    #     max_index = index 
    min_index = index - 10
    max_index = index + 11
    return data[min_index:max_index]