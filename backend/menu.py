from utils import parse_result

_SQL_MENU_BY_DATE = ''' 
                    SELECT	idmenu, day_part, TIME(start_time) AS start_time, TIME(end_time) AS end_time
                    FROM	listerical_db.menu 
                    WHERE	DATE(start_time) = %s
                    '''


class MenuModel:
    def __init__(self, db):
        self.db = db

    def get_full_menu(self, chosen_date):
        """
        gets menu details of the menu served on date chosen_date
        :param chosen_date: date of menu to be returned
        :return: menu of the date chosen_date
        """
        mycursor = self.db.cursor(dictionary=True)
        mycursor.execute(_SQL_MENU_BY_DATE, [chosen_date])
        return parse_result(mycursor)
