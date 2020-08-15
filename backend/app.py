# app.py
from flask import Flask
import mysql.connector

cmd = "INSERT INTO listerical_db.dish (name, created_date, food_type_base,calories_per_100_grams) VALUES ('הצלחה',now(),null,30);"

app = Flask(__name__)

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="סיסמאחזקהמאוד",
  database="listerical_db"
)

mycursor = mydb.cursor()

@app.route("/")
def Index():
    return 'hello world'

@app.route('/insert')
def insert():
    mycursor = mydb.cursor()
    mycursor.execute(cmd)
    mydb.commit()
    return "good"

if __name__ == "__main__":
    app.run(debug=True)