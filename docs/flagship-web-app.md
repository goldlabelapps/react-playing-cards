# Flagship Web Application Architecture

This document specifies the architecture, deployment contracts, and persistence patterns for the Modern Flash public-facing web application located in `nextjs`.

---

## 1. Role and Strategic Context

Modern Flash ships two distinct JavaScript environments from a single repository:
1. **Developer Animation Studio (`vite/` via Vite on `:3800`)**: A lightweight client-only lab designed for rapid local canvas iteration, ActionScript timeline debugging, and audio synthesis testing.
2. **Flagship Public Web Application (`nextjs/` via Next.js on `:3830`)**: The official public-facing showcase and community hub deployed to Vercel alongside the GitHub repository.

The Next.js application demonstrates production consumption of the `modern-flash` package, offering real-time natural language prompt synthesis, interactive vector stages, and shared persistent scene storage.

---

## 2. Directory Hierarchy and Boundaries

```text
nextjs/
├── app/
│   ├── layout.tsx         # Semantic HTML landmarks, skip links, and dark theme
│   ├── page.tsx           # Public showcase landing page (ISR revalidate: 60s)
│   └── actions.ts         # Server actions persisting scenes to database
├── components/
│   ├── InteractiveStage.tsx # Client component managing prompt form and GSAP controls
│   └── StageWrapper.tsx   # Dynamic client boundary isolating vector canvas from SSR
├── lib/
│   └── db.ts              # MariaDB connection pool with defensive serverless fallback
├── Dockerfile             # Multi-stage container definition for port 3830
├── next.config.ts         # Package transpilation and external server packages
├── package.json           # Workspace manifest referencing "modern-flash": "workspace:*"
├── tsconfig.json          # Strict TypeScript App Router configuration
└── vercel.json            # Scoped Vercel deployment descriptor
```

---

## 3. Serverless Deployment and Defensive Persistence

### The Problem

In local Docker environments, Next.js connects to MariaDB via the internal network (`wordpress_db:3306`). When deployed to Vercel, the application runs inside serverless edge or lambda runtimes without direct access to local Docker containers.

### The Solution: Environment-Aware Persistence

The database client (`lib/db.ts`) implements defensive persistence:
- **Local Docker / Cloud Database**: When `DATABASE_HOST` or `DATABASE_URL` is defined, `mysql2/promise` opens a connection pool to persist scenes to the `flash_scenes` table.
- **Vercel Previews / Zero-Config Deployments**: When database environment variables are unset or unreachable, the module automatically falls back to an in-memory seed dataset.
- **Outcome**: The public application compiles and deploys to Vercel without throwing 500 connection errors, even before a production database is linked.

### Database Schema

```sql
CREATE TABLE IF NOT EXISTS flash_scenes (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  prompt TEXT NOT NULL,
  movie VARCHAR(64) DEFAULT 'logo',
  speed FLOAT DEFAULT 1.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 4. Client Boundary Isolation (`StageWrapper`)

Modern Flash uses GreenSock (GSAP) timelines and Web Audio APIs. Evaluating these modules during Node.js server-side pre-rendering causes hydration mismatches and window-reference exceptions.

To enforce clean isolation:
1. `nextjs/components/StageWrapper.tsx` wraps `InteractiveStage` using `next/dynamic` with `{ ssr: false }`.
2. A client mounting guard (`mounted` state check) ensures vector DOM nodes are only initialised once the browser window is active.
3. Next.js statically renders page scaffolding, semantic headers, and copy instantly while client bundles hydrate seamlessly in the background.

---

## 5. Vercel Deployment Configuration

In accordance with monorepo deployment standards, `nextjs` declares its own scoped configuration:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs"
}
```

To deploy via the Vercel CLI or Git integration:
- **Root Directory**: `nextjs`
- **Build Command**: `pnpm run build`
- **Install Command**: `pnpm install`
