# Load the RData file
load("static/data/df_football.Rdata")

# List all objects in the environment after loading
objects <- ls()

# Print out each object's name and contents
for (obj_name in objects) {
  # Print the object's name
  cat("Object name:", obj_name, "\n")
  
  # Retrieve the object by its name
  obj <- get(obj_name)
  
  # Print the contents of the object
  print(obj)
  
  # Print a separator line for clarity
  cat("----------------------------------------------------\n")
}
