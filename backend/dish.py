from utils import parse_result

_SQL_SELECT_DISH = """  SELECT  dish.iddish, dish.name, dish.food_type_base,dish.calories_per_100_grams 
                        FROM    listerical_db.dish AS dish 
                        WHERE   dish.iddish IN 
                                                (SELECT md.iddish 
                                                        FROM menuid_dishid md,menu m 
                                                        WHERE md.idmenu = m.idmenu AND md.idmenu =%s)
                    """
_SQL_INSERT_DISH = """ INSERT INTO listerical_db.dish (name, created_date, food_type_base,calories_per_100_grams)
                        VALUES (%s,NOW(),%s,%s);
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

    # first - add only to table
    def add_new_dish(self, name, food_type_base, calories_per_100_grams):
        mycursor = self.db.cursor(dictionary=True)
        values = (name, food_type_base, calories_per_100_grams)
        mycursor.execute(_SQL_INSERT_DISH, values)
        self.db.commit()
        return True
