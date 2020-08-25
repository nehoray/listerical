import binascii
import datetime
import hashlib

import jwt

from MysqlManger import execute_insertion, execute_selection
from user import User
from utils import jsonify, os

_SQL_GET_USER_PASSWORD_HASH = """
                                SELECT  userid,password
                                FROM    listerical_db.user
                                WHERE   username = %s
                                """
_SQL_GET_USER = """
                            SELECT username, user_type FROM listerical_db.user
                            WHERE userid=%s
                        """


class LoginModel:

    #check if the username and password are ok
    def authenticate(self, username, password):
        self.user_type = ''
        data = execute_selection(sql=_SQL_GET_USER_PASSWORD_HASH,
                                 values=(username))

        if len(data) == 0:
            return False
        hash = data[0]['password']
        userid = data[0]['userid']
        # if the user and pass are ok
        return userid if self.verify_password(hash, password) else False

    def get_user(self, userid):
        user = User(**execute_selection(sql=_SQL_GET_USER, values=(userid))[0])
        return user

    # def hash_password(self, password):
    #     """Hash a password for storing."""
    #     salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')
    #     pwdhash = hashlib.pbkdf2_hmac('sha512', password.encode('utf-8'), salt,
    #                                   100000)
    #     pwdhash = binascii.hexlify(pwdhash)
    #     return (salt + pwdhash).decode('ascii')

    def verify_password(self, stored_password, provided_password):
        """Verify a stored password against one provided by user"""
        salt = stored_password[:64]
        stored_password = stored_password[64:]
        pwdhash = hashlib.pbkdf2_hmac('sha512',
                                      provided_password.encode('utf-8'),
                                      salt.encode('ascii'), 100000)
        pwdhash = binascii.hexlify(pwdhash).decode('ascii')
        return pwdhash == stored_password
