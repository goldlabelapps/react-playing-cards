# Dual-Ecosystem Integration Manual

This document details how to integrate the compiled Flash SVG animation engine into Next.js and WordPress environments.

---

## 1. Next.js Integration

In Next.js applications, import the canonical package directly:

```bash
pnpm add react-playing-cards gsap
```

### Prompt-Driven Scene Usage

```tsx
'use client';

import { Flash, parsePrompt } from 'react-playing-cards';

export default function HeroBanner() {
  const scene = parsePrompt('Deal Ace of Spades with a 3D flip on dark slate stage');

  return (
    <div style={{ width: '100%', maxWidth: 800, margin: '0 auto' }}>
      <Flash
        scene={scene}
        speed={1}
        loop={true}
        autoPlay={true}
      />
    </div>
  );
}
```

### Ref-Based Playback Controls

```tsx
'use client';

import { useRef } from 'react';
import { Flash, type FlashHandle } from 'react-playing-cards';

export default function InteractivePlayer() {
  const flashRef = useRef<FlashHandle>(null);

  return (
    <div>
      <Flash ref={flashRef} movie="logo" autoPlay={false} />
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={() => flashRef.current?.play()}>Play</button>
        <button onClick={() => flashRef.current?.pause()}>Pause</button>
        <button onClick={() => flashRef.current?.restart()}>Restart</button>
      </div>
    </div>
  );
}
```

---

## 2. WordPress (mwp-flash) Integration

In Modern WordPress environments running the `mwp-flash` plugin, the compiled bundle replaces fragmented front-end scripts with a single high-assurance vector runtime.

### Enqueueing the Universal Bundle

In `mwp-flash.php` or `FlashService.php`:

```php
wp_enqueue_script(
    'mwp-flash-runtime',
    plugins_url('assets/js/flash-bundle.min.js', __FILE__),
    array(),
    '1.0.0',
    true
);
```

### Declarative Stage HTML / Shortcode Output

Render stage containers with data attributes that `window.mwpFlash.autoMount()` discovers automatically:

```html
<!-- Rendered via shortcode [mwp_flash prompt="Deal King of Hearts" loop="true"] -->
<div
  class="mwp-flash-stage"
  data-prompt="Deal King of Hearts with 3D flip on dark stage"
  data-loop="true"
  data-autoplay="true"
  data-speed="1.0"
  style="width: 100%; min-height: 380px;"
></div>
```

### Programmatic Mounting via JavaScript

```javascript
// Mount dynamically into any arbitrary DOM element
window.mwpFlash.mount(document.getElementById('my-container'), {
  prompt: 'Electric lightning surge with glowing title',
  loop: true,
  speed: 1.2,
});
```
