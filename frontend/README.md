# Frontend apps

Container for **all** public-facing UIs. Not a single framework.

```
frontend/
  nextjs/     # Current portfolio (Next.js) — deployed on Vercel
  # later:  html/, vue/, etc.
```

Each app under this folder should be runnable on its own (own `package.json` / assets as needed).

## Current deploy

| App | Host | Root Directory |
| --- | --- | --- |
| `nextjs/` | Vercel | `frontend/nextjs` |

See [`nextjs/README.md`](nextjs/README.md) for local setup.
