import base64
import hashlib
import hmac
import json
import os
import time
from urllib.parse import quote

import requests
from flask import Blueprint, current_app, jsonify, redirect, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.models import User

meta_auth_bp = Blueprint("meta_auth", __name__)

GRAPH_API = "https://graph.facebook.com/v19.0"

STATE_MAX_AGE_SECONDS = 600

# pages_show_list + pages_read_engagement work without App Review in dev mode.
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
    return os.environ.get("FRONTEND_URL", "http://localhost:3000")


def _sign(payload: bytes) -> str:
    key = current_app.config["SECRET_KEY"].encode()
    return hmac.new(key, payload, hashlib.sha256).hexdigest()


def _encode_state(username: str) -> str:
    payload = json.dumps({"user": username, "iat": int(time.time())}).encode()
    encoded = base64.urlsafe_b64encode(payload).decode().rstrip("=")
    return f"{encoded}.{_sign(payload)}"


def _decode_state(state: str):
    """Return the username from a signed state token, or None if invalid/expired."""
    try:
        encoded, sig = state.split(".", 1)
        payload = base64.urlsafe_b64decode(encoded + "=" * (-len(encoded) % 4))
        if not hmac.compare_digest(_sign(payload), sig):
            return None
        data = json.loads(payload)
        if time.time() - data.get("iat", 0) > STATE_MAX_AGE_SECONDS:
            return None
        return data.get("user")
    except Exception:
        return None


@meta_auth_bp.route("/start", methods=["GET"])
@jwt_required()
def meta_oauth_start():
    app_id = _app_id()
    if not app_id:
        return jsonify({"error": "Meta OAuth not configured on this server"}), 503

    state = _encode_state(get_jwt_identity())

    url = (
        "https://www.facebook.com/dialog/oauth"
        f"?client_id={app_id}"
        f"&redirect_uri={quote(_redirect_uri())}"
        f"&scope={SCOPES}"
        f"&state={quote(state)}"
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

    username = _decode_state(state)
    if not username or not User.find_by_username(username):
        return redirect(f"{frontend}/login?error=invalid_state")

    app_id = _app_id()
    app_secret = _app_secret()

    # Exchange code → short-lived token (POST body keeps the secret out of URLs/logs)
    try:
        resp = requests.post(
            f"{GRAPH_API}/oauth/access_token",
            data={
                "client_id": app_id,
                "redirect_uri": _redirect_uri(),
                "client_secret": app_secret,
                "code": code,
            },
            timeout=15,
        )
        resp.raise_for_status()
        short_token = resp.json().get("access_token")
    except requests.RequestException:
        short_token = None

    if not short_token:
        return redirect(f"{frontend}/login?error=token_exchange_failed")

    # Exchange short-lived → long-lived (60-day) token
    try:
        resp2 = requests.post(
            f"{GRAPH_API}/oauth/access_token",
            data={
                "grant_type": "fb_exchange_token",
                "client_id": app_id,
                "client_secret": app_secret,
                "fb_exchange_token": short_token,
            },
            timeout=15,
        )
        resp2.raise_for_status()
        long_token = resp2.json().get("access_token") or short_token
    except requests.RequestException:
        long_token = short_token

    User.set_meta_token(username, long_token)

    return redirect(f"{frontend}/loading-facebook")
