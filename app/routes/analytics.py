from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app.utils.social_api import fetch_social_media_data

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/', methods=['GET'])
@jwt_required()
def get_analytics():
    platform = request.args.get('platform', 'twitter')
    data = fetch_social_media_data(platform)
    return jsonify({"platform": platform, "data": data})
