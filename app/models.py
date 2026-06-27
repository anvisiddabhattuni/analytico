import os
import sqlite3
from datetime import datetime, timedelta, timezone

from flask import current_app
from werkzeug.security import check_password_hash, generate_password_hash

_SQLITE_PATH = os.environ.get("SQLITE_DB_PATH", "analytico.db")


def _use_memory_db():
    return current_app.config.get("USE_MEMORY_DB", False)


def _conn():
    conn = sqlite3.connect(_SQLITE_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_sqlite():
    conn = _conn()
    conn.execute(
        "CREATE TABLE IF NOT EXISTS users ("
        "id INTEGER PRIMARY KEY AUTOINCREMENT,"
        "username TEXT UNIQUE NOT NULL,"
        "password TEXT NOT NULL,"
        "meta_access_token TEXT,"
        "instagram_access_token TEXT,"
        "email_verified INTEGER DEFAULT 0,"
        "verification_token TEXT,"
        "verification_token_expires TEXT)"
    )
    # Safe migrations for existing DBs
    for col, defn in [
        ("meta_access_token", "TEXT"),
        ("instagram_access_token", "TEXT"),
        ("email_verified", "INTEGER DEFAULT 0"),
        ("verification_token", "TEXT"),
        ("verification_token_expires", "TEXT"),
    ]:
        try:
            conn.execute(f"ALTER TABLE users ADD COLUMN {col} {defn}")
        except sqlite3.OperationalError:
            pass
    conn.commit()
    conn.close()


class User:
    @staticmethod
    def create_user(username, password):
        hashed = generate_password_hash(password)

        if _use_memory_db():
            conn = _conn()
            try:
                conn.execute(
                    "INSERT INTO users (username, password, email_verified) VALUES (?, ?, 0)",
                    (username, hashed),
                )
                conn.commit()
            except sqlite3.IntegrityError:
                raise ValueError("User already exists")
            finally:
                conn.close()
            return {"username": username, "password": hashed}

        current_app.mongo.db.users.insert_one({
            "username": username,
            "password": hashed,
            "email_verified": False,
        })
        return {"username": username, "password": hashed}

    @staticmethod
    def find_by_username(username):
        if _use_memory_db():
            conn = _conn()
            row = conn.execute(
                "SELECT * FROM users WHERE username = ?", (username,)
            ).fetchone()
            conn.close()
            return dict(row) if row else None

        return current_app.mongo.db.users.find_one({"username": username})

    @staticmethod
    def find_by_verification_token(token):
        if _use_memory_db():
            conn = _conn()
            row = conn.execute(
                "SELECT * FROM users WHERE verification_token = ?", (token,)
            ).fetchone()
            conn.close()
            return dict(row) if row else None

        return current_app.mongo.db.users.find_one({"verification_token": token})

    @staticmethod
    def set_verification_token(username, token):
        expires = (
            datetime.now(timezone.utc) + timedelta(hours=24)
        ).isoformat()

        if _use_memory_db():
            conn = _conn()
            conn.execute(
                "UPDATE users SET verification_token = ?, verification_token_expires = ? WHERE username = ?",
                (token, expires, username),
            )
            conn.commit()
            conn.close()
            return

        current_app.mongo.db.users.update_one(
            {"username": username},
            {"$set": {"verification_token": token, "verification_token_expires": expires}},
        )

    @staticmethod
    def verify_email(username):
        if _use_memory_db():
            conn = _conn()
            conn.execute(
                "UPDATE users SET email_verified = 1, verification_token = NULL, "
                "verification_token_expires = NULL WHERE username = ?",
                (username,),
            )
            conn.commit()
            conn.close()
            return

        current_app.mongo.db.users.update_one(
            {"username": username},
            {"$set": {"email_verified": True, "verification_token": None}},
        )

    @staticmethod
    def verify_password(stored_password, provided_password):
        return check_password_hash(stored_password, provided_password)

    @staticmethod
    def set_meta_token(username, token):
        if _use_memory_db():
            conn = _conn()
            conn.execute(
                "UPDATE users SET meta_access_token = ? WHERE username = ?",
                (token, username),
            )
            conn.commit()
            conn.close()
            return
        current_app.mongo.db.users.update_one(
            {"username": username},
            {"$set": {"meta_access_token": token}},
        )

    @staticmethod
    def get_meta_token(username):
        user = User.find_by_username(username)
        return (user or {}).get("meta_access_token")

    @staticmethod
    def set_instagram_token(username, token):
        if _use_memory_db():
            conn = _conn()
            conn.execute(
                "UPDATE users SET instagram_access_token = ? WHERE username = ?",
                (token, username),
            )
            conn.commit()
            conn.close()
            return
        current_app.mongo.db.users.update_one(
            {"username": username},
            {"$set": {"instagram_access_token": token}},
        )

    @staticmethod
    def get_instagram_token(username):
        user = User.find_by_username(username)
        return (user or {}).get("instagram_access_token")
