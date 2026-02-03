# Primtrade — Auth + Dashboard (Frontend Intern Assignment)

A full-stack web app with **React** frontend and **Node.js + Express** backend: authentication, user profile, and tasks CRUD with search and filter.

---

## Tech stack

| Layer   | Stack |
|--------|--------|
| Frontend | React 19, Vite, React Router, TailwindCSS |
| Backend  | Node.js, Express, MongoDB (Mongoose) |
| Auth     | JWT, bcrypt password hashing |
| Validation | express-validator (backend), client-side in forms |

---

## Project structure

```
Primetrade/
├── Client/          # React frontend
│   └── src/
│       ├── api/         # API client
│       ├── components/  # Layout, ProtectedRoute
│       ├── context/     # AuthContext
│       └── pages/       # Login, Signup, Dashboard, Tasks CRUD
├── Server/          # Express backend
│   ├── config/         # db.js, passport.js, redis.js
│   ├── controllers/    # authController, profileController, taskController
│   ├── middleware/     # auth, validate, errorHandler, rateLimiter, redisCache, adminAuth, multer
│   ├── models/         # userModel, taskModel, index.js
│   ├── routes/         # authRoutes, profileRoutes, taskRoutes, index.js
│   ├── utils/          # logger.js, validateUser.js
│   ├── scripts/        # seed.js
│   ├── index.js        # Entry point (Express app + server)
│   └── socket.js       # Socket.io (optional)
└── README.md
```

---

## Setup

### 1. Environment variables

**Server** — copy and edit:

```bash
cd Server
cp .env.example .env
```

Set in `.env`:

- `PORT` — e.g. `5000`
- `MONGODB_URI` — e.g. `mongodb://localhost:27017/primetrade`
- `JWT_SECRET` — strong random string (required in production)
- `JWT_EXPIRES_IN` — e.g. `7d`
- `CLIENT_ORIGIN` — e.g. `http://localhost:5173` (for CORS)

**Client** (optional):

```bash
cd Client
cp .env.example .env
```

- `VITE_API_URL` — e.g. `http://localhost:5000/api/v1` (defaults to this if unset)

### 2. Database

- Install and run **MongoDB** locally, or use MongoDB Atlas and set `MONGODB_URI` in Server `.env`.

### 3. Install dependencies

```bash
# Backend
cd Server
npm install

# Frontend
cd ../Client
npm install
```

### 4. Seed demo users (optional)

From `Server` folder:

```bash
npm run seed
```

This creates 3 users and sample tasks. Use these to log in from the Client.

---

## How to run

**Terminal 1 — Backend**

```bash
cd Server
npm run dev
```

Server runs at `http://localhost:5000`. Health check: `GET http://localhost:5000/api/health`

**Terminal 2 — Frontend**

```bash
cd Client
npm run dev
```

Frontend runs at `http://localhost:5173`. Open in browser and use Login/Signup, then Dashboard and Tasks.

---

## Demo credentials (after seed)

| Email               | Password  |
|---------------------|-----------|
| demo@primetrade.ai  | Demo123!  |
| john@example.com    | John123!  |
| jane@example.com    | Jane123!  |

---

## API overview

- Base: `http://localhost:5000/api/v1`
- Auth: `POST /auth/signup`, `POST /auth/login`
- Profile: `GET /me`, `PUT /me` (Bearer token required)
- Tasks: `GET /tasks`, `GET /tasks/:id`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id` (Bearer token required)

Query params for `GET /tasks`: `search`, `status`, `priority`, `sort`, `page`, `limit`. Response includes `pagination: { page, limit, total, totalPages }`.

**Rate limiting**: Global limit 100 req/min per IP; auth routes (signup/login) have a stricter limit (20 req per 15 min). Responses include `X-RateLimit-Limit` and `X-RateLimit-Remaining`; 429 when exceeded.

**Pagination**: Tasks list supports `page` and `limit` (max 50). The dashboard Tasks page shows "Showing X–Y of Z", per-page size (5/10/20/50), and Previous/Next.

Error responses are consistent: `{ success: false, error: { message: "..." } }`.

A **Postman collection** is in `Server/postman/Primetrade-API.json`. Import it in Postman; run **Login** first so `TOKEN` is set automatically, then use other requests. You can set `BASE_URL` to `http://localhost:5000/api/v1` in collection variables.

OpenAPI spec: `Server/openapi.yaml` (Swagger-style).

---

## Scaling for production (short note)

- **Deployment**: Run backend and frontend on a platform (e.g. Railway, Render, Vercel for frontend). Use env vars for `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN` and never commit secrets.
- **CORS**: Keep `CLIENT_ORIGIN` set to the real frontend origin in production.
- **DB**: Use a managed MongoDB (e.g. Atlas). Add indexes for `userId`, `status`, and text search on tasks if needed (see `Server/models/taskModel.js`).
- **Caching**: Add Redis for session/rate-limit or frequently read data if traffic grows.
- **Rate limiting**: Already in place (global + stricter auth limits); consider Redis-backed store for multi-instance.
- **Logging**: Replace `console` with a logger (e.g. Winston) and ship logs to a service.
- **Refresh tokens**: Optional next step for longer-lived sessions without storing JWT forever.

---

## Deliverables checklist

- [x] Frontend: React, TailwindCSS, auth + dashboard + tasks CRUD, validation, protected routes, loading/error/success UX
- [x] Backend: Node + Express, MongoDB, auth (signup/login, bcrypt, JWT), profile GET/PUT, tasks CRUD, `/api/v1` versioning, validation, error handling, rate limiting, pagination
- [x] README: tech stack, setup, run instructions, demo credentials
- [x] Short scaling note in README