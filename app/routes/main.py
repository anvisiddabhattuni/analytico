import os

from flask import Blueprint, jsonify

main_bp = Blueprint("main", __name__)


@main_bp.route("/")
def index():
    return {"message": "Welcome to Analytico Backend API"}


@main_bp.route("/health")
def health():
    return jsonify(
        {
            "status": "ok",
            "analytics_mode": os.environ.get("ANALYTICS_MODE", "mock"),
            "use_memory_db": os.environ.get("USE_MEMORY_DB", "false"),
        }
    )
