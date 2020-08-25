import binascii
import datetime
import hashlib

import jwt

from MysqlManger import execute_insertion, execute_selection
from user import User
from utils import jsonify, os

# get hashed password and user id of a user
_SQL_GET_USER_PASSWORD_HASH = """
                                SELECT  userid,password
                                FROM    listerical_db.user
                                WHERE   username = %s
                                """

# get username and user type
_SQL_GET_USER = """
                SELECT username, user_type FROM listerical_db.user
                WHERE userid=%s
                """


class LoginModel:
    def authenticate(self, username, password):
        """Check if the username and password are ok.

        :param username: user name
        :param password: user password
        :returns:   True - if username and password are a match.
                    False - if no match or if an error occurred
        """
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
        """Gets user naem and user type 

        :param userid: id of the current user
        :returns: user object as user(user name,user type)
        """
        user = User(**execute_selection(sql=_SQL_GET_USER, values=(userid))[0])
        return user

    def verify_password(self, stored_password, provided_password):
        """Verify a stored password against one provided by user
        
        :param stored_password: hash password from db
        :param: provided_password: password from user input
        :returns: True or False. depands on if passwords matches
        """
        salt = stored_password[:64]
        stored_password = stored_password[64:]
        pwdhash = hashlib.pbkdf2_hmac('sha512',
                                      provided_password.encode('utf-8'),
                                      salt.encode('ascii'), 100000)
        pwdhash = binascii.hexlify(pwdhash).decode('ascii')
        return pwdhash == stored_password

    # will be used on sign up form in the future
    def hash_password(self, password):
        """Hash a password for storing.
        
        :param password: password from user input
        returns: hashed password
        """
        salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')
        pwdhash = hashlib.pbkdf2_hmac('sha512', password.encode('utf-8'), salt,
                                      100000)
        pwdhash = binascii.hexlify(pwdhash)
        return (salt + pwdhash).decode('ascii')
