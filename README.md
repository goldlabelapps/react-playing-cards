# Modern Flash

SVG Flash animation engine, GSAP ActionScript choreography, and natural language animation studio for React, Next.js, and WordPress.

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

Modern Flash recreates the classic Macromedia Flash authoring model using modern web standards. Instead of binary SWF files, animations run as vector SVG graphics driven by GreenSock (GSAP) timelines.

The library operates across two distinct environments from a single codebase:
1. **Modern React and Next.js**: Tree-shakeable ESM package exporting components, types, and hooks.
2. **WordPress and Static HTML**: Self-contained browser bundle attaching to `window.mwpFlash` with automatic DOM stage discovery for the `mwp-flash` plugin.

---

## Key Features

- **Vector SVG Rendering**: Sharp vector graphics that scale infinitely to any screen resolution without raster artifacts or canvas pixelation.
- **ActionScript Timeline Architecture**: GSAP-powered motion choreographies including 3D card flips, corkscrew spins, card dealing arcs, and elastic collisions.
- **Natural Language Prompt Studio**: Chat interface that parses plain-text prompts (for example, *"Deal Ace of Spades with a 3D flip on dark stage"*) directly into animated SVG scenes.
- **Dual-Ecosystem Distribution**: ESM modules for modern bundlers alongside a zero-dependency pre-compiled browser script for WordPress and standalone HTML embeds.
- **Zero-Scroll Viewport Geometry**: Anti-scrolling architecture fitting the available viewport edge-to-edge (100vw by 100dvh) with zero padding, zero margin, and zero border-radius.
- **Audio Synthesis Engine**: Web Audio API integration providing retro synthesised clicks, card slides, deals, and authentic Flash MX boot sounds without external audio assets.
- **Containerised Docker Harness**: Production-aligned Docker Compose environment serving the animation studio on port `3800`.

---

## Live Production Showcase

Experience Modern Flash running in production:

