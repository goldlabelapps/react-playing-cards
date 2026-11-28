# Virtual Machine Deployment and Testing Architecture

> **Developer Level**: Level 3 : Systems & Infrastructure ("Geek Tier")  
> **Technical Depth**: Deep Linux Systems & DevOps (Reverse proxies, systemd, sockets)  
> **Audience**: Systems engineers and DevOps operators managing the Google Cloud production VM.

This guide documents the end-to-end testing, artifact staging, and deployment protocols for both the `modern-flash` and `modern-wordpress` projects on the Google Cloud Compute Engine virtual machine (`wp-lab-live`: `34.16.50.74`).

---

## 1. Target Infrastructure Topology

```text
================================================================================
GOOGLE CLOUD VIRTUAL MACHINE // TOPOLOGY & ROUTING MATRIX
================================================================================
Host IP               : 34.16.50.74 (Google Cloud us-central1)
Edge TLS & Proxy      : Caddy 2 (Systemd Service, Ports 80 & 443)
Database Server       : MariaDB 10.11 (Localhost Port 3306)
PHP Runtime Engine    : PHP 8.3 FPM (Unix Socket: /run/php/php8.3-fpm.sock)
Node.js Runtime       : Node.js 22.23.5 LTS (Systemd: modern-flash-nextjs)

Active Public Endpoints:
1. Modern Flash Next.js    : https://modern-flash.pro (Port 3830)
   (Fallback Sslip)         : https://app.34.16.50.74.sslip.io
2. Modern WordPress Main   : https://modern-wordpress.pro
3. Government Baseline     : https://ed-tech.co
4. Not Here To Fuck Spiders: https://notheretofuckspiders.art
================================================================================
```

---

## 2. Pre-Flight Verification Protocols

Prior to production deployment, all automated tests across both repositories must pass cleanly.

### modern-flash Test Vector

Run the unified test runner:
```bash
python3 scripts/test-flash.py
```
This suite verifies:
- Workspace hygiene and credential safety (`scripts/verify-hygiene.py`).
- TypeScript type compliance (`pnpm run type-check`).
- Standalone runtime bundle build (`pnpm run build:bundle`).
- WordPress PHP class syntax linting (`php -l`).
- Next.js App Router production build (`pnpm --filter nextjs build`).
- Live local Docker service probing.

### modern-wordpress Test Vector

Run the test and security checks in `modern-wordpress`:
```bash
cd ../modern-wordpress
composer test -- --testdox
./bin/audit
```

---

## 3. Modern Flash Next.js Application Deployment

The Next.js application (`nextjs/`) is built using Next.js standalone mode (`output: 'standalone'`). This bundles only necessary runtime dependencies, resulting in a minimal memory footprint (~40MB RAM) on the virtual machine.

### Deployment Procedure

1. **Build the Standalone Artifact**:
   ```bash
   pnpm --filter nextjs build
   ```

2. **Synchronise Files to the VM**:
   ```bash
   ssh milky@34.16.50.74 "sudo mkdir -p /var/www/modern-flash-nextjs && sudo chown -R milky:www-data /var/www/modern-flash-nextjs"
   rsync -avz nextjs/.next/standalone/ milky@34.16.50.74:/var/www/modern-flash-nextjs/
   rsync -avz nextjs/.next/static/ milky@34.16.50.74:/var/www/modern-flash-nextjs/nextjs/.next/static/
   rsync -avz public/ milky@34.16.50.74:/var/www/modern-flash-nextjs/nextjs/public/
   ```

3. **Manage the Systemd Service**:
   The service configuration is located at `/etc/systemd/system/modern-flash-nextjs.service`:
   ```ini
   [Unit]
   Description=Modern Flash Next.js Application
   After=network.target

   [Service]
   Type=simple
   User=milky
   WorkingDirectory=/var/www/modern-flash-nextjs/nextjs
   Environment=NODE_ENV=production
   Environment=PORT=3830
   Environment=HOSTNAME=127.0.0.1
   ExecStart=/usr/bin/node server.js
   Restart=always
   RestartSec=3

   [Install]
   WantedBy=multi-user.target
   ```
   To restart the service after deployment:
   ```bash
   sudo systemctl restart modern-flash-nextjs
   ```

---

## 4. Modern WordPress VM Deployment

WordPress themes, plugins, and static assets are managed by `modern-wordpress/bin/deploy`.

### Option A: Code-First Deployment (Without Database Migration)
*Standard release vector. Safe for live customer data.*
```bash
cd ../modern-wordpress
make deploy
# Or: ./bin/deploy
```
This command stages themes, plugins, and static files to `/tmp/deploy`, synchronises them into `/var/www/html/*`, refreshes WP-CLI rewrites, clears object caches, and reloads PHP-FPM and Caddy.

### Option B: Release With Database Migration (With Database Snapshot)
*Used when database schemas, page structures, or content fixtures must be imported.*

To migrate the multi-site database fleet:
```bash
cd ../modern-wordpress
make deploy-db
# Or: ./bin/deploy --with-db
```

Safety gates active during database migration:
1. **Customer Preservation Gate**: Live customer records and API keys are preserved and restored.
2. **Pre-Import Backup**: An automated SQL dump is stored in `/var/backups/modern-wordpress-db/` before any tables are overwritten.
3. **Serialised Search-Replace**: URLs are updated cleanly from local development hosts to production domains.
4. **Zero Trust Rotation**: High-entropy passwords are generated and default admin credentials are deleted.

---

## 5. Attaching a Custom Domain / TLD

To point a custom domain (e.g. `modern-flash.pro` or `app.yourdomain.com`) to the Modern Flash Next.js application:

1. **DNS Record**:
   In your DNS registrar or Cloudflare dashboard, add an `A` record pointing to the VM IP:
   ```text
   Type : A
   Name : @ (or subdomain, e.g. app)
   Value: 34.16.50.74
   TTL  : 300
   ```

2. **Caddy Virtual Host Configuration**:
   Edit `/etc/caddy/Caddyfile` on the VM:
   ```caddy
   modern-flash.pro, www.modern-flash.pro, app.34.16.50.74.sslip.io {
       reverse_proxy 127.0.0.1:3830
       encode gzip zstd

       header {
           Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
           X-Content-Type-Options "nosniff"
           X-Frame-Options "SAMEORIGIN"
           Referrer-Policy "strict-origin-when-cross-origin"
       }
   }
   ```

3. **Reload Caddy**:
   ```bash
   sudo systemctl reload caddy
   ```
   Caddy validates the host header, completes the ACME challenge with Let's Encrypt, and provisions a TLS certificate automatically upon the first inbound HTTPS request.
