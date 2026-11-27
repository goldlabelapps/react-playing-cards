# Hybrid Package Architecture

This manual specifies the single-repository architecture enabling Modern Flash to distribute as both a modern JavaScript/React package and a native WordPress plugin.

---

## 1. The Engineering Challenge

Modern web development frequently fractures codebases across runtime boundaries:
- JavaScript engineers expect `package.json`, TypeScript definitions, Vite bundling, and npm distribution.
- WordPress engineers expect `plugin.php` headers, PSR-4 autoloading, WordPress hooks, and admin settings screens.

Maintaining separate repositories creates synchronization friction, drift between animation engine features, and fragmented issue tracking.

Modern Flash resolves this by operating as a unified hybrid repository. Developers clone a single repository and work within their native ecosystem conventions without friction.

---

## 2. Repository Layout and Boundary Contracts

The file hierarchy defines explicit ownership across runtime boundaries:

```text
modern-flash/
├── modern-flash.php           # WordPress plugin entry point and lifecycle bootstrap
├── composer.json              # PSR-4 autoload contract for PHP ("ModernFlash\": "php/")
├── package.json               # NPM package contract for JavaScript/TypeScript
├── vite.config.ts             # Interactive studio build configuration
├── vite.lib.config.ts         # Library ESM module build configuration
├── vite.bundle.config.ts      # Standalone IIFE bundle build configuration
├── compose.yaml               # Multi-container Docker harness (Vite Studio + WordPress + DB)
├── php/                       # Modern WordPress PHP classes (PSR-4)
│   ├── Plugin.php             # Core plugin orchestrator, asset enqueuing, and lifecycle
│   ├── Shortcode.php          # [modern_flash] declarative stage renderer
│   └── Admin/
│       └── SettingsController.php # Two-column settings interface with runtime telemetry
├── src/                       # TypeScript/React Flash engine source
│   ├── Flash.tsx              # Universal Flash component
│   ├── Stage.tsx              # SVG vector stage surface
│   ├── bundle-entry.ts        # IIFE entry point attaching to window.mwpFlash
│   ├── index.ts               # ESM library entry point
│   ├── ActionScript/          # GSAP timeline choreographies
│   ├── MovieClips/            # Vector asset libraries (Playing Cards, Starfighter, HUD)
│   └── PromptEngine/          # Natural language scene parser
├── dist/                      # Compiled distribution artifacts
│   ├── index.js               # ESM library for Next.js / React
│   ├── index.d.ts             # TypeScript type declarations
│   └── flash-bundle.min.js    # Self-contained browser runtime for WordPress
└── docs/                      # Technical specifications and architecture manuals
```

---

## 3. JavaScript Developer Workflow

JavaScript and React engineers treat the repository as a standard TypeScript project:

1. **Installation**:
   ```bash
   pnpm install
   ```
2. **Interactive Studio**:
   ```bash
   pnpm dev
   # or
   pnpm studio
   ```
   Runs the interactive prompt-driven animation studio at `http://localhost:3800`.
3. **Compilation Pipeline**:
   ```bash
   pnpm run build
   ```
   Compiles three target outputs into `dist/`:
   - `dist/index.js` (ESM module for modern bundlers)
   - `dist/index.d.ts` (TypeScript types via `tsc`)
   - `dist/flash-bundle.min.js` (standalone IIFE vector runtime)

---

## 4. WordPress Developer Workflow

PHP and WordPress engineers treat the repository as a standard WordPress plugin:

### Option A: Containerised Development via Docker

Developers run the full stack without installing local PHP, Composer, or MySQL:

```bash
docker compose up -d
```

This launches three interconnected services:
- **`vite`** (`http://localhost:3800`): Live Vite animation studio.
- **`wordpress`** (`http://localhost:3880`): WordPress 6.7 environment with the repository live-mounted into `/var/www/html/wp-content/plugins/modern-flash`.
- **`wordpress_db`**: MariaDB database with automated health checks.

### Option B: Local WordPress Installation

Clone or symlink the repository directly into your local WordPress plugin directory:

```bash
cd wp-content/plugins
git clone https://github.com/goldlabelapps/modern-flash.git
cd modern-flash
pnpm run build:bundle
```

Activate the plugin in WordPress Admin (`wp-admin/plugins.php`).

---

## 5. The Runtime Asset Bridge

The bridge connecting PHP to JavaScript relies on `dist/flash-bundle.min.js`:

1. **Compilation**: Vite bundles React 19, GSAP, and all MovieClips into a self-contained IIFE script exposed globally as `window.mwpFlash`.
2. **Auto-Mount Discovery**: On `DOMContentLoaded`, `window.mwpFlash.autoMount()` scans the DOM for elements matching `.mwp-flash-stage` or `[data-flash-stage="true"]`.
3. **Shortcode Execution**: The PHP shortcode handler renders the container with HTML data attributes:
   ```html
   <div
     class="mwp-flash-stage"
     data-flash-stage="true"
     data-prompt="Deal Ace of Spades with a 3D flip"
     data-loop="true"
     data-autoplay="true"
     data-speed="1.2"
     style="width:100%;min-height:360px;position:relative;"
   ></div>
   ```
4. **Hydration**: The bundle parses attributes, renders the React SVG stage, initialises GSAP timelines, and mounts cleanly with zero layout shift.

---

## 6. Admin Interface and Telemetry

Conforming to Wolfpack standards, the WordPress administration interface implements a canonical two-column layout:
- **Primary Column**: Settings form with configuration for default playback speeds and automatic stage discovery.
- **Secondary Column**: Runtime telemetry card reporting bundle compilation status, bundle file size, detected engine version, and available MovieClips.
- **Defensive Safeguards**: If `dist/flash-bundle.min.js` is missing, an administrative notice prompts the user to compile the asset rather than failing silently.
