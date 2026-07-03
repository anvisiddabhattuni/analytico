# Analytico API Contract

Shared contract between the React frontend (`my-app/`) and Flask backend (`app/`).

**Base URL (local):** `http://localhost:5001`

All protected routes require:

```
Authorization: Bearer <access_token>
```

---

## Auth

### `POST /api/auth/register`

Create an Analytico account. Accounts are auto-verified on creation (MVP behavior).

**Request**
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

`username` is also accepted instead of `email`.

**Responses**
- `201` — `{ "message": "Account created successfully." }`
- `400` — missing fields
- `409` — user already exists

### `POST /api/auth/login`

**Request**
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Responses**
- `200` — `{ "access_token": "<jwt>", "username": "user@example.com" }`
- `401` — invalid credentials

### `GET /api/auth/meta/start` (protected)

Returns the Meta OAuth dialog URL.

**Response `200`** — `{ "url": "https://www.facebook.com/dialog/oauth?..." }`
**Response `503`** — Meta OAuth not configured on the server

### `GET /api/auth/meta/callback`

OAuth redirect target. Exchanges the code for a long-lived token, stores it, then redirects the browser to `{FRONTEND_URL}/loading-facebook`.

---

## Analytics

### `GET /api/analytics?platform=<platform>` (protected)

**Query params:** `platform` = `facebook` (alias: `fb`). Defaults to `facebook`.

**Response `200`**
```json
{
  "platform": "facebook",
  "username": "Your Page",
  "data_source": "mock",
  "stats": {
    "page likes": "5,812",
    "followers": "6.1K",
    "posts": "342"
  },
  "stat_trends": {
    "followers": "+2.8%"
  },
  "sections": [
    {
      "title": "Reach & Impressions",
      "items": [
        { "label": "Unique Reach (28d)", "value": "14.2K" }
      ]
    }
  ]
}
```

`data_source` is `"live"` when `ANALYTICS_MODE=live` and the user has a connected Facebook Page; otherwise `"mock"`.

---

## Recommendations

### `POST /api/recommendations` (protected)

**Request**
```json
{
  "platform": "facebook",
  "question": "How do I grow my page?"
}
```

**Response `200`**
```json
{
  "recommendations": [
    "Post more Reels on Thursdays..."
  ]
}
```

---

## Reports (Phase 2)

### `POST /api/reports/generate` (protected)

**Request:** arbitrary analytics payload

**Response `200`**
```json
{
  "summary": "Report generated successfully.",
  "data_points": []
}
```
