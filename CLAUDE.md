## Read the front end skill before making any frontend edits

---

# Analytico — Project Reference

## What this app is

Analytico is a social media analytics dashboard for creators and social media managers. It shows stats across Instagram, TikTok, and X in one place, and includes GrowthBot — an AI assistant that gives growth recommendations based on the user's data.

**Status:** In development. UI is complete. Backend runs with mock data. GrowthBot returns hardcoded answers. No real social API connections yet.

**Team:** Frontend (Anvi — lead, Ayush, Anvitha) · Backend (Jeevika, Simon)

---

## Running the app

- **Frontend:** `cd my-app && PORT=3001 npm start` → http://localhost:3001
- **Backend:** `USE_MEMORY_DB=true ANALYTICS_MODE=mock CORS_ORIGINS=http://localhost:3001 python run.py` → http://localhost:5001
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
- Flask + Flask-JWT-Extended + Flask-CORS
- MongoDB via Flask-PyMongo (currently bypassed by `USE_MEMORY_DB=true`)
- Blueprints: `main`, `auth`, `analytics`, `recommendations`, `reports`
- Routes prefixed: `/api/auth`, `/api/analytics`, `/api/recommendations`, `/api/reports`

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
- Dashboard card bg: `bg-[#211d32]` outer, `bg-[#261f3a]` inner
- Buttons: `PrimaryButton` (orange gradient) and `GhostButton` (glass) from `src/components/ui/Button.jsx`

---

## File Structure

```
analytico/
├── my-app/                          # React frontend
│   ├── public/index.html            # Google Fonts loaded here (Syne + DM Sans)
│   ├── tailwind.config.js
│   └── src/
│       ├── App.js                   # All routes defined here
│       ├── index.css                # .glass, .glass-input utilities
│       ├── lib/utils.js             # cn() helper
│       ├── services/                # API calls (api.js — login, register, getAnalytics)
│       ├── pages/
│       │   ├── SignUpPage.jsx       # Landing page (has own sticky nav, NO Navbar component)
│       │   ├── CreateAccountPage.jsx
│       │   ├── LoginAnalyticsPage.jsx
│       │   ├── LogInPage.jsx        # Platform select after auth
│       │   ├── InstagramLogInPage.jsx / SignTikTokPage.jsx / SignXPage.jsx
│       │   ├── LoadingPageInstagram.jsx / LoadingPageTikTok.jsx / LoadingPageX.jsx
│       │   ├── InstagramDashFree.jsx / TikTokDashboardFree.jsx / XDashboardFree.jsx
│       │   └── GrowthBotPage.jsx    # Currently returns mock answers
│       └── components/
│           ├── Navbar.jsx           # Platform switcher nav (used inside dashboard pages only)
│           ├── PlatformDashboard.jsx # Shared dashboard shell for all 3 platforms
│           └── ui/
│               ├── AnalyticoBadge.jsx      # Logo components (see below)
│               ├── Background.jsx          # Wraps all pages, adds glow + BackgroundPathsLayer
│               ├── Button.jsx              # PrimaryButton, GhostButton
│               ├── GlassCard.jsx
│               ├── animated-hero.jsx       # AnimatedHeroText — cycles growth phrases
│               ├── background-paths.jsx    # FloatingPaths + BackgroundPathsLayer (orange SVG ribbons)
│               ├── container-scroll-animation.jsx  # ContainerScroll 3D tilt on scroll
│               ├── display-cards.jsx       # Stacked skewed platform cards
│               └── expandable-tabs.jsx     # ExpandableTabs — icon tabs that expand on hover
├── app/                             # Flask backend
│   ├── __init__.py                  # App factory, blueprint registration
│   ├── config.py
│   ├── routes/
│   │   ├── auth.py                  # /api/auth/login, /api/auth/register
│   │   ├── analytics.py             # /api/analytics/<platform>
│   │   ├── recommendations.py
│   │   └── reports.py
│   └── utils/
├── run.py                           # Entry point
├── requirements.txt
├── render.yaml / Procfile           # Deployment config
└── API_CONTRACT.md                  # Frontend↔backend data contract
```

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

## Routes (App.js)

| Path | Component |
|------|-----------|
| `/` | `SignUpPage` (landing) |
| `/create-account` | `CreateAccountPage` |
| `/login-analytics` | `LoginAnalyticsPage` |
| `/login` | `LogInPage` (platform selector) |
| `/instagram-login` | `InstagramLogInPage` |
| `/tiktok-login` | `SignTikTokPage` |
| `/x-login` | `SignXPage` |
| `/loading-instagram` | `LoadingPageInstagram` |
| `/instagram-dash` | `InstagramDashFree` |
| `/tiktok-dash` | `TikTokDashboardFree` |
| `/x-dash` | `XDashboardFree` |
| `/growth-bot` | `GrowthBotPage` |

---

## What's working vs. what needs building

### Done
- Full UI (landing, auth, dashboards, GrowthBot shell)
- JWT auth flow (login/register/logout)
- Mock analytics data flowing through dashboards
- Navbar with platform ExpandableTabs
- ContainerScroll dashboard preview on landing page
- Background animated paths

### Needs building (priority order)
1. **Real database** — replace `USE_MEMORY_DB=true` with SQLite or Postgres so users persist
2. **GrowthBot AI** — connect `GrowthBotPage.jsx` to Claude API (`claude-sonnet-4-6`); pass user's platform analytics as context
3. **Per-user persistent mock analytics** — each user account should see consistent mock data
4. **Social API OAuth** — Instagram Graph API, TikTok API, X API (requires app review; do last)
5. **Production deployment** — scaffold exists in `render.yaml` / `Procfile`

---

## Key rules
- All components are `.jsx`, never `.tsx` / `.ts`
- Read the front-end skill before making UI edits
- `SignUpPage.jsx` has its own sticky `<header>` — it does NOT use `<Navbar>`
- `<Navbar>` is only used inside the authenticated dashboard pages
- Don't duplicate "Analytico" text — only one logo instance per page/view
- No payment plans, no pricing tiers — free only
- Dashboard card backgrounds: outer `bg-[#211d32]`, inner `bg-[#261f3a]`
- ContainerScroll rotation: `[12, 0]` degrees (not the default 20)
