from flask import current_app
from werkzeug.security import check_password_hash, generate_password_hash

_memory_users = {}


def _use_memory_db():
    return current_app.config.get("USE_MEMORY_DB", False)


class User:
    @staticmethod
    def create_user(username, password):
        hashed_password = generate_password_hash(password)
        user_data = {"username": username, "password": hashed_password}

        if _use_memory_db():
            if username in _memory_users:
                raise ValueError("User already exists")
            _memory_users[username] = user_data
            return user_data

        current_app.mongo.db.users.insert_one(user_data)
        return user_data

    @staticmethod
    def find_by_username(username):
        if _use_memory_db():
            return _memory_users.get(username)

        return current_app.mongo.db.users.find_one({"username": username})

    @staticmethod
    def verify_password(stored_password, provided_password):
        return check_password_hash(stored_password, provided_password)
