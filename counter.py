# import pandas as pd


# df = pd.read_csv("C:/Users/ahmad/OneDrive/Desktop/thesis/High-Dimensional-Unlabeled-Movement-Data-visualization-tool/raw csv/fox_trajectories.csv")
# df = df["fox_id"]

# df2 = pd.read_csv("C:/Users/ahmad/OneDrive/Desktop/thesis/High-Dimensional-Unlabeled-Movement-Data-visualization-tool/raw csv/cyclone_trajectories.csv")
# df2 = df2["SID"]

# df3 = pd.read_csv("C:/Users/ahmad/OneDrive/Desktop/thesis/High-Dimensional-Unlabeled-Movement-Data-visualization-tool/raw csv/ship_trajectories.csv")
# df3 = df3["VesselType"]

# df4 = pd.read_csv("C:/Users/ahmad/OneDrive/Desktop/thesis/High-Dimensional-Unlabeled-Movement-Data-visualization-tool/raw csv/football_trajectories.csv")
# df4 = df4["id"]


# print("Foxes:", len(df.unique()))
# print("Cyclones:",len(df2.unique()))
# print("Ships:",len(df3.unique()))
# print("Football:",len(df4.unique()))

# Foxes: 66
# Cyclones: 11351
# Ships: 59
# Football: 23



# import math
# # Define the radius of the Earth
# R = 6371  # in kilometers
# # Function to convert (x, y) back to (lat, lon)
# def xy_to_latlon(x, y):
#     # Calculate longitude (lon) in radians and convert to degrees
#     lon = math.degrees(math.atan2(y, x))
#     # Calculate cos(lat) using the formula for x
#     cos_lat = x / (R * math.cos(math.radians(lon)))
#     # Calculate latitude (lat) in radians and convert to degrees
#     lat = math.degrees(math.acos(cos_lat))
#     return lat, lon



# print(xy_to_latlon(756.14070578077,296.824863884734))

