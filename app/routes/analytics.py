from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app.utils.social_api import fetch_social_media_data

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("/", methods=["GET"], strict_slashes=False)
@jwt_required()
def get_analytics():
    platform = request.args.get("platform", "instagram")
    data = fetch_social_media_data(platform)
    return jsonify(data)
