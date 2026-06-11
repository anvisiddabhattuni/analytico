# KTP-Analytico

Analytico helps social media managers and creators understand their analytics and grow their accounts. React frontend + Flask API.

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

For local dev without MongoDB, set `USE_MEMORY_DB=true` in `.env`.

### Frontend

```bash
cd my-app
npm install
cp .env.example .env
npm start
```

App: `http://localhost:3000`

## Deploy to Production

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for MongoDB Atlas + Render + Vercel setup.

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
| `ANALYTICS_MODE=live` | Real Instagram Graph API when credentials are set |
