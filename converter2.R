# Load RData file and list all objects
load("ship_trajectories.Rdata")
objects <- ls()

for (obj_name in objects) {
  # Fetch each object in the list.
  obj <- get(obj_name)
  obj_class <- class(obj) # Set the class for the object.
  
  if (obj_class == "data.frame") {
    # If the object is a dataframe, can be written to csv.
    write.csv(obj, file = paste0(obj_name, ".csv"), row.names = FALSE)
    cat(paste("Data frame", obj_name, "successfully written to", paste0(obj_name, ".csv"), "\n"))

  } else if (obj_class == "list" && all(sapply(obj, is.data.frame))) {
    # If "object" is a list of dataframes we combine and write to a csv.
    combined_df <- do.call(rbind, obj)
    write.csv(combined_df, file = paste0("combined_", obj_name, ".csv"), row.names = FALSE)
    cat(paste("List of data frames", obj_name, "successfully combined and written to", paste0("combined_", obj_name, ".csv"), "\n"))
  
  } else if (obj_class == "matrix") {
    # If the object is a matrix we convert it to a dataframe and write to csv.
    df <- as.data.frame(obj)
    write.csv(df, file = paste0(obj_name, "_matrix.csv"), row.names = FALSE)
    cat(paste("Matrix", obj_name, "successfully written to", paste0(obj_name, "_matrix.csv"), "\n"))
  
  } else {  # Other types are skipped.
    cat(paste("Object", obj_name, "is of type", obj_class, "and was not converted.\n"))
  }
}