- **Flagship Web Application (Next.js 15)**: [https://modern-flash.pro](https://modern-flash.pro)

---

## Quick Start

### Option 1: Instant Studio via Docker Hub (Fastest)

Launch the interactive animation studio with a single command without cloning the repository or installing local Node/pnpm tooling:

```bash
docker run -d --name modern-flash-studio -p 3800:3800 goldlabel2027/modern-flash-studio:latest
open http://localhost:3800
```

### Option 2: Docker Compose Harness (Full Stack)

Run the full containerised studio, Next.js web application, and live WordPress environment:

```bash
# Start studio, Next.js web app, and WordPress containers
docker compose up -d

# Studio interface (Vite + React)
open http://localhost:3800

# Flagship public web application (Next.js 15)
open http://localhost:3830

# WordPress environment with modern-flash plugin mounted
open http://localhost:3880
```

### Option 3: Local Development

Run the studio locally using Node 20+ and pnpm:

```bash
# Clone the repository
git clone https://github.com/goldlabelapps/modern-flash.git
cd modern-flash

# Install dependencies
pnpm install

# Start the studio development server
pnpm studio
```

---

## Installation

### For React and Next.js Projects

Install `modern-flash` alongside its peer dependency `gsap`:

```bash
# Using pnpm
pnpm add modern-flash gsap

# Using npm
npm install modern-flash gsap

# Using yarn
yarn add modern-flash gsap
```

### For WordPress

Modern Flash operates directly as a native WordPress plugin. Clone or symlink this repository into your WordPress plugins directory:

```bash
cd wp-content/plugins
git clone https://github.com/goldlabelapps/modern-flash.git
cd modern-flash
pnpm run build:bundle
```

Activate "Modern Flash" in WordPress Admin (`wp-admin/plugins.php`) and embed vector stages using the shortcode:

```text
[modern_flash prompt="Deal Ace of Spades with a 3D flip on dark slate stage" speed="1.2" loop="true"]
```

---

## Usage in React and Next.js

### 1. Rendering a Pre-Built Movie

Render built-in movie animations directly using the `<Flash />` component:

```tsx
'use client';

import React from 'react';
import { Flash } from 'modern-flash';

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
import { Flash, parsePrompt } from 'modern-flash';

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
import { Flash, type FlashHandle } from 'modern-flash';

export function InteractiveCard() {
  const flashRef = useRef<FlashHandle>(null);

  return (
    <div>
      <Flash
        ref={flashRef}
        movie="starwars"
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
| `StarWars` | Star Wars fighter cockpit HUD telemetry, laser fire, and starfield. |
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
| `starwars` | Star Wars cockpit HUD telemetry and flight dynamic choreography. |
| `pingpong` | High-speed ball bounce with elastic wall collisions. |
| `sprite` | Frame-by-frame sprite sheet stepper and walk cycles. |
| `twist` | Elastic coordinate shearing and 2D bounce oscillation. |

### Custom ActionScript Registration

Register bespoke timeline animations using `registerActionScript`:

```typescript
import { registerActionScript } from 'modern-flash';
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
modern-flash/
├── assets/                  # Brand iconography and vector graphics
├── docs/                    # Technical manuals and architectural specifications
│   ├── agentic-control-surface.md
│   ├── apple-button-sproing.md
│   ├── docker-distribution.md
│   ├── docker-harness.md
│   ├── dual-ecosystem-integration.md
│   ├── flagship-web-app.md
│   ├── hybrid-package-architecture.md
│   └── vm-deployment.md
├── nextjs/                  # Flagship Next.js 15 showcase application (:3830)
├── php/                     # Modern WordPress PHP classes (PSR-4)
│   ├── Plugin.php           # Core plugin orchestrator and asset enqueue
│   ├── Shortcode.php        # [modern_flash] declarative stage renderer
│   └── Admin/
│       └── SettingsController.php # Two-column settings interface
├── public/                  # Public assets, web manifests, and service worker
├── scripts/                 # Operational scripts, security verification, and git hooks
│   ├── bump-version.mjs
│   ├── setup-hooks.sh
│   ├── test-flash.py
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
├── vite/                    # Interactive Vite studio application (:3800)
├── AGENTS.md                # Autonomous agent operating directives
├── compose.yaml             # Docker Compose specification (Studio :3800 + WordPress :3880)
├── Dockerfile               # Production container build
├── llms.txt                 # Machine discovery index for coding agents
├── llms-full.txt            # Complete concatenated technical documentation
└── package.json             # Package manifest and workspace scripts
```

---

## Documentation Index

Documentation is categorised into developer levels based on technical depth and operational domain:

### Level 1: Integrator & Consumer (Zero Geek Required)
- [Dual-Ecosystem Integration](docs/dual-ecosystem-integration.md): Step-by-step setup guides for Next.js and WordPress environments.
- [Docker Distribution Specification](docs/docker-distribution.md): Public Docker Hub registry, multi-platform buildx compilation, and zero-dependency container execution.

### Level 2: Application Engineer (Practical Web Architecture)
- [AppleButton Sproing Animation](docs/apple-button-sproing.md): GSAP squash-and-stretch spring physics, motion phases, calibration tokens, and reduced-motion compliance for `AppleButton`.
- [Flagship Web Application](docs/flagship-web-app.md): Public Next.js 15 web application architecture, zero-scroll viewport geometry, Google Cloud VM deployment, and Firebase suite integration.
- [Docker Harness Specification](docs/docker-harness.md): Container harness, port bindings (`:3800`, `:3830`, `:3880`), and local operational commands.

### Level 3: Systems & Deep Infrastructure ("The Geek Tier")
- [Hybrid Package Architecture](docs/hybrid-package-architecture.md): Single-repository architecture bridging NPM and WordPress plugin distribution.
- [Virtual Machine Deployment Architecture](docs/vm-deployment.md): Google Cloud VM topology, Caddy reverse proxy, systemd services, Unix domain sockets, and MariaDB routing.
- [Agentic Control Surface](docs/agentic-control-surface.md): Quality gates, secret scans, and verification tooling.
- [Agent Directives](AGENTS.md): Wolfpack operating directives, code quality standards, and verification contracts.

### Discovery & Machine Interfaces
- [Machine Discovery Index](llms.txt): Machine discovery index for coding agents and LLMs.
- [Complete Documentation Corpus](llms-full.txt): Complete concatenated technical documentation corpus.

---

## Contributing

Contributions are welcome. Please ensure that all contributions follow the repository standards:

1. Maintain vector SVG graphics without external raster assets.
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
