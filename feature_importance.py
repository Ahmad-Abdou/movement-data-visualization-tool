import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import f1_score, accuracy_score

def zone_logic_matcher(zone,x,y):
    '''Returns TRUE if the zone matches the x and y values, otherwise returns FALSE!'''
    matcher = {
        0: (x < 0.5 and y < 0.5),
        1: (x < 0.5 and y > 0.5 and x < (y - 0.5)),
        2: (x > 0.5 and y < (x - 0.5)),
        3: not((x < 0.5 and y < 0.5) or (x < 0.5 and y > 0.5 and x < (y - 0.5)) or (x > 0.5 and y < (x - 0.5)))
    }
    return matcher[zone]

def logic_zone_matcher(x,y):
    '''Returns the ZONE as an INTEGER for the current x and y values.'''
    matcher = {
        (x < 0.5 and y < 0.5): 0,
        (x < 0.5 and y > 0.5 and x < (y - 0.5)): 1,
        (x > 0.5 and y < (x - 0.5)): 2,
        not((x < 0.5 and y < 0.5) or (x < 0.5 and y > 0.5 and x < (y - 0.5)) or (x > 0.5 and y < (x - 0.5))): 3
    }
    for logic, zone in matcher.items():
        if logic == True:
            return zone

def getDataTwoZonesComparison(zoneA, zoneB, combination_path, features_path, x_axis, y_axis):
    '''Sets zones as zoneA as 1, and zoneB as 0, only considers the 2 zones selected, drops DF entries that do not match either.
        The RF model is then created only with df_features that were not dropped, labeled as 1 or 0.
        '''
    try:
        df_combination = pd.read_csv(combination_path)
        df_features = pd.read_csv(features_path)
        
        if y_axis.lower() == 'curvature':
            y_axis = 'angles'
        elif y_axis.lower() == 'indentation':
            y_axis = 'distance'
        
        if x_axis.lower() == 'curvature':
            x_axis = 'angles'
        elif x_axis.lower() == 'indentation':
            x_axis = 'distance'
            
        if x_axis.lower() == 'kinematic' and y_axis.lower() == 'geometric' or y_axis.lower() == 'kinematic' and x_axis.lower() == 'geometric':
            feature_cols = df_features.columns.tolist()
        else:
            feature_cols = [col for col in df_features.columns 
                          if x_axis.lower() in col.lower() 
                          or y_axis.lower() in col.lower() 
                          or col in ['ID', 'label', 'zone']]
        
        df_features = df_features[feature_cols]
        df_combination['ID'] = df_combination['ID'].astype(str)
        df_features['ID'] = df_features['ID'].astype(str)
        
        df_features["zone"] = 0
        
        for _, row in df_combination.iterrows():
            x, y = row['x'], row['y']
            row_ID = str(row['ID'])
            
            if (logic_zone_matcher(x,y) != zoneA) and (logic_zone_matcher(x,y) != zoneB):
                df_features = df_features[df_features['ID'] != row_ID]
            else:
                if zone_logic_matcher(zoneA,x,y):
                    df_features.loc[df_features['ID'] == row_ID, 'zone'] = 1
                else:
                    df_features.loc[df_features['ID'] == row_ID, 'zone'] = 0
        y = df_features["zone"].astype(int)
        X = df_features.drop(columns=["zone", "ID", "label"] if "label" in df_features.columns else ["zone", "ID"])
    
        if X.empty or len(X.columns) == 0:
            raise ValueError("No features available for training")
        
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
        
        feature_importance_df = pd.DataFrame({
            'Feature': X.columns,
            'Importance': rf_model.feature_importances_
        }).sort_values(by='Importance', ascending=False)
        return feature_importance_df, test_accuracy, f1
    except Exception as e:
        print(f"Error in getDataTwoZonesComparison: {str(e)}")
        raise