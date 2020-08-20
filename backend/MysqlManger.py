import mysql.connector

from utils import closing, connetion_params, parse_result


def execute_selection(sql, values=None):
    with closing(mysql.connector.connect(**connetion_params)) as db:
        with closing(db.cursor(dictionary=True, buffered=True)) as cursor:
            if values == None:
                cursor.execute(sql)
            else:
                cursor.execute(sql, [values])

            data = parse_result(cursor)
            return data


def execute_insertion(sql, values):
    with closing(mysql.connector.connect(**connetion_params)) as db:
        with closing(db.cursor(dictionary=True, buffered=True)) as cursor:
            cursor.execute(sql, [values])
            db.commit()
            return True
