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
            ("company_name", "TEXT"),
            ("objective", "TEXT"),
        ]:
            cur.execute(f"ALTER TABLE users ADD COLUMN IF NOT EXISTS {col} {defn}")
        cur.execute("""
            CREATE TABLE IF NOT EXISTS scheduled_posts (
                id SERIAL PRIMARY KEY,
                username TEXT NOT NULL,
                platform TEXT DEFAULT 'facebook',
                scheduled_date DATE NOT NULL,
                scheduled_time TEXT,
                content TEXT NOT NULL,
                source TEXT DEFAULT 'manual',
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        """)
        cur.execute(
            "CREATE INDEX IF NOT EXISTS idx_scheduled_posts_username_date "
            "ON scheduled_posts (username, scheduled_date)"
        )
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
            ("company_name", "TEXT"),
            ("objective", "TEXT"),
        ]:
            try:
                conn.execute(f"ALTER TABLE users ADD COLUMN {col} {defn}")
            except sqlite3.OperationalError:
                pass
        conn.execute("""
            CREATE TABLE IF NOT EXISTS scheduled_posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                platform TEXT DEFAULT 'facebook',
                scheduled_date TEXT NOT NULL,
                scheduled_time TEXT,
                content TEXT NOT NULL,
                source TEXT DEFAULT 'manual',
                created_at TEXT DEFAULT (datetime('now'))
            )
        """)
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_scheduled_posts_username_date "
            "ON scheduled_posts (username, scheduled_date)"
        )
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

    # ── Profile (company + objective) ──

    @staticmethod
    def set_profile(username, company_name, objective):
        if _use_postgres():
            User._pg_execute(
                "UPDATE users SET company_name = %s, objective = %s WHERE username = %s",
                (company_name, objective, username),
            )
        else:
            conn = _sqlite_conn()
            conn.execute(
                "UPDATE users SET company_name = ?, objective = ? WHERE username = ?",
                (company_name, objective, username),
            )
            conn.commit()
            conn.close()

    @staticmethod
    def get_profile(username):
        user = User.find_by_username(username) or {}
        return {
            "company_name": user.get("company_name") or "",
            "objective": user.get("objective") or "",
        }


# ── Scheduled post model ─────────────────────────────────────────────────────

class ScheduledPost:

    @staticmethod
    def create(username, scheduled_date, scheduled_time, content, platform="facebook", source="manual"):
        if _use_postgres():
            conn = _pg_conn()
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO scheduled_posts (username, platform, scheduled_date, scheduled_time, content, source) "
                "VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
                (username, platform, scheduled_date, scheduled_time, content, source),
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()
            return new_id
        else:
            conn = _sqlite_conn()
            cur = conn.execute(
                "INSERT INTO scheduled_posts (username, platform, scheduled_date, scheduled_time, content, source) "
                "VALUES (?, ?, ?, ?, ?, ?)",
                (username, platform, scheduled_date, scheduled_time, content, source),
            )
            conn.commit()
            new_id = cur.lastrowid
            conn.close()
            return new_id

    @staticmethod
    def list_for_user(username, start=None, end=None):
        clauses = ["username = %s" if _use_postgres() else "username = ?"]
        params = [username]
        if start:
            clauses.append("scheduled_date >= %s" if _use_postgres() else "scheduled_date >= ?")
            params.append(start)
        if end:
            clauses.append("scheduled_date <= %s" if _use_postgres() else "scheduled_date <= ?")
            params.append(end)
        where = " AND ".join(clauses)
        sql = (
            f"SELECT * FROM scheduled_posts WHERE {where} "
            "ORDER BY scheduled_date ASC, scheduled_time ASC"
        )

        if _use_postgres():
            import psycopg2.extras
            conn = _pg_conn()
            cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            cur.execute(sql, tuple(params))
            rows = [dict(r) for r in cur.fetchall()]
            cur.close()
            conn.close()
            for row in rows:
                if hasattr(row.get("scheduled_date"), "isoformat"):
                    row["scheduled_date"] = row["scheduled_date"].isoformat()
            return rows
        else:
            conn = _sqlite_conn()
            rows = [dict(r) for r in conn.execute(sql, tuple(params)).fetchall()]
            conn.close()
            return rows

    @staticmethod
    def get(post_id, username):
        if _use_postgres():
            row = User._pg_fetch_one(
                "SELECT * FROM scheduled_posts WHERE id = %s AND username = %s",
                (post_id, username),
            )
            if row and hasattr(row.get("scheduled_date"), "isoformat"):
                row["scheduled_date"] = row["scheduled_date"].isoformat()
            return row
        conn = _sqlite_conn()
        row = conn.execute(
            "SELECT * FROM scheduled_posts WHERE id = ? AND username = ?",
            (post_id, username),
        ).fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def update(post_id, username, scheduled_date, scheduled_time, content):
        if _use_postgres():
            User._pg_execute(
                "UPDATE scheduled_posts SET scheduled_date = %s, scheduled_time = %s, content = %s "
                "WHERE id = %s AND username = %s",
                (scheduled_date, scheduled_time, content, post_id, username),
            )
        else:
            conn = _sqlite_conn()
            conn.execute(
                "UPDATE scheduled_posts SET scheduled_date = ?, scheduled_time = ?, content = ? "
                "WHERE id = ? AND username = ?",
                (scheduled_date, scheduled_time, content, post_id, username),
            )
            conn.commit()
            conn.close()

    @staticmethod
    def delete(post_id, username):
        if _use_postgres():
            User._pg_execute(
                "DELETE FROM scheduled_posts WHERE id = %s AND username = %s",
                (post_id, username),
            )
        else:
            conn = _sqlite_conn()
            conn.execute(
                "DELETE FROM scheduled_posts WHERE id = ? AND username = ?",
                (post_id, username),
            )
            conn.commit()
            conn.close()
