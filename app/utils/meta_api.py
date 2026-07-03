import requests

GRAPH_API = "https://graph.facebook.com/v19.0"


def _fmt(value):
    if value is None:
        return "0"
    if value >= 1_000_000:
        return f"{value / 1_000_000:.1f}M"
    if value >= 1_000:
        return f"{value / 1_000:.1f}K"
    return str(value)


# ── Facebook ─────────────────────────────────────────────────────────────────

def _fetch_facebook(token):
    """Fetch live Facebook Page analytics via Graph API."""
    pages_url = (
        f"{GRAPH_API}/me/accounts"
        f"?fields=id,name,fan_count,followers_count,access_token"
        f"&access_token={token}"
    )
    resp = requests.get(pages_url, timeout=15)
    resp.raise_for_status()
    pages = resp.json().get("data", [])

    if not pages:
        return None

    page = pages[0]
    page_id = page["id"]
    page_token = page.get("access_token", token)

    insights = {}
    try:
        ins_resp = requests.get(
            f"{GRAPH_API}/{page_id}/insights"
            f"?metric=page_impressions_unique,page_post_engagements,page_views_total"
            f"&period=days_28"
            f"&access_token={page_token}",
            timeout=15,
        )
        if ins_resp.ok:
            for item in ins_resp.json().get("data", []):
                vals = item.get("values") or []
                total = sum(v.get("value", 0) for v in vals if isinstance(v.get("value"), (int, float)))
                insights[item["name"]] = total
    except requests.RequestException:
        pass

    return {
        "platform": "facebook",
        "username": page.get("name", "Your Page"),
        "data_source": "live",
        "stats": {
            "page likes": _fmt(page.get("fan_count", 0)),
            "followers": _fmt(page.get("followers_count", 0)),
        },
        "stat_trends": {},
        "sections": [
            {
                "title": "Reach & Impressions",
                "items": [
                    {"label": "Unique Reach (28d)", "value": _fmt(insights.get("page_impressions_unique", 0))},
                    {"label": "Page Views (28d)", "value": _fmt(insights.get("page_views_total", 0))},
                    {"label": "Engagements (28d)", "value": _fmt(insights.get("page_post_engagements", 0))},
                ],
            },
        ],
    }


# ── Public entry point ────────────────────────────────────────────────────────

def fetch_meta_analytics(platform, username):
    from app.models import User

    if platform != "facebook":
        return None

    token = User.get_meta_token(username)
    if not token:
        return None
    try:
        return _fetch_facebook(token)
    except requests.RequestException:
        return None
