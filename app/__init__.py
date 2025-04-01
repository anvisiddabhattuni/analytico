from flask import Flask
from flask_jwt_extended import JWTManager
from flask_pymongo import PyMongo
from app.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    jwt = JWTManager(app)
    mongo = PyMongo(app)

    # Make mongo accessible globally in your app
    app.mongo = mongo

    # Register Blueprints
    from app.routes.main import main_bp
    app.register_blueprint(main_bp)

    # Register error handlers
    from app.utils.error_handler import register_error_handlers
    register_error_handlers(app)

    return app
