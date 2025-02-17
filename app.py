from flask import Flask, jsonify, render_template, request
import pandas as pd
import numpy as np 
import os
import traceback
import feature_importance
from database import Database
from featureDetailsCalc import stats_calc
app = Flask(__name__)
db = Database()
def get_absolute_path(relative_path):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base_dir, relative_path)

@app.route('/')
def index():
   return render_template('index3.html')

@app.route('/api/trajectories', methods=['GET'])
def fetch_trajectories():
    try:
        data = db.get_fox_data()
        if data is not None:
            return jsonify(data)
        else:
            return jsonify({"error": "No data found"}), 404
    except Exception as e:
        print(f'Error: {str(e)}')
        return jsonify({"error": "Server error"}), 500

@app.route('/api/scatter', methods=['GET'])
def decision_scores():
    combination = request.args.get('combination')
    try:
        data = db.get_scatter_plot_data(combination)
        if data is not None:
            return jsonify(data)
        else:
            return jsonify({"error": "No data found"}), 404
    except Exception as e:
        print(f'Error: {str(e)}')
        return jsonify({"error": "Server error"}), 500


@app.route('/api/feats/map', methods=['GET'])
def data_map():
    tid = request.args.get('tid') 
    try:
        if not tid:
            return jsonify({"error": "No trajectory ID provided"}), 400
            
        data = db.get_data_for_map(tid)
        if data and len(data) > 0:
            return jsonify(data)
        else:
            return jsonify({"error": "No data found"}), 404
            
    except Exception as e:
        print(f'Error: {str(e)}')
        return jsonify({"error": "Server error"}), 500

@app.route('/api/feats/quantile', methods=['GET'])
def data_quantile():
    tid = request.args.get('tid') 
    stats = request.args.get('stats')
    try:
        data = db.get_data_for_quantile(tid)
        operation, get_40_rows = stats_calc(stats, data)
        if data and len(data) > 0:
            return jsonify({
        'data': data,
        'operation': operation,
        'rows': get_40_rows
    })
        else:
            return jsonify({"error": "No data found"}), 404
            
    except Exception as e:
        print(f'Error: {str(e)}')
        return jsonify({"error": "Server error"}), 500
    
# @app.route('/api/feats/quantile/stats', methods=['POST'])
# def fetchStatsForFeatureDetails():
#     try:
#         stats = request.get_json()["stats"]
#         print(trajectory_feature_details)
#         print(stats)
#         if not stats:
#             print('No data was sent BROTHEH')
#         return jsonify({
#             'status': 'success',
#             'data': {
#                 'stats' : stats
#             }
#         })
#     except:
#         print('Didnt recieve')

@app.route('/api/data', methods=['POST'])
def process_data():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'status': 'error', 'message': 'No data received'}), 400
            
        combination_path = data.get('path_combination')
        zoneA = data.get('zoneA')
        zoneB = data.get('zoneB')
        features_path = data.get('df_path_with_id')
        if not all([combination_path, features_path, zoneA, zoneB is not None]):
            return jsonify({'status': 'error', 'message': 'Missing required parameters'}), 400
        
        abs_combination_path = get_absolute_path(f'static/{combination_path}')
        abs_features_path = get_absolute_path(f'static/{features_path}')
        
        if not os.path.exists(abs_combination_path) or not os.path.exists(abs_features_path):
            return jsonify({'status': 'error', 'message': 'Data files not found'}), 404
            
        feature_importance_df, accuracy, f1_score = feature_importance.getDataTwoZonesComparison(zoneA, zoneB, abs_combination_path, abs_features_path)

        
        feature_importance_data = feature_importance_df.to_dict('records')
        
        return jsonify({
            'status': 'success',
            'data': {
                'feature_importance': feature_importance_data,
                'accuracy': float(accuracy),
                'f1_score': float(f1_score)
            }
        })
        
    except Exception as e:
        app.logger.error(f'Error processing request: {str(e)}\n{traceback.format_exc()}')
        return jsonify({
            'status': 'error',
            'message': f'Server error: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
