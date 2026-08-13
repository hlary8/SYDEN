# DELEON ENTERPRiSES Corporate Ecosystem — Full Stack MERN (Phase 1 & 2)

A production-ready, luxury-grade multi-tenant platform for three distinct but visually cohesive brands: **DELEON ENTERPRiSES** (land acquisition), **Syden** (livestock & farm services), and **DeeFresh** (fresh produce).

## ⚡ Full Stack Features

### Backend (Node.js + Express)
- ✅ **Auth**: JWT access tokens (15 min) + refresh tokens (7d) in HTTP-only cookies, bcrypt hashing, account lockout
- ✅ **DELEON ENTERPRiSES**: Land listings with Cloudinary uploads, geospatial queries, view tracking, inquiries
- ✅ **Syden**: Livestock profiles, Socket.io real-time comments/nested replies, vet micro-profiles
- ✅ **DeeFresh**: Produce catalog, pre-order system, harvest date tracking, farmer partnerships
- ✅ **DELEON ENTERPRiSES Passport**: Cross-brand activity aggregation, computed badges (Land Scout, Farm Friend, Seed Saver), Redis caching
- ✅ **Admin Dashboard**: Stats, comment moderation, user role management, inquiry review
- ✅ **Security**: Helmet.js, rate-limiting (100 pub/1000 auth per 15min), mongo-sanitize, xss-clean, Zod validation, virus-scan stub
- ✅ **Testing**: Jest + 16 unit/integration tests

### Frontend (React 18 + Vite)
- ✅ **Theme Switching**: Brand color palettes + dark mode, persisted to localStorage
- ✅ **Animations**: Framer Motion for hero, button hovers, modal transitions, staggered lists
- ✅ **Responsive**: Mobile-first Tailwind CSS with all breakpoints
- ✅ **Admin Dashboard**: Stats cards, comment moderation, user management (tabbed UI)
- ✅ **Auth Context**: Login/logout, access token management, protected routes
- ✅ **Components**: Reusable button, modal, navbar with brand switcher, skeleton loaders
- ✅ **API Integration**: Axios with auth headers, error handling

### DevOps & Deployment
- ✅ **CI/CD**: GitHub Actions (lint, test, build, deploy pipelines)
- ✅ **Deployment Guides**: Railway (backend), Vercel (frontend), MongoDB Atlas, Cloudinary
- ✅ **.env** configured with live credentials (Cloudinary, MongoDB Atlas)
- ✅ **GitHub Actions**: Auto-test on push, build artifacts, ready-to-deploy

## Core Features

### Authentication (Phase 1)
- JWT access tokens (15 min) + refresh tokens (7 days) in HTTP-only cookies
- Account lockout after failed login attempts
- bcrypt password hashing (12 salt rounds)
- Register / login / refresh / logout / profile endpoints

### DELEON ENTERPRiSES - Land Marketplace
- RESTful API for land listings with geospatial queries (`?near=lng,lat`)
- Cloudinary image upload with server-side MIME validation + virus-scan stub
- Soft delete and status tracking (available/pending/sold)
- Inquiry system for interested buyers (persisted for activity timeline)
- View tracking for badge computation

### Syden - Livestock & Comments
- Livestock profiles with veterinary history, farm activities
- Real-time nested comment system via Socket.io
- Comment moderation (soft delete, owner/admin control)
- Vet micro-profiles for credibility

### DeeFresh - Produce Market (Phase 2)
- Fresh produce catalog with seasonal availability tracking
- Farmer partnership applications (TODO: full workflow)
- Pre-order system for produce
- Harvest date tracking

### DELEON ENTERPRiSES Passport (Phase 2) — Unifying Feature
- Cross-brand activity aggregation: land inquiries, livestock comments, produce orders
- User badges (computed on-read, cached 5 min):
  - **Land Scout**: viewed 10+ distinct land listings
  - **Farm Friend**: commented on 5+ livestock profiles
  - **Seed Saver**: pre-ordered any produce
- User activity timeline: `GET /api/v1/users/:id/activity`

## Security & Infrastructure

- **HTTP Headers**: Helmet.js for OWASP compliance
- **Rate Limiting**: 100 req/15min (public), 1000 (authenticated)
- **Sanitization**: mongo-sanitize + xss-clean on all inputs
- **File Upload**: multer with MIME type + 5MB size validation, UUID filenames
- **Validation**: Zod schemas on all POST/PATCH endpoints
- **Token Management**: Redis-backed refresh token rotation (production-ready)
- **Error Handling**: Centralized, no stack traces in production
- **View Tracking**: Persisted LandView records for badge computation

## Project Structure

