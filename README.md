# CastBounties (prod)

Monorepo:
- `apps/web` — React 19 + Vite 6 front (deps exactly as requested).
- `apps/server` — Node server (Hono + SQLite) for prod storage & verification.

## Quick start

### 1) Server
```bash
cd apps/server
cp .env.example .env
# edit .env (API_KEY, SALT)
npm i
npm run dev   # http://localhost:8787
```

### 2) Web
```bash
cd apps/web
cp .env.example .env
# edit VITE_API_BASE (default http://localhost:8787)
npm i
npm run dev   # http://localhost:5173
```

### Deploy
- Server can run on Node 18+ (or deploy to any Node host). It's Hono on plain HTTP server.
- Web is a static SPA (Vite build).

