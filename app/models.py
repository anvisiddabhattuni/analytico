import os
import sqlite3
from datetime import datetime, timedelta, timezone

from werkzeug.security import check_password_hash, generate_password_hash

_SQLITE_PATH = os.environ.get("SQLITE_DB_PATH", "analytico.db")


# ── Connection helpers ────────────────────────────────────────────────────────

def _use_postgres():
    return bool(os.environ.get("DATABASE_URL"))


def _pg_conn():
    import psycopg2
    import psycopg2.extras
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    return conn


def _sqlite_conn():
    conn = sqlite3.connect(_SQLITE_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


# ── Schema init ───────────────────────────────────────────────────────────────

def init_db():
    if _use_postgres():
        conn = _pg_conn()
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                meta_access_token TEXT,
                email_verified BOOLEAN DEFAULT FALSE,
                verification_token TEXT,
                verification_token_expires TIMESTAMPTZ
            )
        """)
        # Migrate pre-existing tables that are missing newer columns
        for col, defn in [
            ("meta_access_token", "TEXT"),
            ("email_verified", "BOOLEAN DEFAULT FALSE"),
            ("verification_token", "TEXT"),
            ("verification_token_expires", "TIMESTAMPTZ"),
        ]:
            cur.execute(f"ALTER TABLE users ADD COLUMN IF NOT EXISTS {col} {defn}")
        conn.commit()
        cur.close()
        conn.close()
    else:
        conn = _sqlite_conn()
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                meta_access_token TEXT,
                email_verified INTEGER DEFAULT 0,
                verification_token TEXT,
                verification_token_expires TEXT
            )
        """)
        for col, defn in [
            ("meta_access_token", "TEXT"),
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


# ── User model ────────────────────────────────────────────────────────────────

class User:

    # ── Helpers ──

    @staticmethod
    def _pg_fetch_one(sql, params=()):
        import psycopg2.extras
        conn = _pg_conn()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(sql, params)
        row = cur.fetchone()
        cur.close()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def _pg_execute(sql, params=()):
        conn = _pg_conn()
        cur = conn.cursor()
        cur.execute(sql, params)
        conn.commit()
        cur.close()
        conn.close()

    # ── Auth ──

    @staticmethod
    def create_user(username, password):
        hashed = generate_password_hash(password)
        if _use_postgres():
            try:
                User._pg_execute(
                    "INSERT INTO users (username, password, email_verified) VALUES (%s, %s, FALSE)",
                    (username, hashed),
                )
            except Exception as e:
                if "unique" in str(e).lower() or "duplicate" in str(e).lower():
                    raise ValueError("User already exists")
                raise
        else:
            conn = _sqlite_conn()
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
        return {"username": username}

    @staticmethod
    def find_by_username(username):
        if _use_postgres():
            return User._pg_fetch_one(
                "SELECT * FROM users WHERE username = %s", (username,)
            )
        conn = _sqlite_conn()
        row = conn.execute(
            "SELECT * FROM users WHERE username = ?", (username,)
        ).fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def find_by_verification_token(token):
        if _use_postgres():
            return User._pg_fetch_one(
                "SELECT * FROM users WHERE verification_token = %s", (token,)
            )
        conn = _sqlite_conn()
        row = conn.execute(
            "SELECT * FROM users WHERE verification_token = ?", (token,)
        ).fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def verify_password(stored_password, provided_password):
        return check_password_hash(stored_password, provided_password)

    # ── Email verification ──

    @staticmethod
    def set_verification_token(username, token):
        expires = (datetime.now(timezone.utc) + timedelta(hours=24)).isoformat()
        if _use_postgres():
            User._pg_execute(
                "UPDATE users SET verification_token = %s, verification_token_expires = %s WHERE username = %s",
                (token, expires, username),
            )
        else:
            conn = _sqlite_conn()
            conn.execute(
                "UPDATE users SET verification_token = ?, verification_token_expires = ? WHERE username = ?",
                (token, expires, username),
            )
            conn.commit()
            conn.close()

    @staticmethod
    def verify_email(username):
        if _use_postgres():
            User._pg_execute(
                "UPDATE users SET email_verified = TRUE, verification_token = NULL, "
                "verification_token_expires = NULL WHERE username = %s",
                (username,),
            )
        else:
            conn = _sqlite_conn()
            conn.execute(
                "UPDATE users SET email_verified = 1, verification_token = NULL, "
                "verification_token_expires = NULL WHERE username = ?",
                (username,),
            )
            conn.commit()
            conn.close()

    # ── Meta (Facebook) token ──

    @staticmethod
    def set_meta_token(username, token):
        if _use_postgres():
            User._pg_execute(
                "UPDATE users SET meta_access_token = %s WHERE username = %s",
                (token, username),
            )
        else:
            conn = _sqlite_conn()
            conn.execute(
                "UPDATE users SET meta_access_token = ? WHERE username = ?",
                (token, username),
            )
            conn.commit()
            conn.close()

    @staticmethod
    def get_meta_token(username):
        user = User.find_by_username(username)
        return (user or {}).get("meta_access_token")
