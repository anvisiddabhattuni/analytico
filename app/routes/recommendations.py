from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app.utils.ml_model import get_recommendations

recommendations_bp = Blueprint('recommendations', __name__)

@recommendations_bp.route('/', methods=['POST'])
@jwt_required()
def recommendations():
    data = request.get_json()
    recs = get_recommendations(data)
    return jsonify({"recommendations": recs}), 200
