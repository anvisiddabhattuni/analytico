import os

MOCK_ANALYTICS = {
    "instagram": {
        "platform": "instagram",
        "username": "@demo_creator",
        "data_source": "mock",
        "stats": {
            "posts": "247",
            "followers": "12.4K",
            "following": "521",
        },
        "stat_trends": {
            "followers": "+8.2%",
            "posts": "+3.1%",
        },
        "sections": [
            {
                "title": "General",
                "items": [
                    {"label": "Profile Views (28d)", "value": "14.2K"},
                    {"label": "Avg. Shares", "value": "845"},
                    {"label": "Avg. Saves", "value": "1.2K"},
                ],
            },
            {
                "title": "Reels",
                "items": [
                    {"label": "Avg. Views", "value": "45.2K"},
                    {"label": "Avg. Shares", "value": "320"},
                    {"label": "Avg. Saves", "value": "890"},
                ],
            },
            {
                "title": "Top Posts",
                "items": [
                    {"label": "Reel #12", "value": "48.2K views"},
                    {"label": "Story #7", "value": "21.1K views"},
                    {"label": "Post #3", "value": "9.8K likes"},
                ],
            },
        ],
    },
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
    "instagram": "facebook",
    "facebook": "facebook",
    "fb": "facebook",
}


def _analytics_mode():
    return os.environ.get("ANALYTICS_MODE", "mock").lower()


def fetch_social_media_data(platform, username=None):
    normalized = PLATFORM_ALIASES.get(platform.lower(), platform.lower())

    if _analytics_mode() == "live" and username:
        from app.utils.meta_api import fetch_meta_analytics
        live_data = fetch_meta_analytics(normalized, username)
        if live_data:
            return live_data

    data = dict(MOCK_ANALYTICS.get(normalized, MOCK_ANALYTICS["instagram"]))
    data["data_source"] = "mock"
    return data
