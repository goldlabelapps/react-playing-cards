# React Playing Cards

Open-source vector graphics and animation engine based on the Flash concept.

Flash
A lightweight React + TypeScript library inspired by the classic Flash programming model.

This repository is intentionally being built in small steps rather than as a full port all at once. The current package is a minimal, buildable library foundation with a public Flash component, a simple stage wrapper, and a few example movie clips and GSAP-driven movie definitions.

Current status
The library currently includes:

a minimal Flash public component
a Stage rendering surface
a presentational Pingpongball MovieClip
a minimal Logo MovieClip
GSAP-backed ActionScript definitions for pingpong and logo
ActionScript lookup via a lightweight registry
a ref-based playback API (play, pause, restart)
an optional TraceMC debug overlay
strict TypeScript and a working build pipeline
This is not yet a full Flash runtime, but the package is ready to be published to npm as a buildable foundation that reflects the incremental direction described in the project goals.