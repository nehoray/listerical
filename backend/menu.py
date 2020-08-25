import datetime
from contextlib import closing

import mysql.connector

from dish import DishModel
from MysqlManger import execute_selection
from utils import connetion_params, parse_result

_SQL_MENU_BY_DATE = ''' 
                    SELECT	idmenu, day_part, TIME(start_time) AS start_time, TIME(end_time) AS end_time
                    FROM	listerical_db.menu 
                    WHERE	DATE(start_time) = %s
                    '''
#TODO: change add condition of all menu parts
_SQL_GET_MENUS_DATES = '''
                        SELECT	DISTINCT DATE_FORMAT(DATE(start_time),"%Y-%m-%d") AS menu_date
                        FROM	listerical_db.menu 
                    
'''
_SQL_ADD_MENU = '''
INSERT INTO listerical_db.menu (day_part,start_time,end_time)
                              values  (%s, TIMESTAMP(%s), TIMESTAMP (%s))

'''


class MenuModel:
    def __init__(self):
        self.dish = DishModel()

    def get_full_menu(self, chosen_date):
        """
        gets menu details of the menu served on date chosen_date
        :param chosen_date: date of menu to be returned
        :return: menu of the date chosen_date
        """
        data = execute_selection(sql=_SQL_MENU_BY_DATE, values=(chosen_date))
        return data

    def get_menus_dates(self):
        res = execute_selection(sql=_SQL_GET_MENUS_DATES)
        data = []
        for index in range(len(res)):
            data.append(res[index]['menu_date'])
        return data

    def add_menu(self, dishes, meals_times, menu_date):

        # orgenize the dishes so it would be easy to create menu object for each meal
        meals_res = {'morning': [], 'noon': [], 'evening': []}
        for meal in meals_res.keys():
            meals_res[meal] = [
                dish for dish in dishes if dish['mealName'] == meal
            ]

        # converting all times to date and time type
        date_parts = datetime.date(*(map(int, menu_date.split('-'))))
        for time in meals_times.keys():
            meals_times[time] = datetime.datetime.combine(
                date_parts,
                datetime.time(*(map(int, meals_times[time].split(':')))))
        # creating the menus
        for meal in meals_res.keys():

            values = (meal, meals_times[meal + "_start"],
                      meals_times[meal + "_end"])

            with closing(mysql.connector.connect(**connetion_params)) as db:
                with closing(db.cursor(dictionary=True,
                                       buffered=True)) as cursor:
                    # creates menus for all 3 meals
                    cursor.execute(_SQL_ADD_MENU, values)
                    db.commit()
                    # inserting the data to the meals we have data about
                    if meals_res[meal] != []:
                        # get new menu id
                        idmenu = cursor.lastrowid
                        # menuids_day_parts[meal] = idmenu
                        # itarete over the dishes, adding them to db and link them to menu idmenu
                        for dish in meals_res[meal]:
                            self.dish.add_dish_to_menu(dish['name'],
                                                       dish['food_type'],
                                                       dish['calories'],
                                                       idmenu)
        return True
