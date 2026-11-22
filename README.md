# 🏛️ CivicSense — Intelligent Civic Issue Reporting & Management Platform

**CivicSense** (internally referred to as **CivicFix**) is a modern, full-stack civic grievance management web application built for **Bengaluru (BBMP) municipal jurisdiction**. It is built with **React 19 + Vite 8**, **Tailwind CSS v4**, **Leaflet Maps**, and **Supabase** as the live backend — enabling citizens to report infrastructure hazards, track resolution in real time, and empowering municipal authorities with intelligent dispatch and workflow management tools.

---

## 🌟 Features at a Glance

| Feature | Description |
|---|---|
| 🧙 4-Step Report Wizard | Guided issue submission with AI categorization |
| 🗺️ Interactive Map | Leaflet map with draggable pins and GPS auto-detect |
| 🤖 AI Triage Engine | Rule-based keyword classifier for category & urgency |
| 🔴 Real-time Feed | Supabase Realtime subscriptions for live updates |
| 🛡️ Admin Command Center | Kanban board, dispatch tools & work order management |
| 📊 Ward Leaderboard | Resolution rates & SLA rankings per Bengaluru ward |
| 🏅 Civic Karma System | Gamified points and badge system for civic participation |
| 🔐 Supabase Auth | Email/Password, Magic Link OTP & Demo Sign-In modes |
| 📱 Offline-First | PWA-style offline queue with auto-sync on reconnect |
| 🌙 Dark Mode | Full system-preference-aware light/dark theme support |
| 🧾 Grievance Receipt | Printable official grievance acknowledgement receipt |
| ⭐ Resolution Ratings | Citizen 5-star quality verification and feedback |

---

## 🗂️ Application Tabs

The app has four main tab views, controlled by `activeTab` in `CivicContext`:

| Tab | Component | Description |
|---|---|---|
| `feed` | `CitizenFeed.jsx` | Public grievance feed with search, filters, map and card views |
| `map` | `MapExplorer.jsx` | Full-screen interactive Leaflet map explorer |
| `wards` | `WardLeaderboard.jsx` | Ward-wise SLA performance and resolution leaderboard |
| `admin` | `AdminDashboard.jsx` | Municipal operations command dashboard |

---

## 📁 Project Structure

```
CivicSense-main/
├── index.html                        # Root HTML, Google Fonts, favicon
├── package.json                      # Project manifest & npm scripts
├── vite.config.js                    # Vite + React + Tailwind CSS v4 plugin config
├── .env.example                      # Supabase environment variable template
├── .oxlintrc.json                    # Oxlint linting configuration
├── supabase_setup.sql                # Full Supabase schema (tables, RLS, triggers, realtime)
│
├── public/
│   ├── favicon.svg                   # App favicon
│   └── icons.svg                     # Shared SVG icon sprite
│
└── src/
    ├── main.jsx                      # React entry point (mounts <App /> to #root)
    ├── App.jsx                       # Root layout shell, offline banner, modal orchestration
    ├── index.css                     # Tailwind v4 base + Leaflet overrides + animations
    │
    ├── context/
    │   ├── CivicContext.jsx          # Central app state: issues, filters, karma, notifications
    │   └── AuthContext.jsx           # Supabase auth state: user, session, profile, sign-in flows
    │
    ├── lib/
    │   └── supabaseClient.js         # Supabase client initialization & isSupabaseConfigured guard
    │
    ├── services/
    │   └── civicBackend.js           # Supabase CRUD: fetch/create/update issues & notifications
    │                                 # Realtime subscription, DB ↔ JS object conversion helpers
    │
    ├── data/
    │   └── mockIssues.js             # Realistic pre-seeded Bengaluru civic incident dataset
    │                                 # + initial municipal notifications
    │
    ├── utils/
    │   ├── triageEngine.js           # Rule-based AI: keyword → category + urgency classification
    │   ├── aiDetector.js             # Re-export shim for triageEngine (backward compat)
    │   └── geoUtils.js               # Geolocation helpers (coordinate math, address utils)
    │
    └── components/
        ├── Header.jsx                # Nav bar: tab switcher, role toggle, theme, auth bell
        ├── Footer.jsx                # Hotlines, accessibility badge, policy links
        ├── CitizenFeed.jsx           # Hero stats, search/filter bar, card/map/split view grid
        ├── InteractiveMap.jsx        # Leaflet map with custom urgency pins & popup cards
        ├── MapExplorer.jsx           # Full-screen dedicated map view with side panel
        ├── WardLeaderboard.jsx       # Ward-level SLA metrics, rankings, engineer contacts
        ├── AdminDashboard.jsx        # Kanban board, data table, emergency alerts, dept meters
        ├── AdminManageDrawer.jsx     # Dispatch drawer: reassign dept/crew, ETA, proof upload
        ├── ReportWizardModal.jsx     # 4-step issue reporting wizard (photo → map → AI → submit)
        ├── IssueDetailModal.jsx      # Full ticket detail: timeline, comments, before/after, rating
        ├── BeforeAfterSlider.jsx     # Touch/mouse draggable image comparison slider
        ├── AuthModal.jsx             # Auth modal: login / register / forgot password / demo sign-in
        ├── UserProfileModal.jsx      # Signed-in user profile editor with Karma badge display
        ├── CivicKarmaModal.jsx       # Civic Karma level, XP bar, badge showcase
        ├── ReceiptModal.jsx          # Printable grievance acknowledgement receipt with QR placeholder
        ├── NotificationDrawer.jsx    # Slide-in municipal alert notification feed
        └── ToastContainer.jsx        # Animated toast alerts (success / info / warning / error)
```

