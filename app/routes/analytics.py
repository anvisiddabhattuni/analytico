from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.utils.social_api import fetch_social_media_data

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("/", methods=["GET"], strict_slashes=False)
@jwt_required()
def get_analytics():
    platform = request.args.get("platform", "facebook")
    username = get_jwt_identity()
    data = fetch_social_media_data(platform, username)
    return jsonify(data)
