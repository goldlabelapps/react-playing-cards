# React Playing Cards

Open-source vector graphics and animation engine based on the Flash concept.

## Flash

A lightweight React + TypeScript library inspired by the classic Flash programming model.

This repository is intentionally being built in small steps rather than as a full port all at once. The current package is a minimal, buildable library foundation with a public Flash component, a simple stage wrapper, and a few example movie clips and GSAP-driven movie definitions.

### Current Status

The library foundation incorporates:

- A minimal Flash public component
- A Stage rendering surface
- A presentational Pingpongball MovieClip
- A minimal Logo MovieClip
- GSAP-backed ActionScript definitions for pingpong and logo
- ActionScript lookup via a lightweight registry
- A ref-based playback API (play, pause, restart)
- An optional TraceMC debug overlay
- Strict TypeScript and a working build pipeline

This is not yet a full Flash runtime, but the package is ready to be published to npm as a buildable foundation that reflects the incremental direction described in the project goals.

## Agentic Control Surface

This repository operates under an autonomous agentic control surface to enable deterministic collaboration with coding agents:

- [Agent Directives](AGENTS.md): Operational contracts, code quality gates, and surgical edit protocols.
- [Control Surface Documentation](docs/agentic-control-surface.md): Architectural specification of baseline agent controls and verification tooling.
- [Machine Discovery (`/llms.txt`)](llms.txt): Machine discovery manifest for LLMs and agent crawlers.
