import mysql.connector

from MysqlManger import execute_insertion, execute_selection
from utils import closing, connetion_params, parse_result

# select dish for the presented menu
_SQL_SELECT_DISH = """  SELECT  dish.iddish, dish.name, dish.food_type_base,dish.calories_per_100_grams 
                        FROM    listerical_db.dish AS dish 
                        WHERE   dish.iddish IN 
                                                (SELECT md.iddish 
                                                        FROM menuid_dishid md,menu m 
                                                        WHERE md.idmenu = m.idmenu AND md.idmenu =%s)
                    """

_SQL_INSERT_DISH_TO_DISH_TABLE = """ INSERT INTO listerical_db.dish (name, created_date, food_type_base,calories_per_100_grams)
                                        VALUES (%s,NOW(),%s,%s);
                                    """
# link dish and menu in menuid_dishid table
_SQL_INSERT_DISH_TO_MENU = """ INSERT INTO listerical_db.menuid_dishid (idmenu,iddish)
                                VALUES(%s,%s)

                            """


class DishModel:
    def get_dishes_by_menu(self, idmenu):
        """Gets dishes of menu with id idmenu from db

        :param idmenu: the menu id we need to get dishes from
        :return: dishes of menu with idmenu id
        """
        data = execute_selection(sql=_SQL_SELECT_DISH, values=(idmenu))
        return data

    def add_dish_to_menu(self, name, food_type_base, calories_per_100_grams,
                         idmenu):
        """Add dish to dish table and then add to chosen menu

        :param name: dish name
        :param food_type_base: milk or meat based
        :param calories_per_100_grams: self explained
        :param idmenu: id of the menu too add the dish to
        :return: True or False depends on result
        """
        # adding dish to dish table:
        with closing(mysql.connector.connect(**connetion_params)) as db:
            with closing(db.cursor(dictionary=True, buffered=True)) as cursor:
                values = (name, food_type_base, calories_per_100_grams)
                cursor.execute(_SQL_INSERT_DISH_TO_DISH_TABLE, values)
                db.commit()
                #linking dish to menu in db
                iddish = cursor.lastrowid
                values = (idmenu, iddish)
                cursor.execute(_SQL_INSERT_DISH_TO_MENU, values)
                db.commit()
                return True
        return False

    def link_dish_to_menu(self, idmenu):
        """Link dish to menu. adds idmenu and iddish linkage to db

        :param: idmenu: menu id
        :return: True on success
        """
        with closing(mysql.connector.connect(**connetion_params)) as db:
            with closing(db.cursor(dictionary=True, buffered=True)) as cursor:
                iddish = cursor.lastrowid
                values = (idmenu, iddish)
                res = execute_insertion(_SQL_INSERT_DISH_TO_MENU, values)
                return res
