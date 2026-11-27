# Flagship Web Application Architecture

> **Developer Level**: Level 2 : Application Engineer  
> **Technical Depth**: Intermediate (Full-stack Next.js 15 App Router architecture)  
> **Audience**: Application engineers contributing to the web showcase and cloud persistence.

This document specifies the architecture, deployment contracts, and persistence patterns for the Modern Flash public-facing web application located in `nextjs`.

---

## 1. Role and Strategic Context

Modern Flash ships two distinct JavaScript environments from a single repository:
1. **Developer Animation Studio (`vite/` via Vite on `:3800`)**: A lightweight client-only lab designed for rapid local canvas iteration, ActionScript timeline debugging, and audio synthesis testing.
2. **Flagship Public Web Application (`nextjs/` via Next.js on `:3830`)**: The official public-facing showcase and collaborative community hub hosted on the Google Cloud Compute Engine VM (`wp-lab-live`: `34.16.50.74`) alongside the Modern WordPress multi-site fleet.

The Next.js application demonstrates production consumption of the `modern-flash` package, offering real-time natural language prompt synthesis, interactive vector stages, and collaborative cloud scene storage.

---

## 2. Directory Hierarchy and Boundaries

```text
nextjs/
├── app/
│   ├── layout.tsx         # Semantic HTML landmarks, skip links, and dark theme
│   ├── page.tsx           # Public showcase landing page (ISR revalidate: 60s)
│   └── actions.ts         # Server actions managing scene persistence
├── components/
│   ├── InteractiveStage.tsx # Client component managing prompt form and GSAP controls
│   └── StageWrapper.tsx   # Dynamic client boundary isolating vector canvas from SSR
├── lib/
│   ├── db.ts              # Scene persistence interface with defensive fallback
│   ├── firebase.ts        # Client-side Firebase SDK initialisation (Auth, Firestore, Storage)
│   └── firebase-admin.ts  # Privileged Server Actions SDK for token verification
├── Dockerfile             # Multi-stage container definition for port 3830
├── next.config.ts         # Package transpilation and external server packages
├── package.json           # Workspace manifest referencing "modern-flash": "workspace:*"
└── tsconfig.json          # Strict TypeScript App Router configuration
```

---

## 3. Google Cloud and Firebase Suite Integration

### Strategic Infrastructure Convergence

Modern Flash consolidates hosting, persistence, and intelligence under a single Google Cloud Platform (GCP) and Firebase project perimeter. This eliminates third-party platform fragmentation, cold starts, and connection-pooling bottlenecks.

### Core Services

1. **Cloud Firestore**:
   - Stores prompt-generated scene definitions, timeline parameters, and author metadata in the `flash_scenes` collection.
   - Replaces traditional relational SQL connections with scalable document persistence.
   - Supports real-time snapshot listeners (`onSnapshot`) to enable live multi-user stage collaboration and synchronised playback across connected clients.

2. **Firebase Authentication**:
   - Provides anonymous authentication out of the box, allowing visitors to design and run vector scenes immediately without registration hurdles.
   - Supports account linking to Google Sign-In to claim ownership of persistent scenes and custom MovieClips.
   - Enforces secure session tokens validated server-side in Next.js Server Actions using `firebase-admin/auth`.

3. **Cloud Storage for Firebase**:
   - Offloads binary assets, exported SVG vectors, audio stems, and rendered canvas video clips directly to high-capacity object storage.
   - Protects local VM disk capacity whilst serving media through Google Cloud global edge distribution.

4. **Firebase Cloud Messaging (FCM)**:
   - Delivers web push notifications to users when background video renders, multi-frame sprite sheets, or complex prompt syntheses finish processing.

5. **Gemini API Integration**:
   - Powers the natural language Prompt Engine (`src/PromptEngine/`).
   - Translates descriptive user input into strictly typed JSON scene choreography consumed directly by GSAP ActionScript runners.

---

## 4. Client Boundary Isolation (`StageWrapper`)

Modern Flash uses GreenSock (GSAP) timelines and Web Audio APIs. Evaluating these modules during Node.js server-side pre-rendering causes hydration mismatches and window-reference exceptions.

To enforce clean isolation:
1. `nextjs/components/StageWrapper.tsx` wraps `InteractiveStage` using `next/dynamic` with `{ ssr: false }`.
2. A client mounting guard (`mounted` state check) ensures vector DOM nodes are only initialised once the browser window is active.
3. Next.js statically renders page scaffolding, semantic headers, and copy instantly while client bundles hydrate in the background.

---

## 5. Google Cloud VM Deployment and Caddy Ingress

The application is deployed as a containerised service running on the shared Google Cloud VM (`wp-lab-live`: `34.16.50.74`).

### Container Orchestration
The multi-stage container (`nextjs/Dockerfile`) builds the standalone Next.js server and exposes port `3830`. It is managed via Docker Compose with automatic restart policies:

```yaml
nextjs:
  build:
    context: .
    dockerfile: nextjs/Dockerfile
  image: modern-flash-nextjs:latest
  container_name: nextjs
  ports:
    - "3830:3830"
  restart: unless-stopped
```

### Edge Caddy Reverse Proxy and Live Endpoint
Edge TLS termination on ports `80` and `443` is handled by Caddy. Traffic for the application is routed to Next.js on port `3830`:

```caddy
your-domain.com, app.34.16.50.74.sslip.io {
    reverse_proxy 127.0.0.1:3830
    encode zstd gzip

    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "SAMEORIGIN"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
}
```

The application is live and accessible at:
- `https://modern-flash.pro`
- `https://app.34.16.50.74.sslip.io`

To attach any custom domain or TLD:
1. Create a DNS `A` record pointing to `34.16.50.74`.
2. Add your domain name to the virtual host declaration in `/etc/caddy/Caddyfile`.
3. Reload Caddy via `sudo systemctl reload caddy`. Caddy automatically issues Let's Encrypt TLS certificates upon the first request.
