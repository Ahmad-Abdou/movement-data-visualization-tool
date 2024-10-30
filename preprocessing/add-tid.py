from decimal import Decimal
import pandas as pd
import numpy as np

df_raw = pd.read_csv('../raw csv/cyclone_trajectories.csv', delimiter=',')
# print(df_raw)
df_tid = pd.Series(data=df_raw['SID'].unique(), name="ID")
# print(df_tid)

df_with_feats = pd.read_csv('../raw csv/df_cyclones.csv', delimiter=',')
# print(df_with_feats)

df_with_feats.replace([np.inf, -np.inf], np.nan, inplace=True)
res = pd.concat([df_with_feats, df_tid], axis=1).dropna()

res = res.round(4)

res.to_csv('../df_with_ID/df_cyclones_with_ID.csv', index=False)
