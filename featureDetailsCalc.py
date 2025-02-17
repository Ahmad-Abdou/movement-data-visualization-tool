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
            result = 0
        case 'geometry_2_1':
            result = 0
        case 'geometry_2_2':
            result = 0
        case 'geometry_3_1':
            result = 0
        case 'geometry_3_2':
            result = 0
        case 'geometry_3_3':
            result = 0
        case 'geometry_4_1':
            result = 0
        case 'geometry_4_2':
            result = 0
        case 'geometry_4_3':
            result = 0
        case 'geometry_4_4':
            result = 0
        case 'geometry_5_1':
            result = 0
        case 'geometry_5_2':
            result = 0
        case 'geometry_5_3':
            result = 0
        case 'geometry_5_4':
            result = 0
        case 'geometry_5_5':
            result = 0
        case _:
            raise ValueError("Unknown stats parameter")           
    if isinstance(result, (np.float64, np.int64)):
        nearest_index_row = find_nearest(numeric_data, result, data)
        get_40_rows = find_40_closest(nearest_index_row, data)
        return result.item(), get_40_rows

    # return result

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
# def calc_0s(data):
#     return np.sum(data)

# def calc_mean(data):
#     return np.mean(data)

# def calc_meanse(data):
#     return np.std(data) / np.sqrt(len(data))

# def calc_quant_min(data):
#     return np.min(data)

# def calc_quant_05(data):
#     return np.percentile(data, 5)

# def calc_quant_10(data):
#     return np.percentile(data, 10)

# def calc_quant_25(data):
#     return np.percentile(data, 25)

# def calc_quant_median(data):
#     return np.median(data)

# def calc_quant_75(data):
#     return np.percentile(data, 75)

# def calc_quant_90(data):
#     return np.percentile(data, 90)

# def calc_quant_95(data):
#     return np.percentile(data, 95)

# def calc_quant_max(data):
#     return np.max(data)

# def calc_range(data):
#     return np.ptp(data)

# def calc_sd(data):
#     return np.std(data)

# def calc_vcoef(data):
#     mean_val = np.mean(data)
#     return np.std(data) / mean_val if mean_val != 0 else np.nan

# def calc_mad(data):
#     return np.median(np.abs(data - np.median(data)))

# def calc_iqr(data):
#     return np.percentile(data, 75) - np.percentile(data, 25)

# def calc_skew(data):
#     return skew(data)

# def calc_kurt(data):
#     return kurtosis(data)


# f"{prefix}_0s": np.sum(data == 0),
# f"{prefix}_mean": np.mean(data),
# f"{prefix}_meanse": np.std(data) / np.sqrt(len(data)),
# f"{prefix}_quant_min": np.min(data),
# f"{prefix}_quant_05": np.percentile(data, 5),
# f"{prefix}_quant_10": np.percentile(data, 10),
# f"{prefix}_quant_25": np.percentile(data, 25),
# f"{prefix}_quant_median": np.median(data),
# f"{prefix}_quant_75": np.percentile(data, 75),
# f"{prefix}_quant_90": np.percentile(data, 90),
# f"{prefix}_quant_95": np.percentile(data, 95),
# f"{prefix}_quant_max": np.max(data),
# f"{prefix}_range": np.ptp(data),
# f"{prefix}_sd": np.std(data),
# f"{prefix}_vcoef": np.std(data) / np.mean(data) if np.mean(data) != 0 else np.nan,
# f"{prefix}_mad": np.median(np.abs(data - np.median(data))),
# f"{prefix}_iqr": np.percentile(data, 75) - np.percentile(data, 25),
# f"{prefix}_skew": skew(data),
# f"{prefix}_kurt": kurtosis(data),

# mean = calc_mean(data['speed'])
# mean = calc_0s(data['speed'])
# mean = calc_iqr(data['speed'])
# mean = calc_kurt(data['speed'])
# mean = calc_meanse(data['speed'])
# mean = calc_mad(data['speed'])
# mean = calc_quant_05(data['speed'])
# mean = calc_quant_10(data['speed'])
# mean = calc_quant_25(data['speed'])
# mean = calc_quant_75(data['speed'])
# mean = calc_quant_90(data['speed'])
# mean = calc_quant_max(data['speed'])
# mean = calc_quant_median(data['speed'])
# mean = calc_quant_min(data['speed'])
# mean = calc_range(data['speed'])
# mean = calc_sd(data['speed'])
# mean = calc_skew(data['speed'])
# mean = calc_vcoef(data['speed'])
# print(mean)