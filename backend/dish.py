from utils import parse_result


def get_dishes_by_menu_sql(idmenu, mydb):
    sql_cmd = "SELECT dish.iddish, dish.name, dish.food_type_base,dish.calories_per_100_grams from listerical_db.dish AS dish where dish.iddish in (SELECT md.iddish FROM menuid_dishid md,menu m where md.idmenu = m.idmenu and md.idmenu =%s)"
    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute(sql_cmd, [idmenu])
    return parse_result(mycursor)
