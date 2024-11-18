import numpy as np
from scipy.spatial.distance import pdist, squareform
from sklearn.preprocessing import MinMaxScaler

def DBOS(dataset, d=1, fraction=0.05):
    # Convert to numpy array if not already
    if not isinstance(dataset, np.ndarray):
        dataset = np.array(dataset)
    
    # Validate inputs
    if not np.issubdtype(dataset.dtype, np.number):
        raise ValueError('Dataset input is not numeric')
    if not isinstance(d, (int, float)) or not isinstance(fraction, (int, float)):
        raise ValueError('All inputs (d, fraction) must be numeric')

    # Number of observations
    n = dataset.shape[0]
    
    # Compute distance matrix
    dist_matrix = squareform(pdist(dataset))
    
    # For each observation, count neighbors within radius d
    neighborhood = np.sum(dist_matrix < d, axis=1) - 1  # Exclude self in count
    
    # Determine threshold based on fraction
    threshold = n * fraction
    
    # Classify each observation
    classification = np.where(neighborhood < threshold, 'Outlier', 'Inlier')
    
    # Invert neighborhood counts for outlier scoring (higher frequency -> closer to 0, lower -> closer to 1)
    inverted_neighborhood = max(neighborhood) - neighborhood

    # Compute outlier score
    scaler = MinMaxScaler()
    # scaler = StandardScaler()
    outlier_scores = scaler.fit_transform(inverted_neighborhood.reshape(-1, 1))

    # Return results
    return {'neighbors': neighborhood,
            'scores': outlier_scores,  
            'classification': classification}

def find_average_distance(dataset):
    # Convert to numpy array if not already
    if not isinstance(dataset, np.ndarray):
        dataset = np.array(dataset)
    
    # Validate input is numeric
    if not np.issubdtype(dataset.dtype, np.number):
        raise ValueError('Dataset input is not numeric')

    # Compute pairwise distances and calculate their mean
    pairwise_distances = pdist(dataset)
    average_distance = np.mean(pairwise_distances)
    
    return average_distance

# # Usage example:
# dataset = np.random.rand(10, 2)  
# average_d = find_average_distance(dataset)
# print(dataset)
# result = DBOS(dataset, d=average_d, fraction=0.05)
# print(result)
