---
paths:
  - "**/*.tsx"
---

# React Three Fiber (three.js)

Applies only to files that use `@react-three/fiber` or `three`.

- Anything time-based in a scene is driven from `useFrame` (with its `delta`), not `setInterval` or
  `requestAnimationFrame`: those do not run in an XR session and drift from the render loop.
- Per-frame updates mutate refs (`mesh.current.position`), not React state: a re-render per frame drops frames
  on phones.
- Scene logic that renders nothing is a hook, not a component returning `null`.
- Read non-reactive renderer state through a getter (`useThree((state) => state.get)`) instead of subscribing to it.
- Create and dispose a geometry, material or texture in the same hook (`React.useMemo` + cleanup) to avoid GPU
  leaks, and mount heavy objects once: update them in place when props change.
- Costly `Canvas` options (`preserveDrawingBuffer`, high `dpr`, antialiasing on big scenes) only where needed:
  they slow phones down.
- Fonts and textures are bundled with the app, not loaded from a CDN (drei's default fonts included).
