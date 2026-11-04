# Kaung Mon — Portfolio

Personal commercial portfolio built with Next.js. Visitors can pick a soft audience lens, switch color themes (Young Night + recent Pantone Colors of the Year), and toggle day/night chrome.

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4
- Shared fonts/images under `shared/`

## Setup

```bash
cd nextjs
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project layout

```
nextjs/          App Router site (Vercel Root Directory)
shared/          Fonts, CSS tokens
assets/          Brand / media source files imported by the app
```

## Deploy (Vercel)

CI/CD is the **Vercel ↔ GitHub** integration (no GitHub Actions required). Each push to the linked branch builds and deploys; PRs get preview URLs.

1. Open [vercel.com/new](https://vercel.com/new) and import `DanDemos/Kaung-Mon-Commercial-Portfolio`.
2. Set **Root Directory** to `nextjs` (Edit → select `nextjs`).
3. Keep **Include source files outside of the Root Directory** enabled (needed for `shared/` + `assets/`).
4. Framework preset: Next.js. Install/build come from `nextjs/vercel.json` (`yarn install` / `yarn build`).
5. Under **Git → Production Branch**, set the branch you want live (currently `idea` if that is your working branch; otherwise `main` after merge).
6. Deploy. Later pushes to that branch auto-deploy production; other branches / PRs get previews.

Local CLI (optional, from **repo root**):

```bash
npx vercel link    # choose Root Directory ./nextjs
npx vercel         # preview
npx vercel --prod  # production
```

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `yarn dev`     | Development server       |
| `yarn build`   | Production build         |
| `yarn start`   | Serve production build   |
| `yarn lint`    | ESLint                   |
