import os
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "dev-secret-key"
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY") or "jwt-secret-key"
    # Default is 15 minutes, which silently logs users out mid-session
    # (there is no refresh-token flow) — actions then fail with 401s.
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")
        if origin.strip()
    ]
    # mock = demo data | live = real Meta APIs when OAuth token exists
    ANALYTICS_MODE = os.environ.get("ANALYTICS_MODE", "mock").lower()
