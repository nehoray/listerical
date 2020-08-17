from utils import parse_result

_SQL_MENU_BY_DATE = "SELECT idmenu, day_part, time(start_time) AS start_time, time(end_time) AS end_time FROM listerical_db.menu where date(start_time) = %s "


class MenuModel:
    def __init__(self, db):
        self.db = db

    # change name
    def get_opennig_hours(self, chosen_date):
        mycursor = self.db.cursor(dictionary=True)
        mycursor.execute(_SQL_MENU_BY_DATE, [chosen_date])
        return parse_result(mycursor)
