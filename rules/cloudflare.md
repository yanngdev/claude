---
paths:
  - "wrangler.jsonc"
  - "worker/**"
  - "public/_headers"
  - ".github/workflows/**"
---

# Cloudflare deployment

- Apps are deployed on Cloudflare Workers (static assets, `wrangler.jsonc`) through Cloudflare's Git integration:
  Cloudflare builds and deploys on push. GitHub Actions only run the checks; a deploy step there would deploy twice.
- No external service at runtime unless the repository's `AGENTS.md` says so. Data that goes stale is downloaded at
  build time (with a committed fallback), and a scheduled rebuild refreshes it.
- `npm run preview` (`wrangler dev`) serves `dist` with the real Cloudflare routing; use it to check headers and
  redirects.
- Secrets go in Cloudflare or GitHub secrets, not in the repository.
