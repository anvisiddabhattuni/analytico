import base64
import json
import os
from urllib.parse import quote

import requests
from flask import Blueprint, jsonify, redirect, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.models import User

meta_auth_bp = Blueprint("meta_auth", __name__)

GRAPH_API = "https://graph.facebook.com/v19.0"

# pages_show_list + pages_read_engagement work without App Review in dev mode.
# instagram_manage_insights requires App Review — add back after approval.
SCOPES = ",".join([
    "pages_show_list",
    "pages_read_engagement",
])


def _app_id():
    return os.environ.get("FACEBOOK_APP_ID")


def _app_secret():
    return os.environ.get("FACEBOOK_APP_SECRET")


def _redirect_uri():
    return os.environ.get(
        "META_REDIRECT_URI",
        "http://localhost:5001/api/auth/meta/callback",
    )


def _frontend_url():
    return os.environ.get("FRONTEND_URL", "http://localhost:3001")


@meta_auth_bp.route("/start", methods=["GET"])
@jwt_required()
def meta_oauth_start():
    app_id = _app_id()
    if not app_id:
        return jsonify({"error": "Meta OAuth not configured on this server"}), 503

    identity = get_jwt_identity()
    state = base64.urlsafe_b64encode(
        json.dumps({"user": identity}).encode()
    ).decode()

    url = (
        "https://www.facebook.com/dialog/oauth"
        f"?client_id={app_id}"
        f"&redirect_uri={quote(_redirect_uri())}"
        f"&scope={SCOPES}"
        f"&state={state}"
        f"&response_type=code"
    )
    return jsonify({"url": url})


@meta_auth_bp.route("/callback", methods=["GET"])
def meta_oauth_callback():
    code = request.args.get("code")
    state = request.args.get("state", "")
    error = request.args.get("error")
    frontend = _frontend_url()

    if error or not code:
        return redirect(f"{frontend}/login?error=oauth_denied")

    try:
        state_data = json.loads(base64.urlsafe_b64decode(state.encode() + b"=="))
        username = state_data.get("user")
    except Exception:
        return redirect(f"{frontend}/login?error=invalid_state")

    app_id = _app_id()
    app_secret = _app_secret()

    # Exchange code → short-lived token
    token_url = (
        f"{GRAPH_API}/oauth/access_token"
        f"?client_id={app_id}"
        f"&redirect_uri={quote(_redirect_uri())}"
        f"&client_secret={app_secret}"
        f"&code={code}"
    )
    try:
        resp = requests.get(token_url, timeout=15)
        resp.raise_for_status()
        short_token = resp.json().get("access_token")
    except Exception:
        return redirect(f"{frontend}/login?error=token_exchange_failed")

    # Exchange short-lived → long-lived (60-day) token
    long_url = (
        f"{GRAPH_API}/oauth/access_token"
        f"?grant_type=fb_exchange_token"
        f"&client_id={app_id}"
        f"&client_secret={app_secret}"
        f"&fb_exchange_token={short_token}"
    )
    try:
        resp2 = requests.get(long_url, timeout=15)
        resp2.raise_for_status()
        long_token = resp2.json().get("access_token", short_token)
    except Exception:
        long_token = short_token

    User.set_meta_token(username, long_token)

    return redirect(f"{frontend}/loading-instagram")
