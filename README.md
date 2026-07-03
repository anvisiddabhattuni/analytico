# Analytico

Analytico helps social media managers and creators understand their Facebook Page analytics and grow their accounts. React frontend + Flask API, with an AI assistant (GrowthBot) powered by Anthropic.

## Quick Start (Local)

### Backend

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python run.py
```

API: `http://localhost:5001`

The backend uses SQLite (`analytico.db`) by default. Set `DATABASE_URL` to use PostgreSQL instead.

### Frontend

```bash
cd my-app
npm install
cp .env.example .env
npm start
```

App: `http://localhost:3000`

## Deploy to Production

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for Render + Vercel setup.

## API Contract

See [API_CONTRACT.md](./API_CONTRACT.md).

## Project Structure

```
app/              Flask API
my-app/           React UI
render.yaml       Render deployment blueprint
DEPLOYMENT.md     Production setup guide
```

## Analytics Modes

| Mode | Use case |
|------|----------|
| `ANALYTICS_MODE=mock` | Portfolio demo (default) |
| `ANALYTICS_MODE=live` | Real Facebook Page data via Meta Graph API (requires Meta OAuth) |
