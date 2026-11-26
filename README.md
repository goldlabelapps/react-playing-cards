# React Playing Cards

Pure SVG Flash animation engine, GSAP ActionScript choreography, and natural language animation studio for React, Next.js, and WordPress.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-green.svg)](https://greensock.com/gsap/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED.svg)](compose.yaml)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage in React and Next.js](#usage-in-react-and-nextjs)
- [Usage in WordPress and HTML](#usage-in-wordpress-and-html)
- [Animation Studio](#animation-studio)
- [MovieClips and ActionScripts](#movieclips-and-actionscripts)
- [Available Scripts](#available-scripts)
- [Project Architecture](#project-architecture)
- [Documentation Index](#documentation-index)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

React Playing Cards recreates the classic Macromedia Flash authoring model using modern web standards. Instead of binary SWF files, animations run as pure vector SVG graphics driven by GreenSock (GSAP) timelines.

The library operates across two distinct environments from a single codebase:
1. **Modern React and Next.js**: Tree-shakeable ESM package exporting components, types, and hooks.
2. **WordPress and Static HTML**: Self-contained browser bundle attaching to `window.mwpFlash` with automatic DOM stage discovery for the `mwp-flash` plugin.

---

## Key Features

- **Pure Vector SVG Rendering**: Sharp vector graphics that scale infinitely to any screen resolution without raster artifacts or canvas pixelation.
- **ActionScript Timeline Architecture**: GSAP-powered motion choreographies including 3D card flips, corkscrew spins, card dealing arcs, and elastic collisions.
- **Natural Language Prompt Studio**: Chat interface that parses plain-text prompts (for example, *"Deal Ace of Spades with a 3D flip on dark stage"*) directly into animated SVG scenes.
- **Dual-Ecosystem Distribution**: ESM modules for modern bundlers alongside a zero-dependency pre-compiled browser script for WordPress and standalone HTML embeds.
- **Audio Synthesis Engine**: Web Audio API integration providing retro synthesized clicks, card slides, deals, and authentic Flash MX boot sounds without external audio assets.
- **Containerised Docker Harness**: Production-aligned Docker Compose environment serving the animation studio on port `3800`.

---

## Quick Start

### Option 1: Docker Harness (Recommended)

Run the containerised animation studio without installing local Node dependencies:

```bash
# Start the studio container
docker compose up -d

# Open the studio in your browser
open http://localhost:3800
```

### Option 2: Local Development

Run the studio locally using Node 20+ and pnpm:

```bash
# Clone the repository
git clone https://github.com/goldlabelapps/react-playing-cards.git
cd react-playing-cards

# Install dependencies
pnpm install

# Start the studio development server
pnpm studio
```

---

## Installation

### For React and Next.js Projects

Install `react-playing-cards` alongside its peer dependency `gsap`:

```bash
# Using pnpm
pnpm add react-playing-cards gsap

# Using npm
npm install react-playing-cards gsap

# Using yarn
yarn add react-playing-cards gsap
```

### For WordPress and Static HTML

Download `dist/flash-bundle.min.js` or compile it locally via `pnpm build:bundle`. Enqueue the script in your WordPress theme or plugin:

```php
wp_enqueue_script(
    'mwp-flash-runtime',
    plugins_url('assets/js/flash-bundle.min.js', __FILE__),
    array(),
    '1.0.0',
    true
);
```

---

## Usage in React and Next.js

### 1. Rendering a Pre-Built Movie

Render built-in movie animations directly using the `<Flash />` component:

```tsx
'use client';

import React from 'react';
import { Flash } from 'react-playing-cards';

export function CardTable() {
  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <Flash
        movie="playing-cards"
        color="#0B132B"
        loop={true}
        autoPlay={true}
        width="100%"
        height="500px"
      />
    </div>
  );
}
```

### 2. Prompt-Driven Scene Generation

Convert natural language prompts into animated scenes using `parsePrompt`:

```tsx
'use client';

import React from 'react';
import { Flash, parsePrompt } from 'react-playing-cards';

export function HeroBanner() {
  const scene = parsePrompt('Deal Ace of Spades with a 3D flip on dark slate stage');

  return (
    <Flash
      scene={scene}
      speed={1}
      loop={true}
      autoPlay={true}
      width="100%"
      height="400px"
    />
  );
}
```

### 3. Imperative Playback Controls

Control timelines programmatically via `React.useRef` and `FlashHandle`:

```tsx
'use client';

import React, { useRef } from 'react';
import { Flash, type FlashHandle } from 'react-playing-cards';

export function InteractiveCard() {
  const flashRef = useRef<FlashHandle>(null);

  return (
    <div>
      <Flash
        ref={flashRef}
        movie="macromedia"
        autoPlay={false}
        loop={false}
        width="100%"
        height="360px"
      />

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button onClick={() => flashRef.current?.play()}>Play</button>
        <button onClick={() => flashRef.current?.pause()}>Pause</button>
        <button onClick={() => flashRef.current?.restart()}>Restart</button>
        <button onClick={() => flashRef.current?.corkscrew?.('cw')}>Corkscrew Spin</button>
      </div>
    </div>
  );
}
```

---

## Usage in WordPress and HTML

### Declarative Auto-Mounting

The standalone browser bundle automatically discovers and mounts onto container elements matching `.mwp-flash-stage` or `[data-flash-stage="true"]`:

```html
<!-- Include bundle -->
<script src="dist/flash-bundle.min.js"></script>

<!-- Stage container discovered automatically on DOMContentLoaded -->
<div
  class="mwp-flash-stage"
  data-prompt="Deal King of Hearts with 3D flip on dark stage"
  data-loop="true"
  data-autoplay="true"
  data-speed="1.0"
  style="width: 100%; min-height: 380px;"
></div>
```

### Programmatic Mounting

Mount dynamically into any container element using `window.mwpFlash.mount`:

```javascript
const targetElement = document.getElementById('hero-stage');

const instance = window.mwpFlash.mount(targetElement, {
  prompt: 'Electric lightning surge with glowing title',
  loop: true,
  speed: 1.2,
  color: '#0B132B',
});

// Clean up when destroying the view
// instance.destroy();
```

---

## Animation Studio

The interactive studio enables prompt authoring, stage scrub controls, sound playback, and real-time vector inspection:

```bash
# Launch via pnpm
pnpm studio

# Or launch via Docker
docker compose up -d
```

Navigate to `http://localhost:3800`:
- **Natural Language Chat**: Enter prompts such as *"Deal blackjack hand with flip on emerald table"* to preview generated scenes.
- **Stage Scrubber**: Play, pause, seek, and loop animations at varying speed multipliers.
- **Sound Toggle**: Hear synthesised card slides, flips, chips, and retro Macromedia audio cues.
- **Movie Switcher**: Browse pre-built movie templates and inspect raw SVG markup.

---

## MovieClips and ActionScripts

### Built-in MovieClips

MovieClips are modular vector components rendered inside the `<Stage />`:

| MovieClip | Description |
| :--- | :--- |
| `PlayingCards` | Comprehensive standard card deck with vector suits, ranks, face art, and card backs. |
| `Blackjack` | Complete felt table layout with dealer tray, shoe, and betting circles. |
| `Macromedia` | Retro Flash MX interface, loader, and brand assets. |
| `LightningBolt` | Multi-node procedural electric arcs with SVG glow filters. |
| `Logo` | Scalable Goldlabel brand mark with animated vector strokes. |
| `Pingpongball` | Vector ball with motion trail and squash-and-stretch geometry. |
| `Sprite` | Pixel-art character sprite runner supporting walk and jump sequences. |
| `Typography` | High-assurance scalable vector heading and text elements. |

### Built-in ActionScripts

ActionScripts are GreenSock timeline choreographies registered in the engine:

| ActionScript | Movement and Dynamics |
| :--- | :--- |
| `corkscrew` | 3D helical rotation along z and x axes with configurable direction (`cw` or `ccw`). |
| `deal` | Parabolic dealing arc from shoe position to player table slot. |
| `flip` | 3D card rotation along y axis revealing card face from card back. |
| `lightning` | High-frequency discharge with opacity flickering and filter displacement. |
| `loading` | Authentic Flash progress bar with percentage counter and spinning loader. |
| `logo` | Elastic scale entrance with spring damping. |
| `macromedia` | Complete Flash MX boot sequence with sound synchronization. |
| `pingpong` | High-speed ball bounce with elastic wall collisions. |
| `sprite` | Frame-by-frame sprite sheet stepper and walk cycles. |
| `twist` | Elastic coordinate shearing and 2D bounce oscillation. |

### Custom ActionScript Registration

Register bespoke timeline animations using `registerActionScript`:

```typescript
import { registerActionScript } from 'react-playing-cards';
import { gsap } from 'gsap';

registerActionScript('elasticBounce', ({ target, loop, onComplete, speed = 1 }) => {
  const tl = gsap.timeline({ repeat: loop ? -1 : 0, onComplete });
  tl.timeScale(speed);
  tl.fromTo(
    target,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
  );
  return tl;
});
```

---

## Available Scripts

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Starts the local Vite development server. |
| `pnpm studio` | Launches the interactive animation studio on port `3800`. |
| `pnpm build` | Compiles the ESM library and generates TypeScript declarations in `dist/`. |
| `pnpm build:bundle` | Compiles the standalone WordPress browser bundle (`dist/flash-bundle.min.js`). |
| `pnpm type-check` | Runs the TypeScript compiler to verify type safety across the repository. |
| `pnpm test` | Runs the Wolfpack hygiene and security gate (`scripts/verify-hygiene.py`). |

---

## Project Architecture

```
react-playing-cards/
├── assets/                  # Brand iconography and vector graphics
├── docs/                    # Technical manuals and architectural specifications
│   ├── agentic-control-surface.md
│   ├── docker-harness.md
│   └── dual-ecosystem-integration.md
├── scripts/                 # Security verification runners and git hooks
│   ├── setup-hooks.sh
│   └── verify-hygiene.py
├── src/                     # Core library implementation
│   ├── ActionScript/        # GSAP timeline factories
│   ├── MovieClips/          # SVG vector components (Cards, Blackjack, etc.)
│   ├── PromptEngine/        # Natural language prompt parser
│   ├── Sound/               # Web Audio API retro sound synthesis
│   ├── Flash.tsx            # Main public component
│   ├── Stage.tsx            # SVG container surface
│   ├── bundle-entry.ts      # WordPress standalone bundle entrypoint
│   ├── index.ts             # Library exports
│   └── types.ts             # TypeScript definitions
├── studio/                  # Interactive studio application
├── AGENTS.md                # Autonomous agent operating directives
├── compose.yaml             # Docker Compose specification for port 3800
├── Dockerfile               # Production container build
├── llms.txt                 # Machine discovery index for coding agents
├── llms-full.txt            # Complete concatenated technical documentation
└── package.json             # Package manifest and workspace scripts
```

---

## Documentation Index

- [Docker Harness Specification](docs/docker-harness.md): Container architecture, port bindings, and operational commands.
- [Dual-Ecosystem Integration](docs/dual-ecosystem-integration.md): Step-by-step setup guides for Next.js and WordPress environments.
- [Agentic Control Surface](docs/agentic-control-surface.md): Quality gates, secret scans, and verification tooling.
- [Agent Directives](AGENTS.md): Wolfpack operating directives and code quality standards.
- [Machine Discovery Index](llms.txt): Machine discovery index for coding agents and LLMs.
- [Complete Documentation Corpus](llms-full.txt): Concatenated documentation corpus.

---

## Contributing

Contributions are welcome. Please ensure that all contributions follow the repository standards:

1. Maintain pure vector SVG graphics without external raster assets.
2. Adhere to British English spelling and grammar across code comments and documentation.
3. Write targeted tests or verification steps for modified files.
4. Pass the repository hygiene and security gate before submitting pull requests:

```bash
pnpm type-check
python3 scripts/verify-hygiene.py
```

---

## License

This project is licensed under the [MIT License](LICENSE).
