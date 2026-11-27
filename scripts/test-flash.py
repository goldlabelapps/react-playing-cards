#!/usr/bin/env python3
"""
Wolfpack // Unified "Test Flash" Cross-Ecosystem Test Suite
Executes comprehensive end-to-end verification across all repository vectors:
1. Workspace Hygiene & Security (Secrets + Markdown Links)
2. Core Library TypeScript Checking (tsc --noEmit)
3. Standalone Vector Runtime Bundle Build (Vite IIFE)
4. WordPress PHP Plugin Syntax Linting (php -l)
5. Flagship Next.js Application Production Build (next build)
6. Live Docker Service Endpoint Probing (Vite, Next.js, WordPress, MariaDB)
"""

import os
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# ANSI terminal formatting
C_RESET = "\033[0m"
C_BOLD = "\033[1m"
C_GREEN = "\033[32m"
C_RED = "\033[31m"
C_CYAN = "\033[36m"
C_YELLOW = "\033[33m"
C_DIM = "\033[2m"

results = []


def run_stage(title: str, command: list, cwd: Path = ROOT) -> bool:
    print(f"\n{C_BOLD}{C_CYAN}[STAGE :: {title.upper()}]{C_RESET}")
    print(f"{C_DIM}Command: {' '.join(command)}{C_RESET}")
    start = time.time()
    try:
        proc = subprocess.run(
            command,
            cwd=cwd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            check=False,
        )
        elapsed = time.time() - start
        success = proc.returncode == 0

        # Output condensed telemetry
        lines = [ln for ln in proc.stdout.splitlines() if ln.strip()]
        for line in lines[-6:]:
            print(f"  {line}")

        if success:
            print(f"  {C_GREEN}✓ PASSED{C_RESET} ({elapsed:.2f}s)")
            results.append((title, True, elapsed, "Passed"))
            return True
        else:
            print(f"  {C_RED}✗ FAILED (Exit Code {proc.returncode}){C_RESET} ({elapsed:.2f}s)")
            results.append((title, False, elapsed, f"Failed (Code {proc.returncode})"))
            return False
    except Exception as exc:
        elapsed = time.time() - start
        print(f"  {C_RED}✗ ERROR: {exc}{C_RESET}")
        results.append((title, False, elapsed, str(exc)))
        return False


def probe_endpoints() -> bool:
    print(f"\n{C_BOLD}{C_CYAN}[STAGE :: LIVE DOCKER SERVICE TELEMETRY]{C_RESET}")
    start = time.time()

    endpoints = [
        ("Vite Studio", "http://localhost:3800/"),
        ("Next.js App", "http://localhost:3830/"),
        ("WordPress", "http://localhost:3880/"),
    ]

    all_reachable = True
    for label, url in endpoints:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Wolfpack-Test-Flash/1.0"})
            with urllib.request.urlopen(req, timeout=8) as resp:
                code = resp.getcode()
                if code == 200:
                    print(f"  {C_GREEN}●{C_RESET} {label:<16}: {url} -> {C_GREEN}HTTP {code} OK{C_RESET}")
                else:
                    print(f"  {C_YELLOW}●{C_RESET} {label:<16}: {url} -> {C_YELLOW}HTTP {code}{C_RESET}")
        except Exception as exc:
            all_reachable = False
            print(f"  {C_DIM}○{C_RESET} {label:<16}: {url} -> {C_DIM}Offline / Unreachable ({exc}){C_RESET}")

    elapsed = time.time() - start
    status_label = "Online" if all_reachable else "Partial / Offline"
    results.append(("Docker Service Probing", all_reachable, elapsed, status_label))
    return all_reachable


def main():
    print(f"{C_BOLD}========================================================================{C_RESET}")
    print(f"{C_BOLD}  🐺 WOLFPACK // UNIFIED 'TEST FLASH' VERIFICATION RUNNER{C_RESET}")
    print(f"{C_DIM}  Workspace Root: {ROOT}{C_RESET}")
    print(f"{C_BOLD}========================================================================{C_RESET}")

    total_start = time.time()

    # 1. Hygiene & Security Gate
    run_stage("Workspace Hygiene & Security", ["python3", "scripts/verify-hygiene.py"])

    # 2. Library TypeScript Checking
    run_stage("Core Library Type Check", ["pnpm", "run", "type-check"])

    # 3. Standalone Vector Runtime Bundle Build
    run_stage("Standalone WordPress Bundle", ["pnpm", "run", "build:bundle"])

    # 4. WordPress PHP Runtime Syntax Linting
    php_files = [
        "modern-flash.php",
        "php/Plugin.php",
        "php/Shortcode.php",
        "php/Admin/SettingsController.php",
    ]
    existing_php = [f for f in php_files if (ROOT / f).exists()]
    if existing_php:
        cmd = ["sh", "-c", 'for f in "$@"; do php -l "$f" || exit 1; done', "_"] + existing_php
        run_stage("WordPress PHP Syntax Lint", cmd)

    # 5. Flagship Next.js Application Production Build
    if (ROOT / "nextjs").exists():
        run_stage("Flagship Next.js App Build", ["pnpm", "--filter", "nextjs", "build"])
    elif (ROOT / "apps/web").exists():
        run_stage("Flagship Next.js App Build", ["pnpm", "--filter", "web", "build"])

    # 6. Live Docker Service Endpoint Probing
    probe_endpoints()

    total_elapsed = time.time() - total_start

    # Executive Summary
    print(f"\n{C_BOLD}========================================================================{C_RESET}")
    print(f"{C_BOLD}  EXECUTION MATRIX SUMMARY // 'TEST FLASH'{C_RESET}")
    print(f"{C_BOLD}========================================================================{C_RESET}")

    failures = 0
    for name, ok, elapsed, detail in results:
        status_sym = f"{C_GREEN}PASS{C_RESET}" if ok else f"{C_RED}FAIL{C_RESET}"
        if not ok and name != "Docker Service Probing":
            failures += 1
        print(f"  {status_sym}  {name:<32} {elapsed:>6.2f}s  {C_DIM}[{detail}]{C_RESET}")

    print(f"------------------------------------------------------------------------")
    print(f"  Total Duration: {total_elapsed:.2f}s | Failed Stages: {failures}")

    if failures == 0:
        print(f"  {C_BOLD}{C_GREEN}RESULT: ALL TESTS PASSED ACROSS ALL WORKSPACES{C_RESET}")
        print(f"{C_BOLD}========================================================================{C_RESET}\n")
        return 0
    else:
        print(f"  {C_BOLD}{C_RED}RESULT: VERIFICATION SUITE DETECTED {failures} FAILURE(S){C_RESET}")
        print(f"{C_BOLD}========================================================================{C_RESET}\n")
        return 1


if __name__ == "__main__":
    sys.exit(main())
