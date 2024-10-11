# Load the RData file
load("C:\\Users\\ahmad\\OneDrive\\Desktop\\thesis\\dataset\\cyclone_trajectories.RData") # nolint

# Check if 'trajectories' is a list
object_name <- "trajectories"

if (exists(object_name)) {
  # Retrieve the object
  obj <- get(object_name)
  
  # Check if the object is a list
  if (is.list(obj)) {
    # Initialize an empty list to store data frames
    data_frames <- list()
    
    # Loop through each item in the list
    for (i in seq_along(obj)) {
      item <- obj[[i]]
      
      # Check if the item is a data frame
      if (is.data.frame(item)) {
        # Append the data frame to the list
        data_frames[[length(data_frames) + 1]] <- item
      } else {
        cat(paste("Item", i, "is not a data frame.\n"))
      }
    }
    
    # Combine all data frames into one
    combined_df <- do.call(rbind, data_frames)
    
    # Write the combined data frame to a single CSV file
write.csv(df_cyclones, "C:\\Users\\ahmad\\OneDrive\\Desktop\\thesis\\dataset\\df_cyclones_with_ID.csv", row.names = FALSE)
  } else {
    cat("The object is not a list.\n")
  }
} else {
  cat(paste("Object", object_name, "not found.\n"))
}
