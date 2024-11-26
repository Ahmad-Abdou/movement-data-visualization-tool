from flask import Flask, jsonify, render_template, request
import pandas as pd
import numpy as np 
import os
import traceback
import feature_importance

app = Flask(__name__)

# Add this helper function at the top
def get_absolute_path(relative_path):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base_dir, relative_path)

@app.route('/')
def index():
   return render_template('index3.html')

@app.route('/api/data', methods=['POST'])
def process_data():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'status': 'error', 'message': 'No data received'}), 400
            
        combination_path = data.get('path_combination')
        zone = data.get('zone')
        features_path = data.get('df_path_with_id')
        
        # Clean up paths
        combination_path = combination_path.replace('../static/', '').strip('/')
        features_path = features_path.replace('../static/', '').strip('/')
        
        # Convert to absolute paths
        abs_combination_path = get_absolute_path(f'static/{combination_path}')
        abs_features_path = get_absolute_path(f'static/{features_path}')
        
        # Verify files exist
        if not os.path.exists(abs_combination_path):
            return jsonify({
                'status': 'error',
                'message': f'Combination file not found: {combination_path}'
            }), 404
            
        if not os.path.exists(abs_features_path):
            return jsonify({
                'status': 'error',
                'message': f'Features file not found: {features_path}'
            }), 404
            
        feature_importance_df, accuracy = feature_importance.getData(zone, abs_combination_path, abs_features_path)
        
        return jsonify({
            'status': 'success',
            'message': 'Data processed successfully',
            'data': {
                'combination': combination_path,
                'zone': zone,
                'df-file': features_path,
                'accuracy': accuracy
            }
        })
        
    except Exception as e:
        app.logger.error(f'Error processing request: {str(e)}\n{traceback.format_exc()}')
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)