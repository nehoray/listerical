# app.py
from flask import Flask
import mysql.connector


app = Flask(__name__)

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="סיסמאחזקהמאוד",
  database="listerical_db"
)
@app.route("/")
def Index():
    return 'hello world'

#  todo: pass parameters from FE
@app.route('/dish/add')
def add_new_dish():
    sql_cmd = "INSERT INTO listerical_db.dish (name, created_date, food_type_base,calories_per_100_grams)" \
              " VALUES (%s,NOW(),%s,%s);"

    name = 'name from fe'
    food_type_base = 'milky'
    calories_per_100_grams = '50'

    mycursor = mydb.cursor()
    values = (name, food_type_base, calories_per_100_grams)
    mycursor.execute(sql_cmd, values)
    mydb.commit()
    return "good"

if __name__ == "__main__":
    app.run(debug=True)