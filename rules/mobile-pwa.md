---
paths:
  - "src/**"
  - "vite.config.ts"
  - "public/**"
---

# Mobile-first PWA

Applies to the repositories that are installable web apps (vite-plugin-pwa).

## Phones first

- The phone is the primary target: everything visible must work at 375 px wide, by touch. Check it with a phone
  viewport (Playwright `devices['Pixel 7']`) before calling a UI change done.
- Heights in `dvh` (the mobile address bar changes `vh`), `env(safe-area-inset-*)` padding on what touches a screen
  edge (`viewport-fit=cover`), no horizontal scroll.
- Touch targets of at least 40 px (44 px for close buttons).
- Do not rely on hover or `dblclick`: a touch screen has neither. Use `pointer-coarse:` / `pointer-fine:` when touch
  needs its own control.
- Keep everything usable with touch, mouse and, where it makes sense, keyboard.

## Offline and updates

- The app works offline once installed: code, fonts, textures and data are bundled and precached by the service
  worker. Do not fetch a resource at runtime that has no offline fallback, nor load fonts or scripts from a CDN.
- `registerType: 'prompt'`: a popup offers the update when a new version is waiting and reloads on demand, so a
  user is never reloaded in the middle of something. Keep it.
- `public/_headers` keeps `sw.js` and `index.html` uncached on Cloudflare, otherwise updates are not detected.
- Device storage (`localStorage`, IndexedDB) goes through one small module, under a key prefixed with the app name;
  the app still works when storage is unavailable (private browsing).
