from utils import parse_result

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
    def __init__(self, db):
        self.db = db

    def get_dishes_by_menu(self, idmenu):
        """
        gets dishes of menu with id idmenu from db
        :param idmenu: id of the requested menu dishes
        :return: query result
        """
        mycursor = self.db.cursor(dictionary=True)
        mycursor.execute(_SQL_SELECT_DISH, [idmenu])
        return parse_result(mycursor)

    def add_dish_to_menu(self, name, food_type_base, calories_per_100_grams,
                         idmenu):
        # adding dish to dish table:
        mycursor = self.db.cursor(dictionary=True)
        values = (name, food_type_base, calories_per_100_grams)
        mycursor.execute(_SQL_INSERT_DISH_TO_DISH_TABLE, values)
        self.db.commit()

        #linking dish to menu in db
        iddish = mycursor.lastrowid
        print(iddish)

        values = (idmenu, iddish)
        print(values)
        mycursor.execute(_SQL_INSERT_DISH_TO_MENU, values)
        self.db.commit()
        return True

    # Add linkage between dish and menu
    def link_dish_to_menu(self, idmenu):
        mycursor = self.db.cursor(dictionary=True)
        iddish = mycursor.lastrowid
        values = (idmenu, iddish)
        print(mycursor.lastrowid)
        mycursor.execute(_SQL_INSERT_DISH_TO_MENU, values)
        self.db.commit()
        return True