---

## 🧠 Core System Design

### State Management — `CivicContext.jsx`

A single React Context provider manages all application state with **localStorage persistence** and **Supabase backend sync**:

| State | Description |
|---|---|
| `issues` | Full list of civic issues (from Supabase or localStorage fallback) |
| `notifications` | Municipal alerts and status updates |
| `role` | Current user role: `'citizen'` or `'admin'` |
| `activeTab` | Current active view tab |
| `filter` | Search, category, urgency, status, sortBy, radiusKm |
| `userKarma` | Points, reports/endorsements/verifications count, earned badges |
| `isOnline` | PWA connectivity state |
| `offlineQueue` | Locally cached submissions awaiting backend sync |
| `isBackendConnected` | Whether Supabase is live and responding |
| `theme` | `'light'` or `'dark'` with `localStorage` persistence |

**Key actions:** `addIssue`, `upvoteIssue`, `addComment`, `updateIssueStatus`, `reassignIssue`, `submitProofOfWork`, `rateResolution`, `resetToDefaultData`, `awardKarma`

---

### Authentication — `AuthContext.jsx`

Powered by **Supabase Auth** with graceful fallback:

| Auth Method | Description |
|---|---|
| Email + Password | Standard sign-in and registration |
| Magic Link OTP | Passwordless email link login |
| Forgot Password | Supabase password reset email |
| Demo Sign-In | Instant demo personas (Citizen: Aarav Sharma / Admin: Kavitha R.) |
| Local Demo Mode | Full offline demo when Supabase is not configured |

Admin role is auto-detected from email domain (`admin`, `gov`) or `user_metadata.role`.

---

### AI Triage Engine — `triageEngine.js`

A fully client-side **rule-based classification engine** (zero external API calls):

**How it works:**
1. Tokenizes title + description text (lowercase)
2. Scores each of 6 categories against keyword dictionaries
3. Detects urgency from tiered trigger-word lists
4. Returns `{ category, urgency, confidence, detectedKeywords, reasoning, suggestedDepartment }`

| Category | Suggested Department |
|---|---|
| Infrastructure | BBMP Road Infrastructure |
| Sanitation | BBMP Solid Waste Management (SWM) |
| Electrical | BESCOM (Electricity Supply & Streetlights) |
| Water & Drainage | BWSSB (Water Supply & Sewerage) |
| Public Safety | Bengaluru Traffic Police & Road Safety |
| Parks & Recreation | BBMP Horticulture & Parks |

**Urgency levels:** `Emergency` → `High` → `Medium` → `Low`

---

### Backend Service — `civicBackend.js`

Handles all Supabase I/O with **camelCase ↔ snake_case** conversion:

- `fetchIssuesFromBackend()` — Fetches all issues; auto-seeds if table is empty
- `createIssueInBackend(issue)` — Inserts new issue row
- `updateIssueInBackend(id, issue)` — Updates existing issue row
- `fetchNotificationsFromBackend()` — Fetches notifications; auto-seeds if empty
- `markNotificationsReadInBackend()` — Bulk marks notifications as read
- `seedIssuesToBackend(issues)` — Upserts dataset to Supabase (idempotent)
- `subscribeToIssuesRealtime(callback)` — Sets up Supabase Realtime `postgres_changes` listener

All functions gracefully no-op when Supabase is not configured (`isSupabaseConfigured = false`).

---

### Civic Karma System

Citizens earn points through participation:

| Action | Points | Badge Unlocked |
|---|---|---|
| Report an issue | +50 pts | `ward_watchdog` (at 2 reports) |
| Endorse a neighbor's issue | +10 pts | `community_champion` (at 5 endorsements) |
| Verify a resolution | +30 pts | `ground_auditor` (at 1 verification) |
| — | — | `civic_sentinel` (at 5 reports) |

Level = `floor(points / 100) + 1`. Progress bar shows XP within current level.

---

### Offline Mode (PWA-style)

- Detects `navigator.onLine` on mount; listens to `window online/offline` events
- When offline: new submissions go to `offlineQueue` (persisted in `localStorage`)
- On reconnect: queued issues are flushed to Supabase backend and merged into state
- Offline alert banner shown at top of UI with pending sync count badge

