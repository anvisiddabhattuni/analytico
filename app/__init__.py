from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from app.config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, origins=app.config.get("CORS_ORIGINS", ["http://localhost:3001"]))
    JWTManager(app)

    from app.models import init_db
    init_db()

    from app.routes.main import main_bp
    from app.routes.auth import auth_bp
    from app.routes.analytics import analytics_bp
    from app.routes.recommendations import recommendations_bp
    from app.routes.reports import reports_bp
    from app.routes.meta_auth import meta_auth_bp
    from app.routes.instagram_auth import instagram_auth_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(meta_auth_bp, url_prefix="/api/auth/meta")
    app.register_blueprint(instagram_auth_bp, url_prefix="/api/auth/instagram")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    app.register_blueprint(recommendations_bp, url_prefix="/api/recommendations")
    app.register_blueprint(reports_bp, url_prefix="/api/reports")

    from app.utils.error_handler import register_error_handlers
    register_error_handlers(app)

    return app
