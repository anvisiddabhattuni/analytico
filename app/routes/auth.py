from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    # Create a new user (you can add validations later)
    User.create_user(username, password)
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    # Check if user exists and the password is correct
    user = User.find_by_username(username)
    if user and User.verify_password(user['password'], password):
        token = create_access_token(identity=username)
        return jsonify({"access_token": token}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401