---

## 🗄️ Database Schema — `supabase_setup.sql`

Three tables in `public` schema, all with **Row Level Security (RLS)** enabled:

### `profiles`
Extends `auth.users`. Auto-populated via `handle_new_user()` trigger on signup.

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | References `auth.users(id)` |
| `email` | TEXT | User email |
| `full_name` | TEXT | Display name |
| `role` | TEXT | `citizen` or `admin` |
| `department` | TEXT | Municipal department (admin only) |
| `phone` | TEXT | Contact number |
| `ward` | TEXT | Home ward (default: Central Bengaluru) |
| `karma_points` | INTEGER | Civic karma score (default: 100) |

### `issues`
Main grievance records with JSONB columns for nested data.

| Column | Type | Description |
|---|---|---|
| `id` | TEXT (PK) | Frontend-generated `'issue-' + timestamp` |
| `ticket_id` | TEXT (UNIQUE) | Human-readable `#CIVIC-XXXX` |
| `category` | TEXT | Infrastructure / Sanitation / Electrical / etc. |
| `urgency` | TEXT | Emergency / High / Medium / Low |
| `status` | TEXT | Submitted → Under Review → Assigned → In Progress → Resolved |
| `location` | JSONB | `{ lat, lng, address, neighborhood, landmark }` |
| `timeline` | JSONB | Ordered array of status change events |
| `comments` | JSONB | Community discussion thread |
| `triage_metadata` | JSONB | AI engine output `{ confidence, detectedKeywords, reasoning }` |
| `feedback` | JSONB | Citizen resolution rating `{ rating, feedbackText, isResolvedConfirmed }` |

Performance indexes on `status`, `category`, `department`, `urgency`, `reported_at`.

### `notifications`
Municipal alert feed entries.

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm or pnpm

### 1. Clone & Install

```bash
git clone https://github.com/your-org/CivicSense.git
cd CivicSense-main
npm install
```

### 2. Configure Supabase (Optional — app works without it)

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key
```

> **Without Supabase configured**, the app runs fully on localStorage with mock data and local demo accounts. No backend is required to explore all features.

### 3. Set Up Supabase Database

In the **Supabase Dashboard → SQL Editor**, run the full contents of `supabase_setup.sql`. This creates:
- `profiles`, `issues`, `notifications` tables with RLS policies
- `handle_new_user()` trigger for automatic profile creation on signup
- Realtime replication enabled for the `issues` table

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production

```bash
npm run build
npm run preview    # preview the production build locally
```

---

## 🎮 Testing the Platform

| Task | How |
|---|---|
| **Switch roles** | Click the **Citizen / Admin** toggle in the top-right header |
| **Report a hazard** | Click **"Report Issue"** → upload photo → drag map pin → type description → AI scan → submit |
| **View live map** | Switch to the **Map** tab; click any pin for a quick summary popup |
| **Before/After slider** | Open resolved ticket `#CIVIC-8340` or `#CIVIC-8290` and drag the comparison slider |
| **Admin Kanban** | Switch to **Admin Portal** and drag tickets between workflow columns |
| **Dispatch a crew** | Click **"Manage"** on any admin ticket to reassign departments, set ETA, upload proof |
| **Ward rankings** | Click the **Wards** tab to see resolution rates and SLA metrics per Bengaluru ward |
| **Demo sign-in** | Click the user icon → Sign In → **Quick Demo** to instantly load a demo citizen or official |
| **Reset data** | Click the ↺ reset icon in the header to restore the full initial Bengaluru dataset |
| **Test offline mode** | Disconnect network → submit an issue → reconnect to see auto-sync |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 (JSX, no TypeScript) |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS v4 (via `@tailwindcss/vite` plugin) |
| **Icons** | Lucide React |
| **Maps** | Leaflet 1.9 + react-leaflet |
| **Backend / DB** | Supabase (PostgreSQL + Auth + Realtime) |
| **JS Client** | @supabase/supabase-js v2 |
| **Animations** | canvas-confetti (issue submission celebration) |
| **State** | React Context API + localStorage |
| **Linting** | Oxlint (`.oxlintrc.json`) |

---

## 🎨 Design System

| Token | Value |
|---|---|
| Deep Slate Navy | `#0F172A` |
| Civic Emerald / Teal | `#0D9488` |
| Muted Warm Amber | `#F59E0B` |
| Crimson / Emergency | `#EF4444` |
| Surface Gray | `#F8FAFC` |
| Body Font | Plus Jakarta Sans |
| Monospace / Ticket IDs | JetBrains Mono |

Accessibility: WCAG 2.1 AA contrast compliance throughout.

---

## 📝 License

This project is a **College Mini Project** built for educational and demonstration purposes, targeting the Bengaluru (BBMP) municipal context.
