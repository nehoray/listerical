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
_SQL_GET_ALL_DISHES = """
                        SELECT iddish, name,food_type_base, calories_per_100_grams
                        FROM listerical_db.dish;
                        """
_SQL_GET_DISH_BY_NAME = """
                            SELECT iddish 
                            FROM listerical_db.dish 
                            WHERE name = %s;
                        """


class DishModel:
    def get_dishes_by_menu(self, idmenu):
        """Gets dishes of menu with id idmenu from db

        :param idmenu: the menu id we need to get dishes from
        :return: dishes of menu with idmenu id
        """
        data = execute_selection(sql=_SQL_SELECT_DISH, values=(idmenu))
        return data

    def add_dish_to_menu(self,
                         name,
                         food_type_base,
                         calories_per_100_grams,
                         idmenu,
                         iddish=False):
        """Add dish to dish table and then add to chosen menu

        :param name: dish name
        :param food_type_base: milk or meat based
        :param calories_per_100_grams: self explained
        :param idmenu: id of the menu too add the dish to
        :return: dishid of the dish add
        """
        # if this is a new dish that does not exist in db
        if not iddish:
            print('dish not exsiting my iddish is :')
            print(iddish)
            # adding dish to dish table:
            with closing(mysql.connector.connect(**connetion_params)) as db:
                with closing(db.cursor(dictionary=True,
                                       buffered=True)) as cursor:
                    values = (name, food_type_base, calories_per_100_grams)
                    cursor.execute(_SQL_INSERT_DISH_TO_DISH_TABLE, values)
                    db.commit()
                    #linking dish to menu in db
                    iddish = cursor.lastrowid
                    values = (idmenu, iddish)
                    cursor.execute(_SQL_INSERT_DISH_TO_MENU, values)
                    db.commit()
                    return iddish
        # if dish is in db alreay
        else:
            print('dish  exsiting my iddish is :')
            print(iddish)
            values = (idmenu, iddish)
            execute_insertion(_SQL_INSERT_DISH_TO_MENU, values)
            return iddish
        return False

    # used on menu creation
    def link_dish_to_menu(self, idmenu, iddish=None):
        """Link dish to menu. adds idmenu and iddish linkage to db

        :param: idmenu: menu id
        :return: True on success
        """
        if iddish == None:
            with closing(mysql.connector.connect(**connetion_params)) as db:
                with closing(db.cursor(dictionary=True,
                                       buffered=True)) as cursor:
                    iddish = cursor.lastrowid
                    values = (idmenu, iddish)
                    res = execute_insertion(_SQL_INSERT_DISH_TO_MENU, values)
                    return res
        else:
            values = (idmenu, iddish)
            execute_insertion(_SQL_INSERT_DISH_TO_MENU, values)

    def get_all_dishes(self):
        res = execute_selection(_SQL_GET_ALL_DISHES)
        return res

    def create_dish(self, name, food_type, calories):
        values = (name, food_type, calories)
        res = execute_insertion(_SQL_INSERT_DISH_TO_DISH_TABLE, values)
        return res

    def check_if_dish_exist(self, dish):
        values = (dish)
        res = execute_selection(_SQL_GET_DISH_BY_NAME, values)
        print(res)
        if len(res) > 0:
            return True
        else:
            return False
