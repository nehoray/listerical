import mysql.connector

from MysqlManger import execute_insertion, execute_selection
from utils import closing, connetion_params, parse_result

_SQL_SELECT_DISH = """  SELECT  dish.iddish, dish.name, dish.food_type_base,dish.calories_per_100_grams 
                        FROM    listerical_db.dish AS dish 
                        WHERE   dish.iddish IN 
                                                (SELECT md.iddish 
                                                        FROM menuid_dishid md,menu m 
                                                        WHERE md.idmenu = m.idmenu AND md.idmenu =%s)
                    """
_SQL_INSERT_DISH_TO_DISH_TABLE = """    INSERT INTO listerical_db.dish (name, created_date, food_type_base,calories_per_100_grams)
                                        VALUES (%s,NOW(),%s,%s);
                                    """
_SQL_INSERT_DISH_TO_MENU = """  INSERT INTO listerical_db.menuid_dishid (idmenu,iddish)
                                VALUES(%s,%s)

                            """


class DishModel:
    def get_dishes_by_menu(self, idmenu):
        """
        gets dishes of menu with id idmenu from db
        :param idmenu: id of the requested menu dishes
        :return: query result
        """
        # with closing(mysql.connector.connect(**connetion_params)) as db:
        #     with closing(db.cursor(dictionary=True, buffered=True)) as cursor:
        #         print('before: _SQL_SELECT_DISH')
        #         cursor.execute(_SQL_SELECT_DISH, [idmenu])
        #         print('after: _SQL_SELECT_DISH')
        #         data = parse_result(cursor)
        #         return data
        data = execute_selection(sql=_SQL_SELECT_DISH, values=(idmenu))
        return data

    def add_dish_to_menu(self, name, food_type_base, calories_per_100_grams,
                         idmenu):
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

    # Add linkage between dish and menu
    def link_dish_to_menu(self, idmenu):
        with closing(mysql.connector.connect(**connetion_params)) as db:
            with closing(db.cursor(dictionary=True, buffered=True)) as cursor:
                iddish = cursor.lastrowid
                values = (idmenu, iddish)
                res = execute_insertion(_SQL_INSERT_DISH_TO_MENU, values)
                return res
