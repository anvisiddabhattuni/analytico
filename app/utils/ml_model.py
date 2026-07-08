import calendar
import json
import os
import re
from datetime import datetime, timedelta

_FALLBACK_RECS = [
    "Post more Reels on Thursdays — highest CTR for your audience.",
    "Respond to the top 3 comments on each post to boost engagement.",
    "Collaboration posts grew similar accounts 12% faster last quarter.",
    "Shift posting from morning to early evening for ~22% more reach.",
]


def _format_analytics(analytics):
    lines = []
    stats = analytics.get("stats", {})
    if stats:
        lines.append("Account stats: " + ", ".join(f"{k}: {v}" for k, v in stats.items()))
    for section in analytics.get("sections", []):
        items_str = ", ".join(
            f"{item['label']}: {item['value']}" for item in section.get("items", [])
        )
        lines.append(f"{section['title']}: {items_str}")
    return "\n".join(lines)


def get_recommendations(input_data):
    platform = (input_data or {}).get("platform", "facebook")
    username = (input_data or {}).get("username")
    question = (input_data or {}).get("question", "").strip() or "Give me growth tips based on my analytics."

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return _FALLBACK_RECS

    try:
        import anthropic
        from app.utils.social_api import fetch_social_media_data

        analytics = fetch_social_media_data(platform, username)
        analytics_text = _format_analytics(analytics)

        client = anthropic.Anthropic(api_key=api_key)
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=512,
            system=(
                f"You are GrowthBot, an expert social media growth advisor specializing in {platform}. "
                f"The user's current {platform} analytics:\n{analytics_text}\n\n"
                "Give concise, actionable growth advice tailored to their numbers. "
                "Respond with exactly 3 to 5 bullet points. "
                "Start each bullet with '•' on its own line. No preamble, no closing remarks."
            ),
            messages=[{"role": "user", "content": question}],
        )

        text = response.content[0].text
        bullets = [
            line.lstrip("•●-–").strip()
            for line in text.splitlines()
            if line.strip() and line.strip()[0] in "•●-–"
        ]
        return bullets if bullets else [text.strip()]

    except Exception:
        return _FALLBACK_RECS


_SCOPE_DAYS = {"day": 1, "week": 7}

_FALLBACK_TIMES = ["10:00", "13:00", "17:30"]
_FALLBACK_IDEAS = [
    "Behind-the-scenes look at how {company} gets things done.",
    "Customer spotlight — share a win or testimonial.",
    "Quick tip related to your industry that your audience can use today.",
    "Announce or tease something new coming from {company}.",
    "Repost/highlight your best-performing content from this month.",
    "Ask your audience a question to spark comments.",
    "Show the human side of {company} — team or founder story.",
]


def _scope_to_dates(scope, start_date):
    start = datetime.fromisoformat(start_date).date() if isinstance(start_date, str) else start_date
    if scope == "month":
        days_in_month = calendar.monthrange(start.year, start.month)[1]
        num_days = days_in_month - start.day + 1
    else:
        num_days = _SCOPE_DAYS.get(scope, 7)
    return [start + timedelta(days=i) for i in range(num_days)]


def _fallback_schedule(scope, start_date, company_name):
    company = company_name or "your business"
    dates = _scope_to_dates(scope, start_date)
    posts = []
    for i, d in enumerate(dates):
        idea = _FALLBACK_IDEAS[i % len(_FALLBACK_IDEAS)].format(company=company)
        posts.append({
            "date": d.isoformat(),
            "time": _FALLBACK_TIMES[i % len(_FALLBACK_TIMES)],
            "content": idea,
        })
    return posts


def _extract_json_array(text):
    match = re.search(r"\[.*\]", text, re.DOTALL)
    if not match:
        raise ValueError("No JSON array found in model response")
    return json.loads(match.group(0))


def generate_schedule(scope, start_date, platform="facebook", company_name="", objective=""):
    dates = _scope_to_dates(scope, start_date)

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return _fallback_schedule(scope, start_date, company_name)

    try:
        import anthropic

        date_list = ", ".join(d.isoformat() for d in dates)
        company_line = f"Company/brand: {company_name}\n" if company_name else ""
        objective_line = f"Their stated objective with this tool: {objective}\n" if objective else ""

        client = anthropic.Anthropic(api_key=api_key)
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2048,
            system=(
                "You are a social media content planner. Generate a posting schedule for "
                f"{platform}, one post per date, for exactly these dates: {date_list}.\n"
                f"{company_line}{objective_line}"
                "Pick a sensible posting time (HH:MM, 24h) for each date based on typical "
                f"engagement windows for {platform}. Write a short, specific content idea "
                "(1-2 sentences) tailored to the company/objective above — not generic advice.\n\n"
                "Respond with ONLY a JSON array, no prose, no markdown fences, in this exact shape:\n"
                '[{"date": "YYYY-MM-DD", "time": "HH:MM", "content": "..."}]'
            ),
            messages=[{"role": "user", "content": f"Generate the {scope} schedule."}],
        )

        text = response.content[0].text
        posts = _extract_json_array(text)

        cleaned = []
        for post in posts:
            if not isinstance(post, dict):
                continue
            d = post.get("date")
            t = post.get("time")
            c = post.get("content")
            if d and t and c:
                cleaned.append({"date": d, "time": t, "content": c})

        return cleaned if cleaned else _fallback_schedule(scope, start_date, company_name)

    except Exception:
        return _fallback_schedule(scope, start_date, company_name)
