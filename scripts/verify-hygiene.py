#!/usr/bin/env python3
"""
Wolfpack Hygiene & Security Verification Runner
Scans repository for hardcoded secrets, unprotected tokens, and broken asset references.
Adapted from the Government Standard (GS-AI-DATA-02, GS-AI-CODE-02) verification harness.
"""

import argparse
import json
import os
import re
import subprocess
import sys
import urllib.parse
from pathlib import Path

SECRET_PATTERNS = [
    (r"-----BEGIN (RSA|EC|DSA|OPENSSH|PGP) PRIVATE KEY-----", "Private cryptographic key"),
    (r"AKIA[0-9A-Z]{16}", "AWS Access Key ID"),
    (r"ghp_[0-9a-zA-Z]{36}", "GitHub Personal Access Token"),
    (r"github_pat_[0-9a-zA-Z_]{22,}", "GitHub Fine-Grained Personal Access Token"),
    (r"xox[baprs]-[0-9a-zA-Z]{10,48}", "Slack API Token"),
    (r"(?:api_key|apikey|secret_key)\s*[:=]\s*['\"][A-Za-z0-9_\-]{20,}['\"]", "High-entropy API key"),
    (r"(?:postgres|mysql|mongodb)://[^:]+:[^@]+@[^\s/]+", "Database connection string with credentials"),
]

IGNORED_DIRS = {".git", "node_modules", ".venv", "venv", "__pycache__", ".next", ".turbo", ".pytest_cache", "dist", "build"}
IGNORED_FILES = {"scripts/verify-hygiene.py", ".DS_Store"}


def get_repo_root(custom_root: Path = None) -> Path:
    if custom_root:
        return custom_root.resolve()
    cwd = Path.cwd().resolve()
    if (cwd / ".git").exists() or (cwd / "AGENTS.md").exists():
        return cwd
    current = Path(__file__).resolve().parent
    while current != current.parent:
        if (current / ".git").exists() or (current / "AGENTS.md").exists():
            return current
        current = current.parent
    return cwd


def scan_secrets(root: Path, staged_only: bool = False) -> list:
    findings = []
    files_to_scan = []

    if staged_only:
        try:
            out = subprocess.check_output(
                ["git", "diff", "--cached", "--name-only", "--diff-filter=ACM"],
                cwd=root,
                text=True,
            )
            files_to_scan = [root / line.strip() for line in out.splitlines() if line.strip()]
        except Exception:
            files_to_scan = []
    else:
        for p in root.rglob("*"):
            if p.is_file():
                rel_parts = p.relative_to(root).parts
                if any(ignored in rel_parts for ignored in IGNORED_DIRS):
                    continue
                rel_str = str(p.relative_to(root))
                if rel_str in IGNORED_FILES:
                    continue
                files_to_scan.append(p)

    compiled_patterns = [(re.compile(pat, re.IGNORECASE), desc) for pat, desc in SECRET_PATTERNS]

    for file_path in files_to_scan:
        if not file_path.exists() or file_path.is_dir():
            continue
        try:
            with open(file_path, "r", encoding="utf-8", errors="replace") as f:
                lines = f.readlines()
        except Exception:
            continue

        rel_path = file_path.relative_to(root)
        for line_num, line in enumerate(lines, 1):
            if "SECRET_PATTERNS" in line or "re.compile" in line:
                continue
            for pattern, desc in compiled_patterns:
                if pattern.search(line):
                    findings.append({
                        "file": str(rel_path),
                        "line": line_num,
                        "description": desc,
                        "snippet": line.strip()[:60] + "...",
                    })

    return findings


