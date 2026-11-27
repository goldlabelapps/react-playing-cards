# Docker Distribution Specification

> **Developer Level**: Level 1 : Integrator & Consumer  
> **Technical Depth**: Practical (Container execution without local build tooling)  
> **Audience**: Developers, evaluators, and contributors running pre-compiled studio images.

This document details the public distribution pipeline, registry configuration, and multi-architecture build procedures for the Modern Flash containerised runtime on Docker Hub.

---

## Purpose & Distribution Model

Modern Flash distributes pre-compiled container images via Docker Hub to provide an immediate, zero-dependency environment for open-source developers, contributors, and evaluators.

By using the published images:
- Developers do not require Node.js, pnpm, or local build tooling.
- SVG rendering, GSAP ActionScript choreography, and the prompt studio run identically across macOS, Linux, and Windows.
- The runtime is packaged as a self-contained binary artifact ready for immediate execution.

---

## Public Registry Coordinates

| Vector | Registry URI | Default Port | Description |
| :--- | :--- | :---: | :--- |
| **Animation Studio** | `goldlabel2027/modern-flash-studio:latest` | `3800` | Interactive prompt-driven vector studio and canvas debugger |
| **Web Flagship** | `goldlabel2027/modern-flash-web:latest` | `3830` | Next.js 15 App Router showcase application |

Official registry portal: [hub.docker.com/u/goldlabel2027](https://hub.docker.com/u/goldlabel2027)

---

## Quickstart for Open-Source Users

### 1. Standalone Animation Studio
Run the studio with a single command:

```bash
docker run -d \
  --name modern-flash-studio \
  -p 3800:3800 \
  goldlabel2027/modern-flash-studio:latest
```

Open `http://localhost:3800` in any modern web browser to access the interactive animation studio.

To halt the container:

```bash
docker stop modern-flash-studio && docker rm modern-flash-studio
```

### 2. Distributable Docker Compose File
Open-source users can also consume the published image within a lightweight `compose.yaml` without cloning the entire source repository:

```yaml
services:
  studio:
    image: goldlabel2027/modern-flash-studio:latest
    container_name: modern-flash-studio
    ports:
      - "3800:3800"
    restart: unless-stopped
```

Boot the service with:

```bash
docker compose up -d
```

---

## Multi-Architecture Publishing Pipeline

To ensure native execution speed across both Apple Silicon (ARM64) and Intel/AMD (x86_64) hardware, container images are built and pushed using Docker Buildx multi-platform manifests.

### Automated Script Runner

The repository provides an automated build and push script:

```bash
# Publish both studio and web images (defaults to version 1.0.0 and latest)
./scripts/publish-docker.sh all 1.0.0

# Publish studio only
./scripts/publish-docker.sh studio 1.0.0

# Publish flagship web only
./scripts/publish-docker.sh web 1.0.0
```

This script:
1. Verifies active Docker authentication against Docker Hub.
2. Initialises or reuses a multi-architecture `buildx` builder instance (`modern-flash-builder`).
3. Compiles native binaries for both `linux/amd64` and `linux/arm64`.
4. Tags target images with both the semantic version (`1.0.0`) and `latest`.
5. Pushes the multi-platform manifest directly to Docker Hub.

---

## Manual Build and Tag Commands

If executing manual publishing steps outside the automated script:

```bash
# Authenticate with Docker Hub
docker login

# Initialise buildx builder
docker buildx create --name modern-flash-builder --use 2>/dev/null || docker buildx use modern-flash-builder

# Build and push multi-architecture studio image
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t goldlabel2027/modern-flash-studio:latest \
  -t goldlabel2027/modern-flash-studio:1.0.0 \
  --push .
```

---

## Security & Supply Chain Baselines

- **Zero Secret Ingestion**: Container images never include local configuration secrets, environment files (`.env`), or private keys, conforming to Government Standard GS-AI-DATA-02.
- **Rootless or Unprivileged User Execution**: Runtime services isolate execution inside `/app` without host filesystem leakage.
- **Immutable Tags**: Every release build pushes a versioned semantic tag alongside `latest` to ensure reproducible community deployments.
