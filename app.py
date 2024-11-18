from flask import Flask, jsonify, render_template
import pandas as pd
import numpy as np 

import json

app = Flask(__name__)

#Reading data

@app.route('/')
def index():
   return render_template('index3.html') 


app.run(debug=True)