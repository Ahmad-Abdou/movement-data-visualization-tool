import pandas as pd


df = pd.read_csv("static/data/fox_trajectories.csv")
df = df["fox_id"]

df2 = pd.read_csv("static/data/cyclone_trajectories.csv")
df2 = df2["SID"]

# df3 = pd.read_csv("static/data/combined_ship_trajectories.csv")
# df3 = df3["VesselType"]

df4 = pd.read_csv("static/data/football_trajectories.csv")
df4 = df4["id"]


print("Foxes:", len(df.unique()))
print("Cyclones:",len(df2.unique()))
# print("Ships:",len(df3.unique()))
print("Football:",len(df4.unique()))