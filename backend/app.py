import sys
from datetime import date

from flask import Response
from flask_cors import CORS
from flask_jwt_extended import (JWTManager, create_access_token,
                                get_jwt_identity, jwt_optional, jwt_required)

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
app.config['JWT_SECRET_KEY'] = 'super-secret'  # TODO:Change this!
jwt = JWTManager(app)


@app.route("/")
def Index():
    return "hello world"


#  TODO: pass parameters from FE


@app.route("/dish", methods=['POST'])
@jwt_required
def add_new_dish():
    """

    :return:
    """
    # sql_cmd = """   INSERT INTO listerical_db.dish (name, created_date, food_type_base,calories_per_100_grams)
    #                 VALUES (%s,NOW(),%s,%s);"""
    userid = get_jwt_identity()  # decoded
    user = login_model.get_user(userid)  # object user
    if user.user_type == 'admin':
        name = request.json['name']
        food_type_base = request.json['food_type']
        calories_per_100_grams = request.json['calories']
        idmenu = request.json['idmenu']
        res = dish.add_dish_to_menu(
            name=name,
            food_type_base=food_type_base,
            calories_per_100_grams=calories_per_100_grams,
            idmenu=idmenu)
        return jsonify(res)
    else:
        return jsonify(False), 403


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
@jwt_required
def add_menu():

    userid = get_jwt_identity()  # decoded
    print('add_menu:')
    print(request.headers)
    user = login_model.get_user(userid)  # object user
    print(user)
    print(user.user_type == 'admin')
    if user.user_type == 'admin':
        dishes = request.json['dishes']
        menu_date = request.json['menu_date']
        meals_times = request.json['meals_times']
        res = menu.add_menu(dishes, meals_times, menu_date)
    else:
        return jsonify(False), 403
    return jsonify(True)


@app.route("/login", methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']
    userid = login_model.authenticate(username, password)  # user pass are ok
    if userid:
        access_token = create_access_token(identity=userid)
        user = login_model.get_user(userid)

        return jsonify(access_token=access_token, user_type=user.user_type)
    else:
        return Response("wrong user name or password",
                        status=201,
                        mimetype='application/json')


if __name__ == "__main__":
    app.run(debug=True)
