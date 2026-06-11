from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_pymongo import PyMongo
from app.config import Config


def _ensure_user_indexes(mongo):
    mongo.db.users.create_index("username", unique=True)


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, origins=app.config.get("CORS_ORIGINS", ["http://localhost:3000"]))

    JWTManager(app)

    if not app.config["USE_MEMORY_DB"]:
        mongo = PyMongo(app)
        app.mongo = mongo
        with app.app_context():
            _ensure_user_indexes(mongo)
    else:
        app.mongo = None

    from app.routes.main import main_bp
    from app.routes.auth import auth_bp
    from app.routes.analytics import analytics_bp
    from app.routes.recommendations import recommendations_bp
    from app.routes.reports import reports_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    app.register_blueprint(recommendations_bp, url_prefix="/api/recommendations")
    app.register_blueprint(reports_bp, url_prefix="/api/reports")

    from app.utils.error_handler import register_error_handlers
    register_error_handlers(app)

    return app
