from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.models import User

profile_bp = Blueprint("profile", __name__)


@profile_bp.route("/", methods=["GET"], strict_slashes=False)
@jwt_required()
def get_profile():
    username = get_jwt_identity()
    return jsonify(User.get_profile(username)), 200


@profile_bp.route("/", methods=["PUT"], strict_slashes=False)
@jwt_required()
def update_profile():
    username = get_jwt_identity()
    data = request.get_json() or {}
    company_name = (data.get("company_name") or "").strip()
    objective = (data.get("objective") or "").strip()

    User.set_profile(username, company_name, objective)
    return jsonify({"company_name": company_name, "objective": objective}), 200
