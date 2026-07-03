# Analytico — Project Reference

## What this app is

Analytico is a Facebook Page analytics dashboard for creators and social media managers. It shows Page stats (reach, impressions, engagement) in one place, and includes GrowthBot — an AI assistant (Anthropic Claude) that gives growth recommendations based on the user's data.

**Status:** Facebook-only via Meta OAuth. `ANALYTICS_MODE=mock` serves demo data; `ANALYTICS_MODE=live` fetches real Page data with the user's stored Meta token. Instagram/TikTok/X support was removed.

**Team:** Frontend (Anvi — lead, Ayush, Anvitha) · Backend (Jeevika, Simon)

---

## Running the app

- **Frontend:** `cd my-app && npm start` → http://localhost:3000
- **Backend:** `python run.py` → http://localhost:5001 (SQLite `analytico.db` by default)
- All `.jsx` files (not TypeScript). Never create `.tsx` or `.ts` files.

---

## Tech Stack

### Frontend (`my-app/`)
- React 19 + React Router DOM 7, CRA / react-scripts 5
- Tailwind CSS 3 with custom theme (see `tailwind.config.js`)
- Framer Motion (`useScroll`, `useTransform`, `useInView`, `motion`, `AnimatePresence`)
- Lucide React icons
- Google Fonts: **Syne** (display/headings, 400;600;700;800) + **DM Sans** (body, 300–600)
- `cn()` utility at `src/lib/utils.js`

### Backend (`app/`)
- Flask + Flask-JWT-Extended (manual CORS handling in `app/__init__.py`)
- SQLite locally, PostgreSQL via `DATABASE_URL` in production
- Blueprints: `main`, `auth`, `meta_auth`, `analytics`, `recommendations`, `reports`
- Routes prefixed: `/api/auth`, `/api/auth/meta`, `/api/analytics`, `/api/recommendations`, `/api/reports`
- External APIs: Meta Graph API (`app/utils/meta_api.py`), Anthropic (`app/utils/ml_model.py`), Resend (`app/utils/email.py`)

---

## Design System

### Colors (tailwind.config.js)
- `bg-ink` → `#08070b` (page background)
- `bg-ink-light` → `#121119`
- `bg-ink-card` → `#15131c`
- `bg-glow-orange` → radial orange/red glow (used as page background image)
- `bg-accent-gradient` → `linear-gradient(135deg, #fb923c, #f97316, #ef4444)` (orange-to-red)

### Typography
- `font-display` → Syne (headings, logo wordmark)
- `font-sans` → DM Sans (body)

### Key CSS classes (`src/index.css`)
- `.glass` → `bg-white/5 border border-white/10 backdrop-blur-xl`
- `.glass-input` → glass pill input with orange focus ring

### Component conventions
- Glass cards: `bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl`
- Buttons: `PrimaryButton` (orange gradient) and `GhostButton` (glass) from `src/components/ui/Button.jsx`

---

## Routes (App.js)

| Path | Component |
|------|-----------|
| `/` | `SignUpPage` (landing) |
| `/create-account` | `CreateAccountPage` |
| `/login-analytics` | `LoginAnalyticsPage` |
| `/verify-email` | `VerifyEmailPage` |
| `/login` | `LogInPage` (Facebook connect intro) |
| `/meta-connect` | `MetaConnectPage` (OAuth permissions + connect) |
| `/loading-facebook` | `LoadingPageFacebook` |
| `/facebook-dash` | `FacebookDashboardFree` |
| `/growth-bot` | `GrowthBotPage` |

The Meta OAuth callback (`/api/auth/meta/callback`) redirects the browser to `{FRONTEND_URL}/loading-facebook`.

---

## Logo

- `AnalyticoBadge` → orange trajectory arrow SVG mark only (no text), used as icon
- `AnalyticoWordmark` → `<span>` with "Analytico" in Syne bold (NOT an SVG)
- `AnalyticoDisplayLogo` → full diagonal SVG (arrow + letter glyphs) for large-format only
- **Never** use `AnalyticoDisplayLogo` in navbars — the diagonal letterforms are illegible at small sizes

Logo usage pattern:
```jsx
<AnalyticoBadge className="h-6 w-6" />
<AnalyticoWordmark className="text-sm" />  {/* nav */}
<AnalyticoWordmark className="text-2xl" /> {/* auth page headers */}
```

---

## Key rules
- All components are `.jsx`, never `.tsx` / `.ts`
- Read the front-end skill before making UI edits
- `SignUpPage.jsx` has its own sticky `<header>` — it does NOT use `<Navbar>`
- `<Navbar>` is only used inside the authenticated dashboard pages
- Don't duplicate "Analytico" text — only one logo instance per page/view
- No payment plans, no pricing tiers — free only
- Registration auto-verifies emails (MVP) — after register the frontend logs the user in immediately
- ContainerScroll rotation: `[12, 0]` degrees (not the default 20)
