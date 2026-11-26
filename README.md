# React Playing Cards // Flash SVG Animation Studio

Open-source SVG vector graphics, GSAP ActionScript choreography, and prompt-driven animation studio inspired by the classic Flash programming model.

---

## Overview

React Playing Cards provides an SVG-based animation engine and prompt studio designed to operate across both Next.js applications and WordPress installations:

- **Prompt-to-SVG Studio**: Generates animated vector scenes directly from natural language chat directives.
- **Stage & MovieClip Architecture**: Pure SVG rendering surface supporting modular playing cards, typography, character sprites, and procedural effects.
- **ActionScript Engine**: GSAP timeline choreographer featuring corkscrew spins, 3D card flips, elastic twists, and ball rallies.
- **Docker Harness**: Universal containerised development environment serving the studio on port `3800` and compiling dual distribution bundles.
- **Dual-Ecosystem Support**: Single source of truth serving ESM modules to Next.js and standalone browser bundles to WordPress `mwp-flash`.

---

## Quick Start (Docker Harness)

The quickest way to run the prompt studio is using the Docker harness:

```bash
# Start the animation studio service
docker compose up -d

# Open in your browser
open http://localhost:3800
```

---

## Local Development & Build

```bash
# Install dependencies
pnpm install

# Start local development server
pnpm dev

# Compile distribution bundles (ESM library + standalone browser bundle)
pnpm build && pnpm build:bundle

# Run type check and hygiene gate
pnpm type-check
python3 scripts/verify-hygiene.py
```

---

## Dual Integration

### Next.js World

Install as a dependency:

```bash
pnpm add react-playing-cards gsap
```

Render prompt-driven or movie-based scenes:

```tsx
'use client';

import { Flash, parsePrompt } from 'react-playing-cards';

export default function CardHero() {
  const scene = parsePrompt('Deal Ace of Spades with a 3D flip on dark slate stage');
  return <Flash scene={scene} loop={true} autoPlay={true} />;
}
```

### WordPress World (mwp-flash)

Enqueue `dist/flash-bundle.min.js` and render stage containers with declarative attributes:

```html
<div
  class="mwp-flash-stage"
  data-prompt="Electric lightning surge with glowing title"
  data-loop="true"
  data-speed="1.0"
  style="width: 100%; min-height: 380px;"
></div>
```

---

## Documentation

- [Docker Harness Specification](docs/docker-harness.md): Container architecture, port configuration, and operational commands.
- [Dual-Ecosystem Integration](docs/dual-ecosystem-integration.md): Step-by-step guides for Next.js and WordPress setups.
- [Agentic Control Surface](docs/agentic-control-surface.md): Quality gates and verification tooling.
- [Agent Directives](AGENTS.md): Operating directives and code quality standards.
- [Machine Discovery (`/llms.txt`)](llms.txt): Machine discovery index for coding agents and LLMs.
