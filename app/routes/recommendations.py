from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.utils.ml_model import get_recommendations

recommendations_bp = Blueprint("recommendations", __name__)


@recommendations_bp.route("/", methods=["POST"], strict_slashes=False)
@jwt_required()
def recommendations():
    data = request.get_json() or {}
    data["username"] = get_jwt_identity()
    recs = get_recommendations(data)
    return jsonify({"recommendations": recs}), 200
