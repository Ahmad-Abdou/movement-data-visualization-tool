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
        case _:
            raise ValueError("Unknown stats parameter")           
    if isinstance(result, (np.float64, np.int64)):
        return result.item()
    return result
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