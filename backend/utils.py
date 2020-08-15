from mysql.connector import FieldType

_DATE_TYPES = ["TIME"]


def parse_result(cursor):
    data = cursor.fetchall()
    # for each col in row if your type is in _DATE_TYPES - parse to string
    for row in data:
        for col in cursor.description:
            if FieldType.get_info(col[1]) in _DATE_TYPES:
                row[col[0]] = str(row[col[0]])

    return data
