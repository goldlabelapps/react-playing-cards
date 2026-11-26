# Docker Harness Specification

The Docker harness provides a containerised development environment and dual-distribution build runner for the Flash SVG animation engine.

---

## Purpose

The harness acts as the universal bridge between two divergent runtime environments:
- **Next.js World**: Modern React 18/19 applications consuming modular ESM packages.
- **WordPress World**: PHP 8.2+ environments running Gutenberg blocks and classic templates with pre-compiled browser scripts.

Running the studio inside Docker ensures that both ecosystems receive identical SVG vector assets, GSAP ActionScript choreography, and prompt-parsing behavior without local node or dependency conflicts.

---

## Configuration & Ports

The container exposes port `3800` for the interactive Flash Animation Studio:

```yaml
services:
  flash-studio:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: flash-animation-studio
    ports:
      - "3800:3800"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    restart: unless-stopped
```

---

## Operational Commands

### Launch Studio Service
Start the interactive prompt-to-SVG animation studio on `http://localhost:3800`:

```bash
docker compose up -d
```

### Build Distribution Artifacts
Compile both the ESM library bundle and the standalone WordPress bundle:

```bash
docker compose run --rm flash-studio pnpm build && pnpm build:bundle
```

### Container Shell Access
Open an interactive shell inside the container environment:

```bash
docker compose exec flash-studio sh
```

---

## Artifact Pipeline

The container compiles two distinct output formats into `dist/`:

1. **`dist/index.js` & `dist/index.d.ts`**:
   Tree-shakeable ESM module for Next.js, Vite, and npm consumers. Externalises `react`, `react-dom`, and `gsap`.
2. **`dist/flash-bundle.min.js`**:
   Self-contained browser bundle for WordPress `mwp-flash`. Bundles the runtime and attaches to `window.mwpFlash` with auto-mounting capabilities on `.mwp-flash-stage` elements.
