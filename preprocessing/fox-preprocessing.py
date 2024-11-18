import pandas as pd
from pyod.models.lof import LOF
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import StandardScaler
from pyod.models.ecod import ECOD
from pyod.models.hbos import HBOS
# from pyod.models.dif import DIF
from pyod.models.iforest import IForest
from pyod.models.loda import LODA
from pyod.models.sampling import Sampling
from pyod.models.kde import KDE
from pyod.models.knn import KNN
from DBOS import DBOS, find_average_distance

df = pd.read_csv("../df_with_ID/df_foxes_with_ID.csv")
df_ID = df["ID"]
df = df.drop(['label', 'ID'], axis=1)

# Geometry columns
df_geometry = df[["distance_geometry_1_1","distance_geometry_2_1","distance_geometry_2_2","distance_geometry_3_1","distance_geometry_3_2","distance_geometry_3_3","distance_geometry_4_1","distance_geometry_4_2","distance_geometry_4_3","distance_geometry_4_4","distance_geometry_5_1","distance_geometry_5_2","distance_geometry_5_3","distance_geometry_5_4","distance_geometry_5_5","angles_0s","angles_mean","angles_meanse","angles_quant_min","angles_quant_05","angles_quant_10","angles_quant_25","angles_quant_median","angles_quant_75","angles_quant_90","angles_quant_95","angles_quant_max","angles_range","angles_sd","angles_vcoef","angles_mad","angles_iqr","angles_skew","angles_kurt"]]
df_curvature = df[["distance_geometry_1_1","distance_geometry_2_1","distance_geometry_2_2","distance_geometry_3_1","distance_geometry_3_2","distance_geometry_3_3","distance_geometry_4_1","distance_geometry_4_2","distance_geometry_4_3","distance_geometry_4_4","distance_geometry_5_1","distance_geometry_5_2","distance_geometry_5_3","distance_geometry_5_4","distance_geometry_5_5"]]
df_indentation = df[["angles_0s","angles_mean","angles_meanse","angles_quant_min","angles_quant_05","angles_quant_10","angles_quant_25","angles_quant_median","angles_quant_75","angles_quant_90","angles_quant_95","angles_quant_max","angles_range","angles_sd","angles_vcoef","angles_mad","angles_iqr","angles_skew","angles_kurt"]]

# Kinematic columns
df_kinematic = df[["speed_0s","speed_mean","speed_meanse","speed_quant_min","speed_quant_05","speed_quant_10","speed_quant_25","speed_quant_median","speed_quant_75","speed_quant_90","speed_quant_95","speed_quant_max","speed_range","speed_sd","speed_vcoef","speed_mad","speed_iqr","speed_skew","speed_kurt","acceleration_0s","acceleration_mean","acceleration_meanse","acceleration_quant_min","acceleration_quant_05","acceleration_quant_10","acceleration_quant_25","acceleration_quant_median","acceleration_quant_75","acceleration_quant_90","acceleration_quant_95","acceleration_quant_max","acceleration_range","acceleration_sd","acceleration_vcoef","acceleration_mad","acceleration_iqr","acceleration_skew","acceleration_kurt"]]
df_speed = df[["speed_0s","speed_mean","speed_meanse","speed_quant_min","speed_quant_05","speed_quant_10","speed_quant_25","speed_quant_median","speed_quant_75","speed_quant_90","speed_quant_95","speed_quant_max","speed_range","speed_sd","speed_vcoef","speed_mad","speed_iqr","speed_skew","speed_kurt"]]
df_acceleration = df[["acceleration_0s","acceleration_mean","acceleration_meanse","acceleration_quant_min","acceleration_quant_05","acceleration_quant_10","acceleration_quant_25","acceleration_quant_median","acceleration_quant_75","acceleration_quant_90","acceleration_quant_95","acceleration_quant_max","acceleration_range","acceleration_sd","acceleration_vcoef","acceleration_mad","acceleration_iqr","acceleration_skew","acceleration_kurt"]]

column_names = ['geometric', 'kinematic', 'curvature', 'indentation', 'speed', 'acceleration']
dfs = [df_geometry, df_kinematic, df_curvature, df_indentation, df_speed, df_acceleration]
df_scores = []
df_scores.append(pd.DataFrame({'tid': df_ID.to_numpy()}))
for d, name in zip(dfs, column_names):
    data = d.to_numpy()
    # Step 2: Apply ECOD to detect outliers    
    scaler = MinMaxScaler()
    # scaler = StandardScaler()
    scaled_data = scaler.fit_transform(data)
    avg_d = find_average_distance(scaled_data)
    outlier = DBOS(scaled_data, d=avg_d, fraction=0.05)
    print(outlier['scores'])
    scores = outlier['scores'].ravel()

    # Building Model
    # outlier = ECOD(contamination=.3)
    # outlier = HBOS(contamination=.2)
    # outlier = ECOD(contamination=.5)
    # outlier = HBOS()
    # outlier = DIF()
    # outlier = IForest(n_estimators=10)
    # outlier = LODA()
    # outlier = Sampling(subset_size=3, metric='euclidean', random_state=1415)
    # outlier = KDE()
    # outlier = KNN(n_neighbors=5, metric='euclidean')
    # outlier.fit(data) 
    
    # print(outlier.decision_scores_)
    ################## OLD #
    # scaler = MinMaxScaler()
    # s = outlier.decision_scores_.reshape(-1, 1)   
    # scores = scaler.fit_transform(s)
    # scores = scores[:, 0]    
    # df_scores.append(pd.DataFrame({name: scores}))
    ###################
    # scores = outlier.predict_proba(data, method='linear', return_confidence=False)
    # scores = scores[:, 1]    
    # Append scores as DataFrame with the respective column name 

    df_scores.append(pd.DataFrame({name: scores}))
    ###################

# Concatenate all score DataFrames horizontally into one final DataFrame
final_df_scores = pd.concat(df_scores, axis=1).round(4)
print(final_df_scores)
final_df_scores.to_csv('../processed-datasets/fox-outliers.csv', index=False)


