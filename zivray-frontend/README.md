# ZIVRAY — Frontend (React + Vite)

## 1. Prerequisites
- Node.js 18+
- The backend running at http://localhost:8000 (see zivray-backend/README.md)

## 2. Setup

```bash
cd zivray-frontend
npm install
cp .env.example .env     # VITE_API_BASE_URL=http://localhost:8000/api
npm run dev
```

App runs at http://localhost:5173

## 3. What's included
- **Login** (`/login`) — Patient/Doctor toggle, email/phone + password, "Forgot Password" and "Create Account" links. Styled to match the ZIVRAY reference design (cream background, maroon accents, serif logotype). The side illustrations are original CSS-drawn silhouettes, not a copy of any specific artwork — swap in your own licensed illustration file if you want an exact pixel match.
- **Dashboard** (`/`) — time-based greeting (Good morning/afternoon/evening/night), upcoming + last appointment summary.
- **Sidebar** — hamburger toggle, profile avatar + name dropdown (settings, privacy), 4 feature links (Health Vault, AI Insights, Provider Hub, Upload), Log Out at the bottom.
- **Navbar** — home icon + notification bell with a blinking dot when there are unread notifications.
- **Pages** — Medical Records (history + AI insights + upload), Appointments (book + list), Profile, Emergency alert, AI Chat assistant.

## 4. Connecting to the backend
All API calls go through `src/services/api.js`, which reads `VITE_API_BASE_URL` and attaches the JWT from `AuthContext` automatically once logged in.