def check_links_and_assets(root: Path) -> list:
    findings = []
    md_files = [p for p in root.rglob("*.md") if not any(ignored in p.parts for ignored in IGNORED_DIRS)]

    md_link_pattern = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
    html_img_pattern = re.compile(r"<img[^>]+src=[\"']([^\"']+)[\"']")

    for md_path in md_files:
        rel_md = md_path.relative_to(root)
        try:
            content = md_path.read_text(encoding="utf-8")
        except Exception as e:
            findings.append({"file": str(rel_md), "error": f"Could not read file: {e}"})
            continue

        content_to_check = re.sub(r"```[\s\S]*?```", "", content)

        for text, target in md_link_pattern.findall(content_to_check):
            if target.startswith(("http://", "https://", "mailto:", "#")):
                continue
            if target.startswith("file://"):
                unquoted_path = urllib.parse.unquote(urllib.parse.urlparse(target).path)
                resolved = Path(unquoted_path)
                if not resolved.exists():
                    findings.append({
                        "file": str(rel_md),
                        "link_text": text,
                        "target": target,
                        "resolved": str(resolved),
                        "error": "Target file or resource does not exist",
                    })
                continue
            clean_target = target.split("#")[0].strip()
            if not clean_target:
                continue
            resolved = (md_path.parent / clean_target).resolve()
            if not resolved.exists():
                findings.append({
                    "file": str(rel_md),
                    "link_text": text,
                    "target": target,
                    "resolved": str(resolved),
                    "error": "Target file or resource does not exist",
                })

        for src in html_img_pattern.findall(content_to_check):
            if src.startswith(("http://", "https://", "data:")):
                continue
            clean_src = src.split("?")[0].strip()
            if clean_src.startswith("/"):
                resolved = (root / clean_src.lstrip("/")).resolve()
            else:
                resolved = (md_path.parent / clean_src).resolve()
            if not resolved.exists():
                findings.append({
                    "file": str(rel_md),
                    "link_text": "HTML img src",
                    "target": src,
                    "resolved": str(resolved),
                    "error": "Image asset does not exist",
                })

    return findings


def main():
    parser = argparse.ArgumentParser(description="Wolfpack Hygiene & Security Verification Runner")
    parser.add_argument("--root", type=Path, default=None, help="Target root directory to scan")
    parser.add_argument("--secrets", action="store_true", help="Scan repository for hardcoded credentials and tokens")
    parser.add_argument("--links", action="store_true", help="Validate link and asset integrity across markdown files")
    parser.add_argument("--staged", action="store_true", help="Run checks strictly on staged git changes")
    parser.add_argument("--json", action="store_true", help="Output results in JSON format")

    args = parser.parse_args()
    root = get_repo_root(args.root)

    run_secrets = args.secrets or (not args.links)
    run_links = args.links or (not args.secrets and not args.staged)

    telemetry = {
        "status": "PASS",
        "secret_findings": [],
        "link_findings": [],
    }

    if run_secrets:
        secret_findings = scan_secrets(root, staged_only=args.staged)
        telemetry["secret_findings"] = secret_findings
        if secret_findings:
            telemetry["status"] = "FAIL"

    if run_links:
        link_findings = check_links_and_assets(root)
        telemetry["link_findings"] = link_findings
        if link_findings:
            telemetry["status"] = "FAIL"

    if args.json:
        print(json.dumps(telemetry, indent=2))
        sys.exit(0 if telemetry["status"] == "PASS" else 1)

    print("========================================================================")
    print("  WOLFPACK // HYGIENE & SECURITY VERIFICATION RUNNER")
    print(f"  Root: {root}")
    print("========================================================================")

    if run_secrets:
        mode_label = "STAGED CHANGES" if args.staged else "FULL WORKSPACE"
        print(f"\n[*] SCANNING FOR UNPROTECTED SECRETS ({mode_label})...")
        if telemetry["secret_findings"]:
            print(f"[!] DETECTED {len(telemetry['secret_findings'])} UNPROTECTED SECRET(S):")
            for f in telemetry["secret_findings"]:
                print(f"    - {f['file']}:{f['line']} [{f['description']}] -> {f['snippet']}")
        else:
            print("[+] PASSED: Zero unprotected secrets or high-entropy tokens detected.")

    if run_links:
        print("\n[*] VERIFYING MARKDOWN LINKS AND ASSET REFERENCES...")
        if telemetry["link_findings"]:
            print(f"[!] DETECTED {len(telemetry['link_findings'])} BROKEN RESOURCE REFERENCE(S):")
            for f in telemetry["link_findings"]:
                target = f.get("target") or f.get("error")
                print(f"    - {f['file']} -> {target}")
        else:
            print("[+] PASSED: All internal Markdown links and asset paths verified.")

    print("\n========================================================================")
    if telemetry["status"] == "PASS":
        print("  RESULT: HYGIENE VERIFICATION PASSED")
        print("========================================================================")
        sys.exit(0)
    else:
        print("  RESULT: HYGIENE VERIFICATION FAILED (Violations detected)")
        print("========================================================================")
        sys.exit(1)


if __name__ == "__main__":
    main()
