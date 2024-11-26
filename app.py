from flask import Flask, jsonify, render_template, request
import pandas as pd
import numpy as np 

app = Flask(__name__)

@app.route('/')
def index():
   return render_template('index3.html')

@app.route('/api/data', methods=['POST'])
def process_data():
    data = request.get_json()
    selected_combination = data.get('combination')[3:]
    selected_zone = data.get('zone')

    try:
        df = pd.read_csv(selected_combination)
        return jsonify({
            'status': 'success',
            'message': f'Received combination: {selected_combination}, zone: {selected_zone}'
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)