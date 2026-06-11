from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from app.models import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    username = (data.get("username") or data.get("email") or "").strip()
    password = data.get("password") or ""

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    if User.find_by_username(username):
        return jsonify({"message": "User already exists"}), 409

    try:
        User.create_user(username, password)
    except ValueError:
        return jsonify({"message": "User already exists"}), 409

    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    username = (data.get("username") or data.get("email") or "").strip()
    password = data.get("password") or ""

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    user = User.find_by_username(username)
    if user and User.verify_password(user["password"], password):
        token = create_access_token(identity=username)
        return jsonify({"access_token": token, "username": username}), 200

    return jsonify({"message": "Invalid credentials"}), 401
