#!/usr/bin/env bash
# ==============================================================================
# Modern Flash // Google Cloud VM Deployment Runner
# Target: wp-lab-live (34.16.50.74)
# Codified release command: pnpm run deploy / bash scripts/deploy.sh
# ==============================================================================
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SSH_KEY="${SSH_KEY:-${HOME}/.ssh/google_compute_engine}"
VM_HOST="${VM_HOST:-34.16.50.74}"
VM_USER="${VM_USER:-milky}"
SSH_TARGET="${VM_USER}@${VM_HOST}"
SSH_CMD="ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR"

echo "========================================================================"
echo "  🐺 WOLFPACK // MODERN FLASH VM DEPLOYMENT RUNNER"
echo "  Target Host: ${SSH_TARGET}"
echo "========================================================================"

if [ ! -f "${SSH_KEY}" ]; then
  echo "[-] Error: SSH identity key not found at ${SSH_KEY}." >&2
  exit 1
fi

echo "[1/4] Building standalone Next.js production artifact..."
cd "${ROOT_DIR}"
pnpm run build:lib
pnpm --filter nextjs build

echo "[2/4] Setting remote directory permissions..."
${SSH_CMD} "${SSH_TARGET}" "sudo mkdir -p /var/www/modern-flash-nextjs && sudo chown -R ${VM_USER}:www-data /var/www/modern-flash-nextjs"

echo "[3/4] Synchronising artifacts and static assets via rsync..."
rsync -avz -e "${SSH_CMD}" "${ROOT_DIR}/nextjs/.next/standalone/" "${SSH_TARGET}:/var/www/modern-flash-nextjs/"
rsync -avz -e "${SSH_CMD}" "${ROOT_DIR}/nextjs/.next/static/" "${SSH_TARGET}:/var/www/modern-flash-nextjs/nextjs/.next/static/"
rsync -avz -e "${SSH_CMD}" "${ROOT_DIR}/public/" "${SSH_TARGET}:/var/www/modern-flash-nextjs/nextjs/public/"

echo "[4/4] Restarting systemd service and verifying health..."
${SSH_CMD} "${SSH_TARGET}" "sudo systemctl restart modern-flash-nextjs && sleep 2 && sudo systemctl status modern-flash-nextjs --no-pager"

echo "========================================================================"
echo "  Verifying local port 3830 on VM..."
${SSH_CMD} "${SSH_TARGET}" "curl -I -s http://127.0.0.1:3830 | head -n 5"

echo "  Verifying public HTTPS endpoint..."
curl -I -s https://modern-flash.pro | head -n 5

echo "========================================================================"
echo "  DEPLOYMENT COMPLETE: https://modern-flash.pro is live."
echo "========================================================================"
