# Unused / alternate components

## Site loaders

Two complete boot UIs share the same contract:

| Folder | Look |
|--------|------|
| `site-loader-brand/` | Display **Kaung Mon** + soft accent aura/ring + calm status |
| `site-loader-petal/` | Eight-leaf spinner + bouncing dots + fast status |

### Swap (recommended)

Edit `../site-loader.tsx` — one export line:

```ts
export { default } from "./unused/site-loader-brand/site-loader";
// export { default } from "./unused/site-loader-petal/site-loader";
```

Home / work / resume / contact keep importing `./site-loader`. No other files change.

### Contract (do not drift)

- Props: `SiteLoaderProps` from `../site-loader-types.ts` → `{ ready: boolean }`
- Scroll lock: `useLoaderScrollLock` from `../use-loader-scroll-lock.ts`
- Gate CSS: each variant CSS `@import`s `../../site-loader-gate.css`
- Root class: `.km-loader` / `.km-loader--done` (gate selectors depend on these)
