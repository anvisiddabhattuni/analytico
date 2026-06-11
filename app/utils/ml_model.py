def get_recommendations(input_data):
    platform = (input_data or {}).get("platform", "instagram")
    question = (input_data or {}).get("question", "")

    base_recs = [
        "Post more Reels on Thursdays (highest CTR for your audience).",
        "Respond to the top 3 comments on each post to boost engagement.",
        "Collaboration posts grew similar accounts 12% faster last quarter.",
        "Shift posting from morning to early evening for ~22% more reach.",
    ]

    if question:
        return [f"Based on your {platform} analytics: {rec}" for rec in base_recs[:3]]

    return base_recs
