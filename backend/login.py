import binascii
import datetime
import hashlib

import jwt

from MysqlManger import execute_insertion, execute_selection
from utils import jsonify, os

_SQL_GET_USER_PASSWORD_HASH = """
                                    SELECT password
                                    FROM listerical_db.user
                                    WHERE username = %s
"""


class LoginModel:

    #check if the username and password are ok
    def authenticate(self, username, password):
        hash = execute_selection(sql=_SQL_GET_USER_PASSWORD_HASH,
                                 values=(username))
        if len(hash) == 0:
            return False

        hash = hash[0]['password']

        # if the user and pass are ok
        if (self.verify_password(hash, password)):
            jwt = self.create_jwt(username)
            return jwt
        else:
            return False
            # try:
            #     decoded_jwt = jwt.decode(encoded_jwt,'secret',algorithms=['HS256'])
            #     print('encoded_jwt:')
            #     print(decoded_jwt)
            # except jwt.ExpiredSignatureError as e:
            #     return 'jwt.ExpiredSignatureError'

    def create_jwt(self, username):
        payload = {
            'iat': datetime.datetime.utcnow(),
            'exp': datetime.datetime.utcnow() +
            datetime.timedelta(seconds=86400),  # a day
            'username': username
        }
        jwt_res = jwt.encode(payload, 'secret', algorithm='HS256')
        return jwt_res

    def hash_password(self, password):
        """Hash a password for storing."""
        salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')
        pwdhash = hashlib.pbkdf2_hmac('sha512', password.encode('utf-8'), salt,
                                      100000)
        pwdhash = binascii.hexlify(pwdhash)
        return (salt + pwdhash).decode('ascii')

    def verify_password(self, stored_password, provided_password):
        """Verify a stored password against one provided by user"""
        salt = stored_password[:64]
        stored_password = stored_password[64:]
        pwdhash = hashlib.pbkdf2_hmac('sha512',
                                      provided_password.encode('utf-8'),
                                      salt.encode('ascii'), 100000)
        pwdhash = binascii.hexlify(pwdhash).decode('ascii')
        return pwdhash == stored_password
