# High-Dimensional-Unlabeled-Movement-Data-Visualization-Tool

## Instalation guidelines

We are using Python 3.11. 

### Create, activate, and download dependencies with a virtual environment using venv

```bash
# Create a virtual environment named 'hdmovementviz'
python -m venv hdmovementviz

# Activate the virtual environment on Windows
hdmovementviz\Scripts\activate

# Activate the virtual environment on macOS and Linux
source hdmovementviz/bin/activate

#Update pip
pip install --upgrade pip 

# Install requirements
pip install -r requirements.txt
```

# Run server 
```bash
python app.py
```

### Number of trajectories for each dataset

Foxes: 66 <br>
Cyclones: 11351 <br>
Ships: 59 <br>
<!-- Football: 23<br> -->