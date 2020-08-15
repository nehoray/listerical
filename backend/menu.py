from utils import parse_result


def get_daily_menu(chosen_date, mydb):
    sql_cmd = "SELECT menu.day_part,time(menu.start_time),time(menu.end_time), dish.name, dish.food_type_base,dish.calories_per_100_grams FROM listerical_db.menu AS menu, listerical_db.dish AS dish, listerical_db.menuid_dishid as md WHERE DATE(start_time) = %s AND menu.idmenu = md.idmenu AND md.idmenu = dish.iddish;"

    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute(sql_cmd, [chosen_date])

    return parse_result(mycursor)

