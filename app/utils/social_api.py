import os

MOCK_ANALYTICS = {
    "facebook": {
        "platform": "facebook",
        "username": "Your Page",
        "data_source": "mock",
        "stats": {
            "page likes": "5,812",
            "followers": "6.1K",
            "posts": "342",
        },
        "stat_trends": {
            "page likes": "+4.5%",
            "followers": "+2.8%",
            "posts": "+1.2%",
        },
        "sections": [
            {
                "title": "Reach & Impressions",
                "items": [
                    {"label": "Unique Reach (28d)", "value": "14.2K"},
                    {"label": "Impressions (28d)", "value": "88.5K"},
                    {"label": "Profile Views", "value": "2.3K"},
                ],
            },
            {
                "title": "Engagement",
                "items": [
                    {"label": "Post Likes", "value": "3.1K"},
                    {"label": "Comments", "value": "412"},
                    {"label": "Shares", "value": "189"},
                ],
            },
            {
                "title": "Videos",
                "items": [
                    {"label": "Avg. Views", "value": "8.7K"},
                    {"label": "Watch Time", "value": "4.2 min"},
                    {"label": "Video Reach", "value": "11.4K"},
                ],
            },
        ],
    },
}

PLATFORM_ALIASES = {
    "facebook": "facebook",
    "fb": "facebook",
}


def _analytics_mode():
    return os.environ.get("ANALYTICS_MODE", "mock").lower()


def fetch_social_media_data(platform, username=None):
    normalized = PLATFORM_ALIASES.get(platform.lower(), "facebook")

    if _analytics_mode() == "live" and username:
        from app.utils.meta_api import fetch_meta_analytics
        try:
            live_data = fetch_meta_analytics(normalized, username)
        except Exception:
            # Any Graph API surprise (malformed payload, timeout) falls back to mock
            live_data = None
        if live_data:
            return live_data

    data = dict(MOCK_ANALYTICS[normalized])
    data["data_source"] = "mock"
    return data