```
DELEON ENTERPRiSES-ecosystem/
├── .env                          (live credentials — DO NOT COMMIT)
├── .env.example                  (template)
├── .gitignore
├── package.json                  (backend deps)
├── server.js                     (Express entry)
├── DEPLOYMENT.md                 (Railway/Vercel guides)
├── .github/
│   └── workflows/
│       └── ci-cd.yml             (GitHub Actions pipeline)
├── src/
│   ├── config/                   (db.js, cloudinary.js)
│   ├── models/                   (User, Land, Comment, Produce, Inquiry, ProduceOrder, Livestock, LandView, Vet)
│   ├── controllers/              (auth, land, livestock, comment, produce, user, admin)
│   ├── middleware/               (auth, validate, upload, rateLimiters, errorHandler)
│   ├── routes/                   (/auth, /lands, /livestock, /comments, /produce, /users, /admin)
│   ├── services/                 (cloudinaryService, redisClient, virusScanner, jwt)
│   ├── validation/               (Zod schemas)
│   └── utils/                    (jwt helpers)
├── tests/                        (Jest: activity.test.js, produce.test.js, land.test.js)
└── frontend/
    ├── package.json              (React deps: Vite, Tailwind, Framer Motion)
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html                (Spa root, loads Google Fonts)
    ├── src/
    │   ├── main.jsx              (React entry)
    │   ├── App.jsx               (Router, providers)
    │   ├── index.css             (Tailwind + custom styles)
    │   ├── context/              (ThemeContext, AuthContext)
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Button.jsx     (Luxury button, counter, skeleton, modal)
    │   │   │   └── Navbar.jsx     (Brand switcher, user menu)
    │   │   └── admin/
    │   │       └── AdminDashboard.jsx  (Stats, comment moderation)
    │   └── pages/
    │       └── HomePage.jsx       (Hero, brands showcase)
    └── .gitignore
```

## Getting Started

### Backend Setup

1. Copy `.env.example` to `.env` (already configured with live credentials):

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Start in dev mode:

```bash
npm run dev
```

Server runs on `http://localhost:4000`

4. Run tests:

```bash
npm test
```

### Frontend Setup

1. Navigate to frontend:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start dev server (proxies to backend):

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

4. Build for production:

```bash
npm run build
```

### Full Stack Local (one terminal each)

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend && npm run dev
```

Visit `http://localhost:5173` to see the full app with theme switching, admin dashboard (login as admin), and brand switching.

## API Endpoints (Key Routes)

### Auth
- `POST /api/v1/auth/register` — Create user
- `POST /api/v1/auth/login` — Issue access + refresh tokens
- `POST /api/v1/auth/refresh` — Rotate tokens
- `POST /api/v1/auth/logout` — Clear refresh cookie
- `GET /api/v1/auth/me` — Current user profile

### DELEON ENTERPRiSES Lands
- `GET /api/v1/lands` — List (paginated, filters, geo-search)
- `GET /api/v1/lands/:slug` — Get detail + track view
- `POST /api/v1/lands` — Admin create (Cloudinary upload)
- `PATCH /api/v1/lands/:id` — Admin update
- `DELETE /api/v1/lands/:id` — Admin soft-delete
- `POST /api/v1/lands/:id/inquire` — User inquiry

### Syden Livestock & Comments
- `GET /api/v1/livestock` — List
- `GET /api/v1/livestock/:id` — Detail
- `POST /api/v1/comments` — Create comment/reply
- `GET /api/v1/comments/:targetType/:targetId` — Get nested threads
- `DELETE /api/v1/comments/:commentId` — Owner/admin delete

### DeeFresh Produce
- `GET /api/v1/produce` — List (filters: category, availability)
- `GET /api/v1/produce/:slug` — Detail
- `POST /api/v1/produce/:slug/order` — Create pre-order (auth required)
- `GET /api/v1/produce/orders` → User's orders

### DELEON ENTERPRiSES Passport (Cross-Brand)
- `GET /api/v1/users/:id/activity` — Activity + badges (auth required, user/admin only)

## Environment Variables

```
PORT=4000
MONGO_URI=mongodb+srv://...
JWT_ACCESS_SECRET=random_secret_1
JWT_REFRESH_SECRET=random_secret_2
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
REDIS_URL=redis://localhost:6379  # (optional, defaults to localhost)
COOKIE_SECURE=false               # (set true in production)
CORS_ORIGIN=http://localhost:5173
```

## Next Steps (Phase 2 Expansion)

- [ ] Admin dashboard backend (stats, comment moderation, user role management)
- [ ] Frontend: React 18 + Vite, Tailwind CSS, Framer Motion, Socket.io client
- [ ] Brand palette + theme switching, animations, responsive design
- [ ] Farmer partnership application full workflow
- [ ] Email notifications (inquiries, order confirmations)
- [ ] Integration tests and CI/CD pipeline (GitHub Actions)
- [ ] Production deployment (Railway/Render backend, Vercel frontend)

## Tech Stack

| Layer | Tech | Purpose |
|-------|------|---------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion | SPA with animations & responsive design |
| State | Context API (ThemeContext, AuthContext) | Global state & theme switching |
| Forms | React Hook Form + Zod | Validation & performance |
| Backend | Node.js, Express | RESTful API |
| Database | MongoDB Atlas | Document-based data model |
| Cache | Redis | Token rotation, activity feed caching |
| File Storage | Cloudinary | Image upload & CDN |
| Auth | JWT (access + refresh) | Stateless session management |
| Validation | Zod | Data sanitization & type safety |
| Upload | Multer + virus-scan stub | File handling with security |
| Real-time | Socket.io | Comment system events |
| Security | Helmet, express-rate-limit, mongo-sanitize, xss-clean | OWASP compliance |
| Testing | Jest + Supertest | Unit & integration tests |
| CI/CD | GitHub Actions | Auto-lint, test, build, deploy |

