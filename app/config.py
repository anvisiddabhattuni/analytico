import os

from dotenv import load_dotenv

load_dotenv()


def _env_bool(name, default="false"):
    return os.environ.get(name, default).lower() == "true"


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "dev-secret-key"
    MONGO_URI = os.environ.get("MONGO_URI") or "mongodb://localhost:27017/analytico"
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY") or "jwt-secret-key"
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")
        if origin.strip()
    ]

    # Production: false (MongoDB Atlas). Local quick-start: set true in .env
    USE_MEMORY_DB = _env_bool("USE_MEMORY_DB", "false")

    # mock = portfolio demo data | live = real APIs when credentials are set
    ANALYTICS_MODE = os.environ.get("ANALYTICS_MODE", "mock").lower()

    INSTAGRAM_ACCESS_TOKEN = os.environ.get("INSTAGRAM_ACCESS_TOKEN")
    INSTAGRAM_BUSINESS_ACCOUNT_ID = os.environ.get("INSTAGRAM_BUSINESS_ACCOUNT_ID")
