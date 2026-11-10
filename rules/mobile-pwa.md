---
paths:
  - "src/**"
  - "vite.config.ts"
  - "public/**"
---

# Mobile-first PWA

Applies to the repositories that are installable web apps (vite-plugin-pwa).

## Phones first

- The phone is the primary target, not an afterthought: everything visible must work at 375 px wide, by touch.
- Heights in `dvh`, `env(safe-area-inset-*)` padding on what touches a screen edge (`viewport-fit=cover`), no
  horizontal scroll.
- Touch targets of at least 40 px (44 px for close buttons).
- Never rely on hover or `dblclick`: a touch screen has neither. Use `pointer-coarse:` / `pointer-fine:` when touch
  needs its own control.
- Keep everything playable or usable with touch, mouse and, where it makes sense, keyboard.

## Offline and updates

- The app works offline once installed: code, fonts, textures and data are bundled and precached by the service
  worker. Never fetch a resource at runtime that has no offline fallback, and never load fonts or scripts from a CDN.
- `registerType: 'prompt'`: a popup offers the update when a new version is waiting and reloads on demand. Do not
  switch to `autoUpdate`.
- `public/_headers` keeps `sw.js` and `index.html` uncached on Cloudflare.
- Device storage (`localStorage`, IndexedDB) goes through one small module, under a key prefixed with the app name,
  and the app must still work when storage is unavailable.
