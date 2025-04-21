import mysql.connector
from flask import jsonify

class Database:
    def __init__(self):
        self.connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="spatio_temporal",
            ssl_disabled =  True
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
        sec_combination = combination.split("_")
        xAxis = sec_combination[1]
        yAxis = sec_combination[0]
        joined = "x"+xAxis + "_y" +yAxis

        xAxis2 = sec_combination[0]
        yAxis2 = sec_combination[1]
        joined2= "x"+xAxis2 + "_y" +yAxis2
        try:
            self.cursor.execute("""
            SELECT * FROM decision_scores WHERE score_type IN (%s, %s)
        """, (joined, joined2))
            columns = [desc[0] for desc in self.cursor.description]
            results = []
            for row in self.cursor.fetchall():
                results.append(dict(zip(columns, row)))
            return results
        except Exception as e:
            print(f"Database error: {e}")
            return None

    def get_data_for_map(self, tid):
        try:
            tid_list = tid.split(',') if isinstance(tid, str) and ',' in tid else [tid]
            
            ids = ','.join(['%s'] * len(tid_list))
            
            query = f"""
                SELECT * FROM point_features WHERE tid IN ({ids})
            """
            
            self.cursor.execute(query, tuple(tid_list))
            
            columns = [desc[0] for desc in self.cursor.description]
            results = []
            
            for row in self.cursor.fetchall():
                results.append(dict(zip(columns, row)))
                
            return results
            
        except Exception as e:
            print(f"Database error for trajectories {tid}: {e}")
            return None

    def get_data_for_quantile(self, tid):
        tid_list = tid.split(',') if isinstance(tid, str) and ',' in tid else [tid]
            
        ids = ','.join(['%s'] * len(tid_list))
        try:
            query  = f"""
                SELECT * FROM point_features WHERE tid IN ({ids})
            """
            self.cursor.execute(query, tuple(tid_list))
            columns = [desc[0] for desc in self.cursor.description]
            first_id = []
            second_id = []
            results = []
            for row in self.cursor.fetchall():
                if (int(row[2]) == int(tid_list[0])):
                    first_id.append(dict(zip(columns, row)))
                else:
                    second_id.append(dict(zip(columns, row)))
            results = first_id + second_id
            return results
            
        except Exception as e:
            print(f"Database error: {e}")
            return None