#!/usr/bin/env bash
set -euo pipefail

# Wolfpack Pre-Commit Hook Setup
# Installs a git pre-commit hook that runs verify-hygiene.py on staged changes.

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
HOOK_DIR="${REPO_ROOT}/.git/hooks"
PRE_COMMIT_HOOK="${HOOK_DIR}/pre-commit"

echo "========================================================================"
echo " WOLFPACK // GIT PRE-COMMIT HOOK INSTALLATION"
echo " Target repository: ${REPO_ROOT}"
echo "========================================================================"

if [ ! -d "${REPO_ROOT}/.git" ]; then
  echo "[wolfpack] Error: No .git directory found at ${REPO_ROOT}."
  echo "           Please initialise a git repository first (git init)."
  exit 1
fi

mkdir -p "${HOOK_DIR}"

cat <<'EOF' > "${PRE_COMMIT_HOOK}"
#!/usr/bin/env bash
set -euo pipefail

# Wolfpack automated pre-commit hygiene gate
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
RUNNER="${REPO_ROOT}/scripts/verify-hygiene.py"

if [ -f "${RUNNER}" ]; then
  echo "[wolfpack] Running pre-commit hygiene and security verification..."
  python3 "${RUNNER}" --staged
fi
EOF

chmod +x "${PRE_COMMIT_HOOK}"

echo "[+] Successfully installed executable pre-commit hook:"
echo "    ${PRE_COMMIT_HOOK}"
echo "[+] Pre-commit gate active: Staged changes will be scanned for secrets and tokens."
echo "========================================================================"
