import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import f1_score, accuracy_score


def getData(zone, combination_path, features_path):
    try:
        # Use the absolute paths directly
        df_combination = pd.read_csv(combination_path)
        df_features = pd.read_csv(features_path)
             
    except Exception as e:
        print(f"Error reading files: {str(e)}")
        raise e

    # adding zone column
    df_features["zone"] = None

    for i, row in df_combination.iterrows():
        # print(row)
        # print(row.ID)
        # row_ID = str(int(row.ID))
        row_ID = row.ID
        if zone == 0:
            if (row.x < 0.5 and row.y < 0.5):
                df_features.loc[df_features['ID'] == row_ID, 'zone'] = 1

            else:
                df_features.loc[df_features['ID'] == row_ID, 'zone'] = 0

        elif zone == 1:
            if (row.x < 0.5 and row.y > 0.5 and row.x < (row.y - 0.5)):
                df_features.loc[df_features['ID'] == row_ID, 'zone'] = 1

            else:
                df_features.loc[df_features['ID'] == row_ID, 'zone'] = 0

        elif zone == 2:
            if (row.x > 0.5 and row.y < (row.x - 0.5)):
                df_features.loc[df_features['ID'] == row_ID, 'zone'] = 1

            else:
                df_features.loc[df_features['ID'] == row_ID, 'zone'] = 0

        
        elif zone == 3:
            if (row.x < 0.5 and row.y < 0.5) or (row.x < 0.5 and row.y > 0.5 and row.x < (row.y - 0.5)) or (row.x > 0.5 and row.y < (row.x - 0.5)):
                df_features.loc[df_features['ID'] == row_ID, 'zone'] = 0

            else:
                df_features.loc[df_features['ID'] == row_ID, 'zone'] = 1
 

    y = df_features["zone"]
    y = y.astype(int)
    x = df_features.drop(columns=["zone", "label"])
    print(y, y.dtype)

    x_train_val, x_test, y_train_val, y_test = train_test_split(x, y, test_size=0.2, random_state=42)
    x_train, x_val, y_train, y_val = train_test_split(x_train_val, y_train_val, test_size=0.3, random_state=42)


    rf_model = RandomForestClassifier()
    rf_model.fit(x_train, y_train)

    y_validation_prediciton = rf_model.predict(x_val)
    print("Accuracy score:", accuracy_score(y_val, y_validation_prediciton))

    cross_val_5_fold_score = cross_val_score(rf_model, x, y, cv=5)
    print("5-Fold Cross Validation Score:", cross_val_5_fold_score)


    y_test_prediction = rf_model.predict(x_test)
    accuracy_score_res = accuracy_score(y_test, y_test_prediction)
    print("Test accuracy", accuracy_score_res)


    y_train_prediction = rf_model.predict(x_train)

    feature_importances = rf_model.feature_importances_
    print(feature_importances)



    feature_names = x.columns
    feature_importance_df = pd.DataFrame({
        'Feature': feature_names,
        'Importance': feature_importances
    })

    # Sort the features by importance
    feature_importance_df = feature_importance_df.sort_values(by='Importance', ascending=False)

    print(feature_importance_df)


    # Assuming you already have trained your model and have predictions


    # Calculate F1 scores
    f1_train = f1_score(y_train, y_train_prediction, average='binary')  # Use 'binary' if it's a binary classification problem
    f1_val = f1_score(y_val, y_validation_prediciton, average='binary')        # Similarly for validation
    f1_test = f1_score(y_test, y_test_prediction, average='binary')      # And test

    # Print F1 scores
    print(f"F1 Score (Train): {f1_train}")
    print(f"F1 Score (Validation): {f1_val}")
    print(f"F1 Score (Test): {f1_test}")

    return feature_importance_df, accuracy_score_res






# return feature_importance_df


# get_features()
# for i,row in df_features.iterrows():
#     print(row)




# print(points_in_selected_area)


# for k,v in points_in_selected_area.items():
#     count_1s = 0
#     count_0s = 0
#     for fox in v:
#         if k == "1":
#             count_1s += 1
#         else:
#             count_0s += 1
#         print(k, fox)
#     print(count_0s)
#     print("ONES:",count_1s)