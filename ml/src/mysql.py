import data
import MySQLdb
import json
from tossup import Tossup

TIER = "development"

def load_config():
    config = json.loads(open('../../config/db.json').read())
    return config[TIER]

class MySQLData(data.Datasource):

    def __init__(self):
        config = load_config()
        self.db = MySQLdb.connect(
            host=config['host'],
            user=config['username'],
            passwd=config['password'],
            db=config['database']
        )

    def get_data(self):
        cursor = self.db.cursor()
        sql = "SELECT question, answer, categoryId, difficultyId, tournamentId, roundId, number FROM `tossup`"
        tossups = []
        try:
            cursor.execute(sql)
            results = cursor.fetchall()
            headers = cursor.description
            for row in results:
                args = {}
                for column in range(len(row)):
                    args[headers[column][0]] = row[column]
                tossups.append(Tossup(**args))
        except Exception as e:
            print("Error fetching data", e)
        return tossups

    def close(self):
        self.db.close()
