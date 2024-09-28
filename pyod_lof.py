import pandas as pd
import numpy as np
from pyod.models.lof import LOF
from sklearn.preprocessing import MinMaxScaler, RobustScaler, QuantileTransformer

# 0 stands for inliers and 1 for outliers/anomalies.

df = pd.read_csv("C:\\Users\\ahmad\\OneDrive\\Desktop\\thesis\\High-Dimensional-Unlabeled-Movement-Data-visualization-tool\\df_with_ID\\df_foxes_with_ID.csv")


# df_fox_116 = df.iloc[:1]
df_geometry = df[["distance_geometry_1_1","distance_geometry_2_1","distance_geometry_2_2","distance_geometry_3_1","distance_geometry_3_2","distance_geometry_3_3","distance_geometry_4_1","distance_geometry_4_2","distance_geometry_4_3","distance_geometry_4_4","distance_geometry_5_1","distance_geometry_5_2","distance_geometry_5_3","distance_geometry_5_4","distance_geometry_5_5","angles_0s","angles_mean","angles_meanse","angles_quant_min","angles_quant_05","angles_quant_10","angles_quant_25","angles_quant_median","angles_quant_75","angles_quant_90","angles_quant_95","angles_quant_max","angles_range","angles_sd","angles_vcoef","angles_mad","angles_iqr","angles_skew","angles_kurt"]]
# print("Rows of data:\n",df_geometry)
df_kinematic = df[["speed_0s","speed_mean","speed_meanse","speed_quant_min","speed_quant_05","speed_quant_10","speed_quant_25","speed_quant_median","speed_quant_75","speed_quant_90","speed_quant_95","speed_quant_max","speed_range","speed_sd","speed_vcoef","speed_mad","speed_iqr","speed_skew","speed_kurt","acceleration_0s","acceleration_mean","acceleration_meanse","acceleration_quant_min","acceleration_quant_05","acceleration_quant_10","acceleration_quant_25","acceleration_quant_median","acceleration_quant_75","acceleration_quant_90","acceleration_quant_95","acceleration_quant_max","acceleration_range","acceleration_sd","acceleration_vcoef","acceleration_mad","acceleration_iqr","acceleration_skew","acceleration_kurt"]]



def get_foxes_rows(df):
    geometry_kinematic = []
    # i = row number,  j = the column label
    for i,j in df.iterrows():
        fox_i = []
        for value in j:  # for value in each column rows column
            fox_i.append(value)
        # print("Number of values:",len(fox_i))
        geometry_kinematic.append(fox_i)
    return geometry_kinematic

geometries = get_foxes_rows(df_geometry)
kinematics = get_foxes_rows(df_kinematic)



print("GEOMETRIC Number of foxes trajectories:",len(geometries))
# print(geometries)

print("KINEMATIC Number of foxes trajectories:",len(kinematics))
# print(kinematics)



print("GEOMETRIC")
clf = LOF()
clf.fit(geometries)
clf_labels = clf.labels_
# print(clf_labels)
decision_scores = clf.decision_scores_
# print(decision_scores)


print("KINEMATIC")
clf_kinematic = LOF()
clf_kinematic.fit(kinematics)
clf_kinematic_labels = clf_kinematic.labels_
# print(clf_kinematic_labels)
decision_scores_kinematic = clf_kinematic.decision_scores_
# print(decision_scores_kinematic)


# Initialize MinMaxScaler to scale data between 0 and 1
minmax_scaler = MinMaxScaler()


# Log scores performes also well, but not between zero and one.
# log_scores = np.log1p(decision_scores)
# scaled_scores = minmax_scaler.fit_transform(log_scores.reshape(-1, 1))
# print("Scaled decision scores (LOG SCORES):", scaled_scores.flatten())

# RobustScaler (not such good performance)
# robust_scaler = RobustScaler()
# robust_scaled_scores = robust_scaler.fit_transform(decision_scores.reshape(-1, 1))
# print("Scaled decision scores (0-1 range):", robust_scaled_scores.flatten())


# Initialize the QuantileTransformer with uniform output (you can also set output_distribution='normal')
quantile_transformer = QuantileTransformer(output_distribution='uniform', random_state=0)
# Apply the transformer to the decision_scores_
geometric_quantile_scaled_scores = quantile_transformer.fit_transform(decision_scores.reshape(-1, 1))
print("Quantile-transformed GEOMETRIC:", geometric_quantile_scaled_scores.flatten())
print("LENGHT:",len(geometric_quantile_scaled_scores))

kinematic_quantile_scaled_scores = quantile_transformer.fit_transform(decision_scores_kinematic.reshape(-1, 1))
print("Quantile-transformed KINEMATIC:", kinematic_quantile_scaled_scores.flatten())
print("LENGHT:",len(kinematic_quantile_scaled_scores))

flattend_kinematic = kinematic_quantile_scaled_scores.flatten()
flattened_geometric = geometric_quantile_scaled_scores.flatten()

print(flattend_kinematic)

result = np.array([kinematic_quantile_scaled_scores.flatten(), geometric_quantile_scaled_scores.flatten()])


# Save to CSV with a specified float format
np.savetxt('result.csv', result.reshape(-1, 2), delimiter=',', fmt='%.8f')
# np.savetxt('result2.csv', flattend_kinematic)
# import matplotlib.pyplot as plt

# plt.hist(decision_scores, bins=20)
# plt.title("Histogram of Decision Scores")
# plt.xlabel("Decision Score")
# plt.ylabel("Frequency")
# plt.show()




