from contextlib import closing
from datetime import datetime

import mysql.connector

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


class MenuModel:
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
        for index in range(len(res) - 1):
            print
            data.append(res[index]['menu_date'])
        return data
