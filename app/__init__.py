import re

from flask import Flask, request, make_response
from flask_jwt_extended import JWTManager

from app.config import Config

_VERCEL = re.compile(r"^https://[a-zA-Z0-9-]+\.vercel\.app$")
_LOCALHOST = re.compile(r"^http://localhost:\d+$")


def _origin_ok(origin, allowed):
    if not origin:
        return False
    if origin in allowed:
        return True
    if _VERCEL.match(origin) or _LOCALHOST.match(origin):
        return True
    return False


def _cors_headers(origin):
    return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
        "Access-Control-Max-Age": "86400",
    }


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    JWTManager(app)

    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            origin = request.headers.get("Origin", "")
            allowed = app.config.get("CORS_ORIGINS", ["http://localhost:3001"])
            if _origin_ok(origin, allowed):
                resp = make_response("", 204)
                for k, v in _cors_headers(origin).items():
                    resp.headers[k] = v
                return resp

    @app.after_request
    def apply_cors(response):
        origin = request.headers.get("Origin", "")
        allowed = app.config.get("CORS_ORIGINS", ["http://localhost:3001"])
        if _origin_ok(origin, allowed):
            for k, v in _cors_headers(origin).items():
                response.headers[k] = v
        return response

    from app.models import init_db
    init_db()

    from app.routes.main import main_bp
    from app.routes.auth import auth_bp
    from app.routes.analytics import analytics_bp
    from app.routes.recommendations import recommendations_bp
    from app.routes.reports import reports_bp
    from app.routes.meta_auth import meta_auth_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(meta_auth_bp, url_prefix="/api/auth/meta")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    app.register_blueprint(recommendations_bp, url_prefix="/api/recommendations")
    app.register_blueprint(reports_bp, url_prefix="/api/reports")

    from app.utils.error_handler import register_error_handlers
    register_error_handlers(app)

    return app
