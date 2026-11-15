# Next.js portfolio app

One app under `frontend/` (siblings can be pure HTML, Vue, etc. later).

Vercel **Root Directory:** `frontend/nextjs`

Self-contained: fonts, CSS tokens, brand/media assets, and env live **in this folder**.

```
frontend/nextjs/
  app/
  assets/
  shared/
  public/
  .env.example
```

## Setup

```bash
cp .env.example .env
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Contact form

`POST /api/contact` emails via Resend when `RESEND_API_KEY` is set. Optional Turnstile keys for spam control.

## Analytics

Set `NEXT_PUBLIC_ANALYTICS_URL` to the backend origin (repo `backend/`). Omit to disable the beacon.
