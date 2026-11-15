# Portfolio analytics backend

Self-contained package: **Node (Express) API** + **React (Vite) dashboard**. No Next.js. Node and React live in separate files under the same `backend/` folder.

Dashboard chrome uses a **local copy** of Young Night colors (`#121212` / `#2C7BD3`) with its own light/dark toggle (`client/theme.js`) — nothing is imported from `frontend/`.

```
backend/
  server/          # Node only (Express, SQLite, auth)
  client/          # React only (dashboard UI)
  public/          # fonts + icons for the React app
  index.html       # Vite entry
  dist/            # production React build (gitignored)
  railway.toml     # Railway build / start / healthcheck
```

## Local setup

```bash
cp .env.example .env
yarn install
yarn dev
```

- API: [http://localhost:8787](http://localhost:8787)
- React dashboard (dev): [http://localhost:5174](http://localhost:5174) — proxies `/api` to the Node server
- Production locally: `yarn build && yarn start`

## Deploy on Railway (same GitHub repo as Vercel)

Do **not** split into a second git repo. Vercel points at `frontend/nextjs/`; Railway points at `backend/` in this monorepo.

SQLite needs a **persistent volume**. Without it, every redeploy wipes visitor data.

1. Push this monorepo to GitHub.
2. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub** → pick **the same** repo Vercel uses.
3. Open the service → **Settings**:
   - **Root Directory:** `backend`
   - Generate a domain (**Networking** → Public Networking).
4. **Variables** (Settings → Variables):

   | Variable | Example |
   | --- | --- |
   | `DASHBOARD_PASSWORD` | strong password |
   | `ANALYTICS_CORS_ORIGINS` | `https://your-site.vercel.app,http://localhost:3000` |
   | `ANALYTICS_DB_PATH` | `/data/analytics.sqlite` |
   | `NODE_ENV` | `production` |

   Railway sets `PORT` for you — do not hardcode it.

5. **Volume** (service → Volumes → Add Volume):
   - Mount path: `/data`
   - Then keep `ANALYTICS_DB_PATH=/data/analytics.sqlite`

6. Deploy. Health check: `GET https://<railway-domain>/health`
7. Dashboard: `https://<railway-domain>/` (login with `DASHBOARD_PASSWORD`)

8. On **Vercel** (frontend), set:

   ```
   NEXT_PUBLIC_ANALYTICS_URL=https://<railway-domain>
   ```

   Redeploy the frontend so the beacon picks it up.

**Keep the Railway service at 1 replica** — login sessions are in-memory on that process.

## Scripts

| Command | Description |
| --- | --- |
| `yarn dev` | Node watch + Vite React |
| `yarn build` | Build React → `dist/` |
| `yarn start` | Serve API + built React |
| `yarn db:reset` | Wipe local SQLite |
