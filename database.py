import mysql.connector
from flask import jsonify

class Database:
    def __init__(self):
        self.connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="spatio_temporal"
        )
        self.cursor = self.connection.cursor()

    def get_fox_data(self):
        try:
            self.cursor.execute("""
                SELECT * FROM trajectories where category_id = 1 
            """)
            columns = [desc[0] for desc in self.cursor.description]
            results = []
            for row in self.cursor.fetchall():
                results.append(dict(zip(columns, row)))
            return results
        except Exception as e:
            print(f"Database error: {e}")
            return None

    def get_hurricane_data(self):
        try:
            self.cursor.execute("""
                SELECT * FROM trajectories where category_id = 2 
            """)
            columns = [desc[0] for desc in self.cursor.description]
            results = []
            for row in self.cursor.fetchall():
                results.append(dict(zip(columns, row)))
            return results
        except Exception as e:
            print(f"Database error: {e}")
            return None

    def get_ais_data(self):
        try:
            self.cursor.execute("""
                SELECT * FROM trajectories where category_id = 3 
            """)
            columns = [desc[0] for desc in self.cursor.description]
            results = []
            for row in self.cursor.fetchall():
                results.append(dict(zip(columns, row)))
            return results
        except Exception as e:
            print(f"Database error: {e}")
            return None

    def get_football_data(self):
        try:
            self.cursor.execute("""
                SELECT * FROM trajectories where category_id = 4 
            """)
            columns = [desc[0] for desc in self.cursor.description]
            results = []
            for row in self.cursor.fetchall():
                results.append(dict(zip(columns, row)))
            return results
        except Exception as e:
            print(f"Database error: {e}")
            return None
        
    def get_scatter_plot_data(self, combination):
        try:
            self.cursor.execute("""
            SELECT * FROM decision_scores WHERE score_type = %s
        """, (combination,))
            columns = [desc[0] for desc in self.cursor.description]
            results = []
            for row in self.cursor.fetchall():
                results.append(dict(zip(columns, row)))
            return results
        except Exception as e:
            print(f"Database error: {e}")
            return None