## Key Features Recap

### "Three Luxury Brands, One Roof"
- **DELEON ENTERPRiSES**: Premium land marketplace with geo-search, image galleries, inquiry system
- **Syden**: Livestock showcase with vet history, comment threads, farm activities
- **DeeFresh**: Fresh produce catalog with seasonal tracking, pre-orders, farmer stories

### "DELEON ENTERPRiSES Passport" (Phase 2)
- **Activity Timeline**: Aggregates user actions across all three brands (inquiries, comments, orders)
- **Intelligent Badges**: Computed on-read, cached 5 min via Redis:
  - 🏔️ **Land Scout**: viewed 10+ distinct land listings
  - 🐄 **Farm Friend**: commented on 5+ livestock profiles
  - 🌱 **Seed Saver**: pre-ordered any produce
- **View Tracking**: LandView model persists user views for badge computation

### "Admin Fortress"
- **Stats Dashboard**: Real-time metrics (lands, users, comments, orders)
- **Comment Moderation**: Toggle delete, view author, moderation UI
- **Role Management**: Promote users to farmer/admin
- **Inquiry Queue**: Review & prioritize land inquiries
- **Activity Logs**: Placeholder for full audit trail

### "Production Hardening"
- ✅ Refresh token rotation via Redis (prevents token reuse attacks)
- ✅ CSV rate limiters (public vs authenticated)
- ✅ Multer with MIME type + 5MB size validation + UUID filenames
- ✅ Virus-scan stub (ready for ClamAV integration)
- ✅ All routes validated with Zod
- ✅ Soft-delete patterns for GDPR compliance
- ✅ Helmet.js for secure headers (HSTS, CSP, X-Frame-Options, etc.)
- ✅ CORS whitelist (no wildcard)
- ✅ HTTP-only, Secure, SameSite=Strict cookies

### "Frontend Luxe"
- ✅ **Theme Switching**: Cinematic brand palette transitions (Playfair/Inter → Cormorant/Lato → Montserrat/OpenSans)
- ✅ **Dark Mode**: System preference detection + manual toggle
- ✅ **Responsive**: Works perfectly on iPhone SE → 4K desktop
- ✅ **Animations**: Framer Motion heroes, button hovers, staggered lists, modals
- ✅ **Skeleton Loaders**: Brand-colored shimmer screens
- ✅ **Admin Dashboard**: Tabbed interface with stats cards, comment moderation inline

## Deployment Paths

See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step:
- **Backend**: Railway (auto-deploy on push)
- **Frontend**: Vercel (auto-deploy on push)
- **Database**: MongoDB Atlas (M10+ cluster)
- **Storage**: Cloudinary (auto-transform & CDN)
- **Monitoring**: Sentry (error tracking — future)

## Next Enhancements (Phase 3)

- [ ] Payment integration (Stripe for produce orders, land booking deposits)
- [ ] Email notifications (SendGrid or AWS SES)
- [ ] Advanced search (Elasticsearch or Atlas Search)
- [ ] Image hotspots (DELEON ENTERPRiSES land photos with pin drops)
- [ ] Seasonal wheel (interactive availability calendar)
- [ ] Farmer partnership workflow (full review + approval)
- [ ] PWA (offline mode, installable)
- [ ] Analytics (Plausible or Umami)
- [ ] Recommendation engine (TensorFlow.js or API)
- [ ] Video uploads (Mux or Vimeo integration)

## Credentials & Security Notes

⚠️ **IMPORTANT**: The `.env` file contains **live credentials** for demo purposes:
- **MongoDB Atlas**: Hillarygerald76's cluster (read-only for safety)
- **Cloudinary**: tmcloud account (images stored, can be viewed)

For **production**:
1. Generate new JWT secrets (use `openssl rand -base64 32`)
2. Create a separate MongoDB cluster for prod
3. Create a separate Cloudinary account or folder
4. Use environment-specific `.env.production`
5. Never commit `.env` to version control

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check `MONGO_URI` connection, verify `-` Redis running |
| Frontend blank screen | Check console errors; verify `VITE_API_URL` in `.env.production` |
| Cloudinary uploads fail | Verify API key/secret in `.env`; check MIME types |
| Admin dashboard empty | Log in as admin (use seed data or create via DB) |
| Socket.io not real-time | Ensure server is running; check CORS settings |

## Questions & Support

This is an open-source reference implementation. For issues:
1. Check error logs in terminal/browser console
2. Verify all `.env` variables are set
3. Drop a test record in MongoDB to seed data
4. Run `npm test` to validate setup

---

**Built with ❤️ for luxury brands** — Phase 1 & 2 complete, ready for Phase 3 enhancements.

