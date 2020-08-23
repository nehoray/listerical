import sys
from datetime import date

from flask import Response
from flask_cors import CORS

from dish import DishModel
from login import LoginModel
from menu import MenuModel
from utils import Flask, jsonify, request

dish = DishModel()
menu = MenuModel()
login_model = LoginModel()

app = Flask(__name__)
# TODO: handle it in prod
CORS(app, resorces="http://localhost:5000/")


@app.route("/")
def Index():
    return "hello world"


#  TODO: pass parameters from FE
@app.route("/dish/add")
def add_new_dish():
    """

    :return:
    """
    # sql_cmd = """   INSERT INTO listerical_db.dish (name, created_date, food_type_base,calories_per_100_grams)
    #                 VALUES (%s,NOW(),%s,%s);"""

    name = request.args.get('name')
    food_type_base = request.args.get('food_type')
    calories_per_100_grams = request.args.get('calories')
    idmenu = request.args.get('idmenu')
    dish.add_dish_to_menu(name=name,
                          food_type_base=food_type_base,
                          calories_per_100_grams=calories_per_100_grams,
                          idmenu=idmenu)
    return jsonify(True)


@app.route("/opennighours")
# TODO: decide functions names
def get_full_menu():
    """
    if date param is'nt sent, the function will use today's date
    :return: full menu (indcluding dishes) of today or menu of other date if such arg is given.
    """
    chosen_date = request.args.get('chosen_date') or date.today()
    data = menu.get_full_menu(chosen_date)
    for cur_menu in data or []:
        cur_menu['dishes'] = dish.get_dishes_by_menu(cur_menu['idmenu'])
    return jsonify(data)


@app.route("/menus/dates")
def get_menus_dates():
    data = menu.get_menus_dates()
    return jsonify(data)


@app.route("/menu", methods=['POST'])
def add_menu():
    dishes = request.json['dishes']
    menu_date = request.json['menu_date']
    meals_times = request.json['meals_times']
    menu.add_menu(dishes, meals_times, menu_date)
    # here making url localhost/?
    return jsonify(True)


@app.route("/login", methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']
    jwt = login_model.authenticate(username, password)
    if (jwt != False):
        print(jwt)
        return jwt
    else:
        return Response("wrong user name or password",
                        status=201,
                        mimetype='application/json')


if __name__ == "__main__":
    app.run(debug=True)
