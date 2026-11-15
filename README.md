# Kaung Mon — Portfolio

**One GitHub repo.** Folders by concern — not “one framework = the whole frontend.”

```
Kaung-Mon-Commercial-Portfolio/    ← single git remote
  frontend/                        ← all public UIs (can grow)
    nextjs/                        → Vercel (Root Directory: frontend/nextjs)
    # later: html/, vue/, …
  backend/                         → Railway (Root Directory: backend)
  docs/                            ← local notes (not deployed)
```

`frontend/` is a **container**. Today only `frontend/nextjs` exists. More stacks can sit beside it later without renaming the Next app to “frontend.”

`backend/` is the admin API + dashboard. It does not import from `frontend/`.

## Local setup

```bash
# Portfolio (Next.js)
cd frontend/nextjs && cp .env.example .env && yarn install && yarn dev
# → http://localhost:3000

# Admin (separate terminal)
cd backend && cp .env.example .env && yarn install && yarn dev
# → API http://localhost:8787 · UI http://localhost:5174
```

## CI/CD (same repo, separate pipelines)

### Vercel → `frontend/nextjs`

1. Import **this** GitHub repo in Vercel.
2. **Root Directory:** `frontend/nextjs`  
   (**Settings → Build and Deployment → Root Directory** — not under Git.)
3. Optional: enable **Skip deployment** on that same Root Directory block (skips when `frontend/nextjs` didn’t change). If you don’t see it, use **Ignored Build Step** → only build when that folder changes.
4. Env: contact keys; `NEXT_PUBLIC_ANALYTICS_URL` → Railway URL when ready.

### Railway → `backend`

1. Same GitHub repo → Railway service.
2. **Root Directory:** `backend`
3. Volume `/data` + `ANALYTICS_DB_PATH=/data/analytics.sqlite`
4. `DASHBOARD_PASSWORD`, `ANALYTICS_CORS_ORIGINS`, `NODE_ENV=production`

Details: [`backend/README.md`](backend/README.md) · [`frontend/README.md`](frontend/README.md)

## Secrets not in git

`frontend/nextjs/.env`, `backend/.env`, and `backend/data/*.sqlite` stay off GitHub.
