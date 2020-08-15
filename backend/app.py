# app.py
import os
import sys

import mysql.connector
from flask import Flask, jsonify, request

import menu

mydb = mysql.connector.connect(
    host=os.environ.get("host"),
    user=os.environ.get("user"),
    password=os.environ.get("password"),
    database=os.environ.get("database"),
)

app = Flask(__name__)


@app.route("/")
def Index():
    return "hello world"


#  TODO: pass parameters from FE
@app.route("/dish/add")
def add_new_dish():
    sql_cmd = (
        "INSERT INTO listerical_db.dish (name, created_date, food_type_base,calories_per_100_grams)"
        " VALUES (%s,NOW(),%s,%s);"
    )

    name = "name from fe1"
    food_type_base = "milky"
    calories_per_100_grams = "50"

    mycursor = mydb.cursor()
    values = (name, food_type_base, calories_per_100_grams)
    mycursor.execute(sql_cmd, values)
    mydb.commit()
    return "good"


# TODO: pass date parameter from FE
@app.route("/menu", methods=["GET"])
def get_menu_by_date():
    chosen_date = str(request.args.get("date"))
    data = menu.get_daily_menu(chosen_date, mydb)
    return jsonify(data=data)


if __name__ == "__main__":
    app.run(debug=True)
