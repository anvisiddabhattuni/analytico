import os

MOCK_ANALYTICS = {
    "instagram": {
        "platform": "instagram",
        "username": "@instagram",
        "data_source": "mock",
        "stats": {
            "posts": "7987",
            "followers": "686M",
            "following": "161",
        },
        "sections": [
            {
                "title": "General",
                "items": [
                    {"label": "Page Viewers", "value": "12.4K"},
                    {"label": "Shares Average", "value": "845"},
                    {"label": "Saves Average", "value": "1.2K"},
                ],
            },
            {
                "title": "Reels",
                "items": [
                    {"label": "Average Views", "value": "45.2K"},
                    {"label": "Shares Average", "value": "320"},
                    {"label": "Saves Average", "value": "890"},
                ],
            },
            {
                "title": "Threads",
                "items": [
                    {"label": "Likes", "value": "5.6K"},
                    {"label": "Reposts", "value": "412"},
                    {"label": "Shares", "value": "278"},
                ],
            },
        ],
    },
    "tiktok": {
        "platform": "tiktok",
        "username": "@tiktok",
        "data_source": "mock",
        "stats": {
            "posts": "1243",
            "followers": "82.1M",
            "following": "89",
        },
        "sections": [
            {
                "title": "Content",
                "items": [
                    {"label": "Posts", "value": "1,243"},
                    {"label": "Likes", "value": "4.2M"},
                    {"label": "Views", "value": "128M"},
                    {"label": "Saves", "value": "890K"},
                    {"label": "Shares", "value": "456K"},
                ],
            },
        ],
    },
    "x": {
        "platform": "x",
        "username": "@X",
        "data_source": "mock",
        "stats": {
            "posts": "28450",
            "followers": "54.2M",
            "following": "512",
        },
        "sections": [
            {
                "title": "Engagement",
                "items": [
                    {"label": "Posts", "value": "28,450"},
                    {"label": "Shares", "value": "1.1M"},
                    {"label": "Reposts", "value": "890K"},
                    {"label": "Likes", "value": "12.4M"},
                    {"label": "Views", "value": "340M"},
                ],
            },
        ],
    },
}

PLATFORM_ALIASES = {
    "twitter": "x",
    "x": "x",
    "instagram": "instagram",
    "tiktok": "tiktok",
}


def _analytics_mode():
    return os.environ.get("ANALYTICS_MODE", "mock").lower()


def fetch_social_media_data(platform):
    normalized = PLATFORM_ALIASES.get(platform.lower(), platform.lower())

    if _analytics_mode() == "live" and normalized == "instagram":
        from app.utils.instagram_api import fetch_instagram_analytics

        return fetch_instagram_analytics()

    data = dict(MOCK_ANALYTICS.get(normalized, MOCK_ANALYTICS["instagram"]))
    data["data_source"] = "mock"
    return data
