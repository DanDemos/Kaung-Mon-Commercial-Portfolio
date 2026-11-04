# Next.js app

App Router site for the portfolio. See the [root README](../README.md) for setup.

## Contact form

The contact section posts to `POST /api/contact` and emails `CONTACT_TO_EMAIL` via [Resend](https://resend.com).

Spam controls (stacked):

1. Honeypot field (bots that autofill every input)
2. Minimum fill time (rejects instant posts)
3. Per-IP rate limit
4. Optional [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) when env keys are set

Copy repo-root `.env.example` to `/.env` (not `nextjs/.env.local`). Next loads that shared file via `next.config.ts`. Add `RESEND_API_KEY`, and for production add Turnstile keys. On Vercel, set the same keys in the project Environment Variables UI.
