import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import f1_score, accuracy_score

def getData(zone, combination_path, features_path):
    try:
        # Read CSV files
        df_combination = pd.read_csv(combination_path)
        df_features = pd.read_csv(features_path)
        
        df_combination['ID'] = df_combination['ID'].astype(str)
        df_features['ID'] = df_features['ID'].astype(str)
        
        df_features["zone"] = 0

        for _, row in df_combination.iterrows():
            x, y = row['x'], row['y']
            row_ID = str(row['ID'])
            
            if zone == 0:
                df_features.loc[df_features['ID'] == row_ID, 'zone'] = 1 if (x < 0.5 and y < 0.5) else 0
            elif zone == 1:
                df_features.loc[df_features['ID'] == row_ID, 'zone'] = 1 if (x < 0.5 and y > 0.5 and x < (y - 0.5)) else 0
            elif zone == 2:
                df_features.loc[df_features['ID'] == row_ID, 'zone'] = 1 if (x > 0.5 and y < (x - 0.5)) else 0
            elif zone == 3:
                in_other_zones = (x < 0.5 and y < 0.5) or (x < 0.5 and y > 0.5 and x < (y - 0.5)) or (x > 0.5 and y < (x - 0.5))
                df_features.loc[df_features['ID'] == row_ID, 'zone'] = 0 if in_other_zones else 1

        y = df_features["zone"].astype(int)
        X = df_features.drop(columns=["zone", "ID", "label"] if "label" in df_features.columns else ["zone", "ID"])

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        rf_model = RandomForestClassifier(random_state=42)
        rf_model.fit(X_train, y_train)
        
        y_pred_test = rf_model.predict(X_test)
        
        test_accuracy = accuracy_score(y_test, y_pred_test)
        
        if len(set(y_test)) == 1 and len(set(y_pred_test)) == 1:
             if list(set(y_test))[0] == list(set(y_pred_test))[0]:
                 f1 = 1.0
             else:
                 f1 = 0.0
        else:
            f1 = f1_score(y_test, y_pred_test, average='binary', zero_division=0)

        print(f"Zone {zone} statistics:")
        print(f"Number of samples in zone: {sum(y == 1)}")
        print(f"Number of samples outside zone: {sum(y == 0)}")
        print(f"Test set positive samples: {sum(y_test == 1)}")
        print(f"Test set predictions: {sum(y_pred_test == 1)}")
        
        feature_importance_df = pd.DataFrame({
            'Feature': X.columns,
            'Importance': rf_model.feature_importances_
        }).sort_values(by='Importance', ascending=False)

        return feature_importance_df, test_accuracy, f1

    except Exception as e:
        print(f"Error in getData: {str(e)}")
        raise