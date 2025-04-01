from flask import current_app
from werkzeug.security import generate_password_hash, check_password_hash

class User:
    @staticmethod
    def create_user(username, password):
        hashed_password = generate_password_hash(password)
        user_data = {"username": username, "password": hashed_password}
        current_app.mongo.db.users.insert_one(user_data)
        return user_data

    @staticmethod
    def find_by_username(username):
        return current_app.mongo.db.users.find_one({"username": username})

    @staticmethod
    def verify_password(stored_password, provided_password):
        return check_password_hash(stored_password, provided_password)
