from utils import parse_result


def get_menu_by_date_sql(chosen_date, mydb):
    sql_cmd = "SELECT menu.day_part,time(menu.start_time),time(menu.end_time), dish.name, dish.food_type_base,dish.calories_per_100_grams FROM listerical_db.menu AS menu, listerical_db.dish AS dish, listerical_db.menuid_dishid as md WHERE DATE(start_time) = %s AND menu.idmenu = md.idmenu AND md.idmenu = dish.iddish;"
    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute(sql_cmd, [chosen_date])
    return parse_result(mycursor)


def get_opennig_hours_sql(chosen_date, mydb):
    sql_cmd = "SELECT idmenu, day_part, time(start_time) AS start_time, time(end_time) AS end_time FROM listerical_db.menu where date(start_time) = %s "
    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute(sql_cmd, [chosen_date])
    return parse_result(mycursor)
