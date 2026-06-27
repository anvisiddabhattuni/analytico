import requests

from app.utils.social_api import MOCK_ANALYTICS

GRAPH_API = "https://graph.facebook.com/v19.0"
IG_GRAPH_API = "https://graph.instagram.com/v19.0"


def _fmt(value):
    if value is None:
        return "0"
    if value >= 1_000_000:
        return f"{value / 1_000_000:.1f}M"
    if value >= 1_000:
        return f"{value / 1_000:.1f}K"
    return str(value)


# ── Instagram (direct token from Instagram Login) ─────────────────────────────

def _fetch_instagram_direct(token):
    """Fetch Instagram Business/Creator profile via Instagram Login token."""
    profile_url = (
        f"{IG_GRAPH_API}/me"
        f"?fields=id,username,name,biography,followers_count,follows_count,media_count"
        f"&access_token={token}"
    )
    resp = requests.get(profile_url, timeout=15)
    resp.raise_for_status()
    p = resp.json()

    if "error" in p:
        return None

    # Top media (like_count available with instagram_business_basic)
    top_posts = []
    try:
        media_resp = requests.get(
            f"{IG_GRAPH_API}/me/media"
            f"?fields=id,media_type,like_count,comments_count,timestamp"
            f"&limit=3"
            f"&access_token={token}",
            timeout=15,
        )
        if media_resp.ok:
            for i, post in enumerate(media_resp.json().get("data", []), 1):
                likes = post.get("like_count", 0)
                top_posts.append({
                    "label": f"{post.get('media_type', 'Post').title()} #{i}",
                    "value": _fmt(likes) + " likes",
                })
    except requests.RequestException:
        pass

    return {
        "platform": "instagram",
        "username": f"@{p.get('username', 'you')}",
        "data_source": "live",
        "stats": {
            "posts": _fmt(p.get("media_count", 0)),
            "followers": _fmt(p.get("followers_count", 0)),
            "following": str(p.get("follows_count", 0)),
        },
        "stat_trends": {},
        "sections": [
            {
                "title": "Profile",
                "items": [
                    {"label": "Posts", "value": _fmt(p.get("media_count", 0))},
                    {"label": "Followers", "value": _fmt(p.get("followers_count", 0))},
                    {"label": "Following", "value": str(p.get("follows_count", 0))},
                ],
            },
            {
                "title": "Top Posts",
                "items": top_posts or [{"label": "No recent posts", "value": "—"}],
            },
        ],
    }


# ── Instagram (via Facebook Page-linked IG Business account) ──────────────────

def _fetch_instagram(token):
    """Fetch Instagram Business analytics via a Facebook user token (page-linked IG account)."""
    accounts_url = (
        f"{GRAPH_API}/me/accounts"
        f"?fields=instagram_business_account,name"
        f"&access_token={token}"
    )
    resp = requests.get(accounts_url, timeout=15)
    resp.raise_for_status()
    pages = resp.json().get("data", [])

    ig_account_id = None
    for page in pages:
        ig_account_id = (page.get("instagram_business_account") or {}).get("id")
        if ig_account_id:
            break

    if not ig_account_id:
        return None

    profile_url = (
        f"{GRAPH_API}/{ig_account_id}"
        f"?fields=username,followers_count,follows_count,media_count"
        f"&access_token={token}"
    )
    p = requests.get(profile_url, timeout=15).json()

    insights = {}
    try:
        ins_resp = requests.get(
            f"{GRAPH_API}/{ig_account_id}/insights"
            f"?metric=impressions,reach,profile_views&period=days_28"
            f"&access_token={token}",
            timeout=15,
        )
        if ins_resp.ok:
            for item in ins_resp.json().get("data", []):
                vals = item.get("values") or []
                if vals:
                    insights[item["name"]] = vals[-1].get("value", 0)
    except requests.RequestException:
        pass

    top_posts = []
    try:
        media_resp = requests.get(
            f"{GRAPH_API}/{ig_account_id}/media"
            f"?fields=like_count,comments_count,media_type,timestamp&limit=3"
            f"&access_token={token}",
            timeout=15,
        )
        if media_resp.ok:
            for i, post in enumerate(media_resp.json().get("data", []), 1):
                top_posts.append({
                    "label": f"{post.get('media_type', 'Post').title()} #{i}",
                    "value": _fmt(post.get("like_count", 0)) + " likes",
                })
    except requests.RequestException:
        pass

    return {
        "platform": "instagram",
        "username": f"@{p.get('username', 'you')}",
        "data_source": "live",
        "stats": {
            "posts": _fmt(p.get("media_count", 0)),
            "followers": _fmt(p.get("followers_count", 0)),
            "following": str(p.get("follows_count", 0)),
        },
        "stat_trends": {},
        "sections": [
            {
                "title": "General",
                "items": [
                    {"label": "Impressions (28d)", "value": _fmt(insights.get("impressions", 0))},
                    {"label": "Reach (28d)", "value": _fmt(insights.get("reach", 0))},
                    {"label": "Profile Views (28d)", "value": _fmt(insights.get("profile_views", 0))},
                ],
            },
            {
                "title": "Top Posts",
                "items": top_posts or [{"label": "No recent posts", "value": "—"}],
            },
        ],
    }


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

    if platform == "instagram":
        # Try Instagram Login token first (direct IG Business/Creator connection)
        ig_token = User.get_instagram_token(username)
        if ig_token:
            try:
                result = _fetch_instagram_direct(ig_token)
                if result:
                    return result
            except requests.RequestException:
                pass
        # Fall back to Facebook Page-linked IG account
        fb_token = User.get_meta_token(username)
        if fb_token:
            try:
                return _fetch_instagram(fb_token)
            except requests.RequestException:
                pass
        return None

    if platform == "facebook":
        token = User.get_meta_token(username)
        if not token:
            return None
        try:
            return _fetch_facebook(token)
        except requests.RequestException:
            pass
        return None

    return None
