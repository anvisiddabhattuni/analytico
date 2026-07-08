from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.models import ScheduledPost, User
from app.utils.ml_model import generate_schedule

calendar_bp = Blueprint("calendar", __name__)


def _valid_date(value):
    try:
        datetime.fromisoformat(value)
        return True
    except (TypeError, ValueError):
        return False


@calendar_bp.route("/posts", methods=["GET"], strict_slashes=False)
@jwt_required()
def list_posts():
    username = get_jwt_identity()
    start = request.args.get("start")
    end = request.args.get("end")
    posts = ScheduledPost.list_for_user(username, start=start, end=end)
    return jsonify({"posts": posts}), 200


@calendar_bp.route("/posts", methods=["POST"], strict_slashes=False)
@jwt_required()
def create_post():
    username = get_jwt_identity()
    data = request.get_json() or {}

    scheduled_date = (data.get("date") or "").strip()
    scheduled_time = (data.get("time") or "").strip()
    content = (data.get("content") or "").strip()
    platform = (data.get("platform") or "facebook").strip()
    source = "ai" if data.get("source") == "ai" else "manual"

    if not _valid_date(scheduled_date):
        return jsonify({"message": "A valid date (YYYY-MM-DD) is required."}), 400
    if not content:
        return jsonify({"message": "Post content is required."}), 400

    post_id = ScheduledPost.create(username, scheduled_date, scheduled_time, content, platform, source)
    post = ScheduledPost.get(post_id, username)
    return jsonify(post), 201


@calendar_bp.route("/posts/<int:post_id>", methods=["PUT"])
@jwt_required()
def update_post(post_id):
    username = get_jwt_identity()
    existing = ScheduledPost.get(post_id, username)
    if not existing:
        return jsonify({"message": "Post not found."}), 404

    data = request.get_json() or {}
    scheduled_date = (data.get("date") or existing["scheduled_date"]).strip()
    scheduled_time = data.get("time", existing.get("scheduled_time") or "")
    content = (data.get("content") or existing["content"]).strip()

    if not _valid_date(scheduled_date):
        return jsonify({"message": "A valid date (YYYY-MM-DD) is required."}), 400
    if not content:
        return jsonify({"message": "Post content is required."}), 400

    ScheduledPost.update(post_id, username, scheduled_date, scheduled_time, content)
    return jsonify(ScheduledPost.get(post_id, username)), 200


@calendar_bp.route("/posts/<int:post_id>", methods=["DELETE"])
@jwt_required()
def delete_post(post_id):
    username = get_jwt_identity()
    existing = ScheduledPost.get(post_id, username)
    if not existing:
        return jsonify({"message": "Post not found."}), 404

    ScheduledPost.delete(post_id, username)
    return jsonify({"message": "Post deleted."}), 200


@calendar_bp.route("/generate", methods=["POST"], strict_slashes=False)
@jwt_required()
def generate():
    username = get_jwt_identity()
    data = request.get_json() or {}

    scope = data.get("scope", "week")
    if scope not in ("day", "week", "month"):
        return jsonify({"message": "scope must be one of: day, week, month."}), 400

    start_date = (data.get("start_date") or "").strip()
    if not _valid_date(start_date):
        return jsonify({"message": "A valid start_date (YYYY-MM-DD) is required."}), 400

    platform = (data.get("platform") or "facebook").strip()
    profile = User.get_profile(username)

    suggestions = generate_schedule(
        scope,
        start_date,
        platform=platform,
        company_name=profile["company_name"],
        objective=profile["objective"],
    )
    return jsonify({"suggestions": suggestions}), 200
