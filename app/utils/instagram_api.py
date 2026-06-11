import os

import requests

from app.utils.social_api import MOCK_ANALYTICS


def _format_count(value):
    if value is None:
        return "0"
    if value >= 1_000_000:
        return f"{value / 1_000_000:.1f}M".rstrip("0").rstrip(".") + "M"
    if value >= 1_000:
        return f"{value / 1_000:.1f}K".rstrip("0").rstrip(".") + "K"
    return str(value)


def fetch_instagram_live_data():
    token = os.environ.get("INSTAGRAM_ACCESS_TOKEN")
    account_id = os.environ.get("INSTAGRAM_BUSINESS_ACCOUNT_ID")

    if not token or not account_id:
        return None

    profile_url = (
        f"https://graph.facebook.com/v19.0/{account_id}"
        f"?fields=username,followers_count,follows_count,media_count"
        f"&access_token={token}"
    )
    profile_response = requests.get(profile_url, timeout=15)
    profile_response.raise_for_status()
    profile = profile_response.json()

    insights = {}
    insights_url = (
        f"https://graph.facebook.com/v19.0/{account_id}/insights"
        f"?metric=impressions,reach,profile_views"
        f"&period=days_28"
        f"&access_token={token}"
    )
    try:
        insights_response = requests.get(insights_url, timeout=15)
        if insights_response.ok:
            for item in insights_response.json().get("data", []):
                values = item.get("values") or []
                if values:
                    insights[item["name"]] = values[-1].get("value", 0)
    except requests.RequestException:
        pass

    return {
        "platform": "instagram",
        "username": f"@{profile.get('username', 'instagram')}",
        "data_source": "live",
        "stats": {
            "posts": str(profile.get("media_count", 0)),
            "followers": _format_count(profile.get("followers_count", 0)),
            "following": str(profile.get("follows_count", 0)),
        },
        "sections": [
            {
                "title": "General",
                "items": [
                    {
                        "label": "Impressions (28d)",
                        "value": _format_count(insights.get("impressions", 0)),
                    },
                    {
                        "label": "Reach (28d)",
                        "value": _format_count(insights.get("reach", 0)),
                    },
                    {
                        "label": "Profile Views (28d)",
                        "value": _format_count(insights.get("profile_views", 0)),
                    },
                ],
            }
        ],
    }


def fetch_instagram_analytics():
    try:
        live_data = fetch_instagram_live_data()
        if live_data:
            return live_data
    except requests.RequestException:
        pass

    mock = dict(MOCK_ANALYTICS["instagram"])
    mock["data_source"] = "mock"
    return mock
