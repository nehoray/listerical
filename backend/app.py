# app.py
import os

import mysql.connector
from flask import Flask, request

app = Flask(__name__)

mydb = mysql.connector.connect(
    host=os.environ.get("host"),
    user=os.environ.get("user"),
    password=os.environ.get("password"),
    database=os.environ.get("database"),
)


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
# get param from url


@app.route("/menu", methods=["GET"])
def get_menu_by_date():

    chosen_date = str(request.args.get("date"))
    sql_cmd = (
        "SELECT menu.day_part,time(menu.start_time),time(menu.end_time), dish.name, dish.food_type_base,dish.calories_per_100_grams FROM listerical_db.menu AS menu, listerical_db.dish AS dish, listerical_db.menuid_dishid as md WHERE DATE(start_time) = '%s' AND menu.idmenu = md.idmenu AND md.idmenu = dish.iddish;"
        % chosen_date
    )
    mycursor = mydb.cursor()
    mycursor.execute(sql_cmd)

    data = mycursor.fetchall()
    for x in data:
        print(x)
    return "jn"


if __name__ == "__main__":
    app.run(debug=True)
