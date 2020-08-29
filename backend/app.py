import datetime
import os
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
CORS(app, supports_credetials=True)
app.config['JWT_SECRET_KEY'] = os.environ.get(
    'JWT_SECRET', 'super-secret')  #TODO: remove default

jwt = JWTManager(app)


# used in: adding dish to menu in main page (combo)
@app.route("/menu/dish", methods=['POST'])
@jwt_required
def add_new_dish():
    """Add new dish to an exsiting menu.
    
    :returns: True on success, False and code 403 on failure 
    """
    userid = get_jwt_identity()  # decoded
    user = login_model.get_user(userid)  # object user
    if user.user_type == 'admin':
        name = request.json['name']
        food_type_base = request.json['food_type']
        calories_per_100_grams = request.json['calories']
        idmenu = request.json['idmenu']
        iddish = request.json['iddish']  # will be false if adding new dish
        res = dish.add_dish_to_menu(
            name=name,
            food_type_base=food_type_base,
            calories_per_100_grams=calories_per_100_grams,
            idmenu=idmenu,
            iddish=iddish)
        return jsonify(res)
    else:
        return jsonify(False), 403


# for new dish button - main page
@app.route("/dish", methods=['POST'])
@jwt_required
def create_new_dish():
    """Add new dish to an exsiting menu.
    
    :returns: True on success, False and code 403 on failure 
    """
    userid = get_jwt_identity()  # decoded
    user = login_model.get_user(userid)  # object user
    if user.user_type == 'admin':
        name = request.json['name']
        food_type = request.json['food_type']
        calories = request.json['calories']
        res = dish.create_dish(name, food_type, calories)
        return jsonify(res)
    else:
        return jsonify(False), 403


@app.route("/dishes")
def get_all_dishes():
    res = dish.get_all_dishes()
    return jsonify(res)


# @app.route("/menu/<idmenu>/dish/<iddish>", methods=['POST'])
# def link_dish_to_menu(idmenu, iddish):
#     dish.link_dish_to_menu(idmenu, iddish)


@app.route("/")
def get_menu():
    """If date param is'nt sent, the function will use today's date

    return: full menu (indcluding dishes) of today or menu of other date if such arg is given.
    """
    chosen_date = request.args.get('chosen_date') or date.today()
    data = menu.get_menu(chosen_date)
    for cur_menu in data or []:
        cur_menu['dishes'] = dish.get_dishes_by_menu(cur_menu['idmenu'])
    return jsonify(data)


@app.route("/menus/dates")
def get_menus_dates():
    """
    return: all dates with menu data.
    """
    data = menu.get_menus_dates()
    return jsonify(data)


@app.route("/menu", methods=['POST'])
@jwt_required
def add_menu():
    """Adding new menu 

    return: True on success, False and code 403 on failure
    """
    userid = get_jwt_identity()  # decoded jwt
    user = login_model.get_user(userid)  # object user

    if user.user_type == 'admin':
        dishes = request.json['dishes']
        menu_date = request.json['menu_date']
        meals_times = request.json['meals_times']
        res = menu.add_menu(dishes, meals_times, menu_date)
        print(res)
        return jsonify(res)
    else:
        return jsonify(False), 403


@app.route("/login", methods=['POST'])
def login():
    """Log the user in by username and password.
    create jwt token for the user.
    
    return: access token on success, False and code 403 on failure
    """
    username = request.json['username']
    password = request.json['password']
    userid = login_model.authenticate(username, password)  # user pass are ok

    if userid:
        expires = datetime.timedelta(hours=2)
        access_token = create_access_token(identity=userid,
                                           expires_delta=expires)
        user = login_model.get_user(userid)

        return jsonify(access_token=access_token, user_type=user.user_type)
    else:
        return Response("wrong user name or password",
                        status=403,
                        mimetype='application/json')


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
