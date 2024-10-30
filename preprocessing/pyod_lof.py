import pandas as pd
from pyod.models.lof import LOF
from sklearn.preprocessing import QuantileTransformer


file_output_name = "decision_scores_output_file.csv"

# Relvative path to datasets with ID values.
# df = pd.read_csv("df_with_ID/df_foxes_with_ID.csv")

# Ahmad's special path (needs to be changed also at the end)
df = pd.read_csv("C:\\Users\\ahmad\\OneDrive\\Desktop\\thesis\\High-Dimensional-Unlabeled-Movement-Data-visualization-tool\\df_with_ID\\df_foxes_with_ID.csv")

# Geometry columns
df_geometry = df[["distance_geometry_1_1","distance_geometry_2_1","distance_geometry_2_2","distance_geometry_3_1","distance_geometry_3_2","distance_geometry_3_3","distance_geometry_4_1","distance_geometry_4_2","distance_geometry_4_3","distance_geometry_4_4","distance_geometry_5_1","distance_geometry_5_2","distance_geometry_5_3","distance_geometry_5_4","distance_geometry_5_5","angles_0s","angles_mean","angles_meanse","angles_quant_min","angles_quant_05","angles_quant_10","angles_quant_25","angles_quant_median","angles_quant_75","angles_quant_90","angles_quant_95","angles_quant_max","angles_range","angles_sd","angles_vcoef","angles_mad","angles_iqr","angles_skew","angles_kurt"]]
# Kinematic columns
df_kinematic = df[["speed_0s","speed_mean","speed_meanse","speed_quant_min","speed_quant_05","speed_quant_10","speed_quant_25","speed_quant_median","speed_quant_75","speed_quant_90","speed_quant_95","speed_quant_max","speed_range","speed_sd","speed_vcoef","speed_mad","speed_iqr","speed_skew","speed_kurt","acceleration_0s","acceleration_mean","acceleration_meanse","acceleration_quant_min","acceleration_quant_05","acceleration_quant_10","acceleration_quant_25","acceleration_quant_median","acceleration_quant_75","acceleration_quant_90","acceleration_quant_95","acceleration_quant_max","acceleration_range","acceleration_sd","acceleration_vcoef","acceleration_mad","acceleration_iqr","acceleration_skew","acceleration_kurt"]]
# IDs as dataframe for final stacking into CSV.
df_ID = df["ID"]

# Optimized solution with .tolist() in O(1), instead of nested for-loops O(n^2)
geometries = df_geometry.values.tolist()
kinematics = df_kinematic.values.tolist()


print("GEOMETRIC")
clf = LOF()
clf.fit(geometries)
clf_labels = clf.labels_ # 0 stands for inliers and 1 for outliers/anomalies.
decision_scores = clf.decision_scores_
# print(clf_labels)
# print(decision_scores)

print("KINEMATIC")
clf_kinematic = LOF()
clf_kinematic.fit(kinematics)
clf_kinematic_labels = clf_kinematic.labels_
decision_scores_kinematic = clf_kinematic.decision_scores_

# We could set output_distribution='normal'
quantile_transformer = QuantileTransformer(output_distribution='uniform', random_state=0)
# Apply the transformer to the decision_scores_
geometric_quantile_scaled_scores = quantile_transformer.fit_transform(decision_scores.reshape(-1, 1))
kinematic_quantile_scaled_scores = quantile_transformer.fit_transform(decision_scores_kinematic.reshape(-1, 1))
# Flattening data.
flattend_kinematic = kinematic_quantile_scaled_scores.flatten()
flattened_geometric = geometric_quantile_scaled_scores.flatten()

result_df = pd.DataFrame({
    'x': flattend_kinematic,
    'y': flattened_geometric,
    'ID': df_ID
})

# Save the result to a CSV file (NORMAL PATH)
# result_df.to_csv('static/data/' + file_output_name, index=False, float_format='%.8f')

# Ahmad's special path
result_df.to_csv('High-Dimensional-Unlabeled-Movement-Data-visualization-tool/static/data/' + file_output_name, index=False, float_format='%.8f')
