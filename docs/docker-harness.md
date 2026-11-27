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

The container exposes port `3800` for the interactive Flash Animation Studio, port `3830` for the flagship Next.js web application, alongside dedicated port `3880` for the containerised WordPress environment:

```yaml
name: modern-flash

services:
  vite:
    build:
      context: .
      dockerfile: Dockerfile
    image: modern-flash-vite:latest
    container_name: vite
    ports:
      - "3800:3800"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    restart: unless-stopped

  nextjs:
    build:
      context: .
      dockerfile: nextjs/Dockerfile
    image: modern-flash-nextjs:latest
    container_name: nextjs
    ports:
      - "3830:3830"
    environment:
      - NODE_ENV=development
      - PORT=3830
      - DATABASE_HOST=wordpress_db
      - DATABASE_PORT=3306
      - DATABASE_USER=wpuser
      - DATABASE_PASSWORD=wppassword
      - DATABASE_NAME=modern_flash_dev
    volumes:
      - .:/app
      - /app/node_modules
      - /app/nextjs/node_modules
      - /app/nextjs/.next
    depends_on:
      wordpress_db:
        condition: service_healthy
    restart: unless-stopped

  wordpress:
    image: wordpress:php8.2-apache
    container_name: wordpress
    ports:
      - "3880:80"
    environment:
      WORDPRESS_DB_HOST: wordpress_db:3306
      WORDPRESS_DB_USER: wpuser
      WORDPRESS_DB_PASSWORD: wppassword
      WORDPRESS_DB_NAME: modern_flash_dev
      WORDPRESS_DEBUG: 1
    volumes:
      - wp_data:/var/www/html
      - .:/var/www/html/wp-content/plugins/modern-flash
    depends_on:
      wordpress_db:
        condition: service_healthy
    restart: unless-stopped

  wordpress_db:
    image: mariadb:10.11
    container_name: wordpress_db
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: modern_flash_dev
      MYSQL_USER: wpuser
      MYSQL_PASSWORD: wppassword
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mariadb-admin", "ping", "-h", "localhost", "-u", "root", "-prootpassword"]
      interval: 5s
      timeout: 5s
      retries: 10
    restart: unless-stopped

volumes:
  wp_data:
  db_data:
```

---

## Operational Commands

### Launch Composite Environment
Start the full development stack:

```bash
docker compose up -d
```

- Vite Studio: `http://localhost:3800`
- Next.js Web App: `http://localhost:3830`
- WordPress: `http://localhost:3880`

### Build Distribution Artifacts
Compile both the ESM library bundle and the standalone WordPress bundle:

```bash
docker compose run --rm vite pnpm build && pnpm build:bundle
```

### Container Shell Access
Open an interactive shell inside the container environment:

```bash
docker compose exec vite sh
```

---

## Artifact Pipeline

The container compiles two distinct output formats into `dist/`:

1. **`dist/index.js` & `dist/index.d.ts`**:
   Tree-shakeable ESM module for Next.js, Vite, and npm consumers. Externalises `react`, `react-dom`, and `gsap`.
2. **`dist/flash-bundle.min.js`**:
   Self-contained browser bundle for WordPress `mwp-flash`. Bundles the runtime and attaches to `window.mwpFlash` with auto-mounting capabilities on `.mwp-flash-stage` elements.
