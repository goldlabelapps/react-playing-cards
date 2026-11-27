# Dual-Ecosystem Integration Manual

> **Developer Level**: Level 1 : Integrator & Consumer  
> **Technical Depth**: Practical (Zero deep infrastructure or systems knowledge required)  
> **Audience**: Frontend engineers and WordPress site builders integrating animations.

This document details how to integrate the compiled Flash SVG animation engine into Next.js and WordPress environments.

---

## 1. Next.js Integration

In Next.js applications, import the canonical package directly:

```bash
pnpm add modern-flash gsap
```

### Prompt-Driven Scene Usage

```tsx
'use client';

import { Flash, parsePrompt } from 'modern-flash';

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
import { Flash, type FlashHandle } from 'modern-flash';

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

## 2. WordPress Integration

Modern Flash functions as a native WordPress plugin directly from this repository (see [Hybrid Package Architecture](hybrid-package-architecture.md)), as well as supporting standalone asset enqueuing in custom themes.

### Native Plugin Activation

Clone or symlink the repository into `wp-content/plugins/modern-flash` and compile the vector bundle:

```bash
pnpm run build:bundle
```

Activate "Modern Flash" from `wp-admin/plugins.php`. The plugin automatically registers the runtime script, styles, and shortcodes.

### Declarative Stage HTML and Shortcode Output

Render stage containers with data attributes that `window.mwpFlash.autoMount()` discovers automatically:

```html
<!-- Rendered via shortcode [modern_flash prompt="Deal King of Hearts" loop="true"] -->
<div
  class="mwp-flash-stage"
  data-flash-stage="true"
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
