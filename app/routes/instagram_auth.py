import base64
import json
import os
from urllib.parse import quote

import requests
from flask import Blueprint, jsonify, redirect, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.models import User

instagram_auth_bp = Blueprint("instagram_auth", __name__)

IG_AUTH_URL = "https://api.instagram.com/oauth/authorize"
IG_TOKEN_URL = "https://api.instagram.com/oauth/access_token"
IG_LONG_TOKEN_URL = "https://graph.instagram.com/access_token"


def _app_id():
    return os.environ.get("FACEBOOK_APP_ID", "").strip()


def _app_secret():
    return os.environ.get("FACEBOOK_APP_SECRET", "").strip()


def _redirect_uri():
    return os.environ.get(
        "INSTAGRAM_REDIRECT_URI",
        "http://localhost:5001/api/auth/instagram/callback",
    )


def _frontend_url():
    return os.environ.get("FRONTEND_URL", "http://localhost:3001")


@instagram_auth_bp.route("/start", methods=["GET"])
@jwt_required()
def instagram_oauth_start():
    app_id = _app_id()
    if not app_id:
        return jsonify({"error": "Instagram OAuth not configured"}), 503

    identity = get_jwt_identity()
    state = base64.urlsafe_b64encode(
        json.dumps({"user": identity}).encode()
    ).decode()

    url = (
        f"{IG_AUTH_URL}"
        f"?client_id={app_id}"
        f"&redirect_uri={quote(_redirect_uri())}"
        f"&scope=instagram_business_basic"
        f"&response_type=code"
        f"&state={state}"
    )
    return jsonify({"url": url})


@instagram_auth_bp.route("/callback", methods=["GET"])
def instagram_oauth_callback():
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

    # Exchange code → short-lived token (POST, form-encoded)
    try:
        resp = requests.post(IG_TOKEN_URL, data={
            "client_id": app_id,
            "client_secret": app_secret,
            "grant_type": "authorization_code",
            "redirect_uri": _redirect_uri(),
            "code": code,
        }, timeout=15)
        resp.raise_for_status()
        short_token = resp.json().get("access_token")
    except Exception:
        return redirect(f"{frontend}/login?error=token_exchange_failed")

    # Exchange short-lived → long-lived (60-day) token
    try:
        resp2 = requests.get(
            f"{IG_LONG_TOKEN_URL}"
            f"?grant_type=ig_exchange_token"
            f"&client_secret={app_secret}"
            f"&access_token={short_token}",
            timeout=15,
        )
        resp2.raise_for_status()
        long_token = resp2.json().get("access_token", short_token)
    except Exception:
        long_token = short_token

    User.set_instagram_token(username, long_token)

    return redirect(f"{frontend}/loading-instagram")
