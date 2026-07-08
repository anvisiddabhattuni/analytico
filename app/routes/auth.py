import secrets
from datetime import datetime, timezone

from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token

from app.models import User
from app.utils.email import send_verification_email

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    username = (data.get("username") or data.get("email") or "").strip()
    password = data.get("password") or ""

    if not username or not password:
        return jsonify({"message": "Email and password are required"}), 400

    if User.find_by_username(username):
        return jsonify({"message": "An account with this email already exists"}), 409

    try:
        User.create_user(username, password)
    except ValueError:
        return jsonify({"message": "An account with this email already exists"}), 409

    User.verify_email(username)

    return jsonify({
        "message": "Account created successfully."
    }), 201


@auth_bp.route("/guest", methods=["POST"])
def guest_login():
    """Create a throwaway demo account so visitors can try the product with no signup.

    Each call gets its own account (not a shared demo user) so concurrent guests
    don't see each other's calendar entries or objective. The @demo.analytico.local
    domain marks these as disposable if we ever need to clean them up.
    """
    username = f"guest-{secrets.token_hex(8)}@demo.analytico.local"
    password = secrets.token_urlsafe(24)

    User.create_user(username, password)
    User.verify_email(username)

    token = create_access_token(identity=username)
    return jsonify({"access_token": token, "username": username, "is_guest": True}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    username = (data.get("username") or data.get("email") or "").strip()
    password = data.get("password") or ""

    if not username or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = User.find_by_username(username)
    if not user or not User.verify_password(user["password"], password):
        return jsonify({"message": "Invalid email or password"}), 401

    token = create_access_token(identity=username)
    return jsonify({"access_token": token, "username": username}), 200


@auth_bp.route("/verify/<token>", methods=["GET"])
def verify_email(token):
    user = User.find_by_verification_token(token)
    if not user:
        return jsonify({"message": "Invalid or expired verification link"}), 400

    expires_val = user.get("verification_token_expires")
    if expires_val:
        # SQLite stores ISO strings; psycopg2 returns datetime objects
        expires = expires_val if isinstance(expires_val, datetime) else datetime.fromisoformat(expires_val)
        if expires.tzinfo is None:
            expires = expires.replace(tzinfo=timezone.utc)
        if datetime.now(timezone.utc) > expires:
            return jsonify({"message": "Verification link has expired. Please sign up again."}), 400

    User.verify_email(user["username"])
    return jsonify({"message": "Email verified successfully"}), 200


@auth_bp.route("/resend-verification", methods=["POST"])
def resend_verification():
    data = request.get_json() or {}
    username = (data.get("email") or "").strip()

    user = User.find_by_username(username)
    if not user:
        # Don't reveal whether email exists
        return jsonify({"message": "If that email is registered, a new link has been sent."}), 200

    if user.get("email_verified"):
        return jsonify({"message": "This email is already verified."}), 400

    token = secrets.token_urlsafe(32)
    User.set_verification_token(username, token)
    send_verification_email(username, token)

    return jsonify({"message": "If that email is registered, a new link has been sent."}), 200
