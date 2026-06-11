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

Create an Analytico account.

**Request**
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

`username` is also accepted instead of `email`.

**Responses**
- `201` — `{ "message": "User registered successfully" }`
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

---

## Analytics

### `GET /api/analytics?platform=<platform>`

**Query params:** `platform` = `instagram` | `tiktok` | `x` (aliases: `twitter` → `x`)

**Response `200`**
```json
{
  "platform": "instagram",
  "username": "@instagram",
  "data_source": "mock",
  "stats": {
    "posts": "7987",
    "followers": "686M",
    "following": "161"
  },
  "sections": [
    {
      "title": "General",
      "items": [
        { "label": "Page Viewers", "value": "12.4K" }
      ]
    }
  ]
}
```

---

## Recommendations (Phase 2)

### `POST /api/recommendations`

**Request**
```json
{
  "platform": "instagram",
  "question": "How do I grow my account?"
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

### `POST /api/reports/generate`

**Request:** arbitrary analytics payload

**Response `200`**
```json
{
  "summary": "Report generated successfully.",
  "data_points": []
}
```
