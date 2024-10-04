# from pyproj import Proj, transform

# # Define the projection (example, you need to adjust based on actual system)
# proj_cartesian = Proj(proj='tmerc', lat_0=72.769, lon_0=-79.529)  # Example: Transverse Mercator
# proj_latlong = Proj(proj='latlong', datum='WGS84')

# # Your Cartesian coordinates
# x = 1702.75588872087
# y = -4883.99554634231

# # Convert to lat/long
# longitude, latitude = transform(proj_cartesian, proj_latlong, x, y)

# print(f"Latitude: {latitude}, Longitude: {longitude}")





import utm

# Example UTM coordinates
x = 1702.75588872087  # Easting
y = -4883.99554634231  # Northing

# Replace with the correct UTM zone and hemisphere
zone_number = 33
is_northern = True  # Set to False if it's in the Southern Hemisphere

# Convert UTM to lat/lon
lat, lon = utm.to_latlon(x, y, zone_number, is_northern)
print(f"Latitude: {lat}, Longitude: {lon}")






# import math

# # Assume x, y are in meters and (lat0, lon0) is the reference point
# x = 1702.75588872087  # Distance in meters (Easting)
# y = -4883.99554634231  # Distance in meters (Northing)
# lat0 = 64.2480
# lon0 = 84.8896

# # Convert to latitude and longitude
# lat = lat0 + (y / 111320)  # Latitude in degrees
# lon = lon0 + (x / (111320 * math.cos(math.radians(lat0))))  # Longitude in degrees

# print(f"Latitude: {lat}, Longitude: {lon}")






# import math

# # Example polar coordinate in complex form (r - θ in radians)
# r = 1702.75588872087  # Magnitude (radius)
# theta = -4883.99554634231  # Angle (in radians)

# # Convert to Cartesian
# x = r * math.cos(theta)
# y = r * math.sin(theta)

# print(f"Cartesian coordinates: x = {x}, y = {y}")
