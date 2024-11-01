import pandas as pd

df = pd.read_csv('../processed-datasets/fox-outliers.csv')
# df = pd.read_csv('../processed-datasets/cyclone-outliers.csv')

print(df)
#Geom X Kin
df_g_k = df[["kinematic", "geometric", "tid"]]
df_g_k = df_g_k.rename(columns={"kinematic": "x", "geometric": "y", "tid": "ID"})
# print(df_g_k)
df_g_k.to_csv('../processed-datasets/Xkinematic_Ygeometric_decision_scores.csv', index=False)

column_names = [ 'curvature', 'indentation', 'speed', 'acceleration']

#Curvature X Indentation
df_i_c = df[["indentation", "curvature", "tid"]]
df_i_c = df_i_c.rename(columns={"indentation": "x", "curvature": "y", "tid": "ID"})
# print(df_g_k)
df_i_c.to_csv('../processed-datasets/Xindentation_Ycurvature_decision_scores.csv', index=False)

# Speed X Acc
df_s_a = df[["speed", "acceleration", "tid"]]
df_s_a = df_s_a.rename(columns={"speed": "x", "acceleration": "y", "tid": "ID"})
# print(df_g_k)
df_s_a.to_csv('../processed-datasets/Xspeed_Yacceleration_decision_scores.csv', index=False)

# Indentation X Speed
df_i_s = df[["indentation", "speed", "tid"]]
df_i_s = df_i_s.rename(columns={"indentation": "x", "speed": "y", "tid": "ID"})
# print(df_g_k)
df_i_s.to_csv('../processed-datasets/Xindentation_Yspeed_decision_scores.csv', index=False)

# Indentation X Acceleration
df_i_a = df[["indentation", "acceleration", "tid"]]
df_i_a = df_i_a.rename(columns={"indentation": "x", "acceleration": "y", "tid": "ID"})
# print(df_g_k)
df_i_a.to_csv('../processed-datasets/Xindentation_Yacceleration_decision_scores.csv', index=False)

# Curvature X Acceleration
df_c_a = df[["curvature", "acceleration", "tid"]]
df_c_a = df_c_a.rename(columns={"curvature": "x", "acceleration": "y", "tid": "ID"})
# print(df_g_k)
df_c_a.to_csv('../processed-datasets/Xcurvature_Yacceleration_decision_scores.csv', index=False)

# Curvature X Speed
df_c_a = df[["curvature", "speed", "tid"]]
df_c_a = df_c_a.rename(columns={"curvature": "x", "speed": "y", "tid": "ID"})
# print(df_g_k)
df_c_a.to_csv('../processed-datasets/Xcurvature_Yspeed_decision_scores.csv', index=False)

