# AppleButton Sproing Animation

`AppleButton` (`src/themes/apple/Button.tsx`) uses a GSAP-driven squash-and-stretch spring animation ("sproing") whenever a button is rolled over, selected via keyboard navigation, pressed, or activated.

All transform motion is orchestrated through GSAP timelines in `src/themes/apple/sproing.ts`. CSS `transform` transitions and ad-hoc `@keyframes` are intentionally excluded so GSAP retains sole ownership of the button's transform matrix without competing with CSS transitions.

## Motion Phases

Each interactive transition kills any in-flight tweens on the target element (`gsap.killTweensOf(element)`) before starting, so rapid pointer sweeps across a menu stack stay crisp and never stack or jitter.

| Phase | Trigger | Function | Motion Profile |
| :--- | :--- | :--- | :--- |
| **Rollover / Select** | `onMouseEnter`, or `selected` changing from `false` to `true` | `playSproingHover(el)` | 0.06s anticipation squash (`scaleX: 1.045, scaleY: 0.96, y: -1`, `power2.out`) followed by 0.42s elastic overshoot settling at `scaleX: 1.025, scaleY: 1.025, y: -2` (`elastic.out(1.25, 0.42)`). |
| **Press** | `onMouseDown`, or `Enter` / `Space` keydown | `playSproingPress(el)` | 0.07s compression squash (`scaleX: 1.04, scaleY: 0.92, y: 1`, `power2.out`). |
| **Activate** | `onClick` | `playSproingActivate(el, settleHovered)` | 0.055s snap squash (`scaleX: 1.06, scaleY: 0.92, y: 1`, `power2.out`) followed by 0.48s elastic rebound (`elastic.out(1.4, 0.35)`) settling to hover scale if hovered/selected, or neutral (`1, 1, 0`) otherwise. |
| **Rest** | `onMouseLeave` (when not `selected`), or `selected` changing from `true` to `false` | `playSproingRest(el)` | 0.26s return to neutral (`scaleX: 1, scaleY: 1, y: 0`, `power3.out`). |

## Calibration Tokens

All timings, scales, offsets, and easing curves live in `SPROING_CONFIG` inside `src/themes/apple/sproing.ts` and are re-exported from `modern-flash/themes` and `modern-flash/themes/apple`:

```ts
import {
  AppleButton,
  SPROING_CONFIG,
  playSproingHover,
  playSproingPress,
  playSproingActivate,
  playSproingRest,
} from 'modern-flash/themes';
```

## Accessibility and Reduced Motion

Every sproing helper checks `window.matchMedia('(prefers-reduced-motion: reduce)').matches` before creating a tween. When reduced motion is active, elastic overshoot and squash-and-stretch are bypassed and the element snaps cleanly to neutral (`scaleX: 1, scaleY: 1, y: 0`).

Disabled buttons (`disabled={true}`) suppress all sproing triggers.

## Lifecycle and Ref Safety

- `AppleButton` merges its internal DOM ref with any forwarded `ref` (callback or ref object), preserving external ref access.
- On unmount, `gsap.killTweensOf(element)` cleans up active tweens so unmounted buttons never leak animation frames.
- `willChange: 'transform'` and `transformOrigin: 'center center'` keep transforms isolated to the GPU compositor.
