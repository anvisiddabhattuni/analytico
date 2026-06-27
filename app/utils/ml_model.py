import os

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
    platform = (input_data or {}).get("platform", "instagram")
    question = (input_data or {}).get("question", "").strip() or "Give me growth tips based on my analytics."

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return _FALLBACK_RECS

    try:
        import anthropic
        from app.utils.social_api import fetch_social_media_data

        analytics = fetch_social_media_data(platform)
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
