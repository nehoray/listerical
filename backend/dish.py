from utils import parse_result

_SQL_SELECT_DISH = "SELECT dish.iddish, dish.name, dish.food_type_base,dish.calories_per_100_grams from listerical_db.dish AS dish where dish.iddish in (SELECT md.iddish FROM menuid_dishid md,menu m where md.idmenu = m.idmenu and md.idmenu =%s)"


class DishModel:
    def __init__(self, db):
        self.db = db

    def get_dishes_by_menu_sql(self, idmenu):
        mycursor = self.db.cursor(dictionary=True)
        mycursor.execute(_SQL_SELECT_DISH, [idmenu])
        return parse_result(mycursor)
