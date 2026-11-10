---
paths:
  - "**/*.tsx"
---

# React Three Fiber (three.js)

Applies only to files that use `@react-three/fiber` or `three`.

- Anything time-based in a scene is driven from `useFrame` (with its `delta`), never from `setInterval` or
  `requestAnimationFrame`, which do not run in an XR session.
- Per-frame updates mutate refs (`mesh.current.position`), never React state.
- Scene logic that renders nothing is a hook, not a component returning `null`.
- Read non-reactive renderer state through a getter (`useThree((state) => state.get)`) instead of subscribing to it.
- Create and dispose a geometry, material or texture in the same hook (`React.useMemo` + cleanup), and mount heavy
  objects once: update them in place when props change.
- `preserveDrawingBuffer` and other costly `Canvas` options only where they are needed: they slow phones down.
- Bundle fonts and textures with the app (no CDN, see offline rules).
