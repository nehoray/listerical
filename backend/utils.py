import os
from contextlib import closing
from datetime import datetime

import mysql.connector
from flask import Flask, jsonify, request
from mysql.connector import FieldType

_DATE_TYPES = ["TIME"]

connetion_params = {
    'host': os.environ.get("host"),
    'user': os.environ.get("user"),
    'password': os.environ.get("password"),
    'database': os.environ.get("database"),
}


def parse_result(cursor):
    data = cursor.fetchall()
    # for each col in row if your type is in _DATE_TYPES - parse to string
    for row in data:
        for col in cursor.description:
            if FieldType.get_info(col[1]) in _DATE_TYPES:
                # TODO: change format
                row[col[0]] = str(row[col[0]])

    return data
