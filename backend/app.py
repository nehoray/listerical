import os
import sys
from datetime import date

import mysql.connector
from flask import Flask, jsonify, request
from flask_cors import CORS

from dish import DishModel
from menu import MenuModel

mydb = mysql.connector.connect(
    host=os.environ.get("host"),
    user=os.environ.get("user"),
    password=os.environ.get("password"),
    database=os.environ.get("database"),
)
dish = DishModel(mydb)
menu = MenuModel(mydb)

app = Flask(__name__)
# TODO: handle it in prod
CORS(app, resorces="http://localhost:5000/")


@app.route("/")
def Index():
    return "hello world"


#  TODO: pass parameters from FE
@app.route("/dish/add")
def add_new_dish():
    sql_cmd = (
        "INSERT INTO listerical_db.dish (name, created_date, food_type_base,calories_per_100_grams)"
        " VALUES (%s,NOW(),%s,%s);")

    name = "name from fe1"
    food_type_base = "milky"
    calories_per_100_grams = "50"

    mycursor = mydb.cursor()
    values = (name, food_type_base, calories_per_100_grams)
    mycursor.execute(sql_cmd, values)
    mydb.commit()
    return jsonify(True)


# if date param is'nt sent, the function will use today's date
@app.route("/opennighours")
# TODO: decide functions names
def get_opennig_hours():
    print(request.args)
    chosen_date = request.args.get('chosen_date') or date.today()
    data = menu.get_opennig_hours(chosen_date)
    for cur_menu in data:
        cur_menu['dishes'] = dish.get_dishes_by_menu_sql(cur_menu['idmenu'])
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
