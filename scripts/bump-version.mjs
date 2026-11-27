#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

/**
 * Fast Monorepo Version Bump Guardrail
 * Scans root, workspace packages, and runtime manifests, updating them in <50ms.
 */

export function findRepoRoot(startDir = process.cwd()) {
  let curr = startDir;
  while (curr !== path.dirname(curr)) {
    if (fs.existsSync(path.join(curr, "pnpm-workspace.yaml"))) {
      return curr;
    }
    curr = path.dirname(curr);
  }
  return startDir;
}

export function computeNextVersion(currentVersion, bumpTypeOrVersion = "patch") {
  if (bumpTypeOrVersion && /^\d+\.\d+\.\d+/.test(bumpTypeOrVersion)) {
    return bumpTypeOrVersion;
  }

  const parts = currentVersion.split(".").map((n) => parseInt(n, 10) || 0);
  while (parts.length < 3) parts.push(0);

  const type = bumpTypeOrVersion || "patch";
  if (type === "patch") {
    return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
  }
  if (type === "minor") {
    return `${parts[0]}.${parts[1] + 1}.0`;
  }
  if (type === "major") {
    return `${parts[0] + 1}.0.0`;
  }
  throw new Error(`Invalid bump type '${type}'. Use 'patch', 'minor', 'major', or an explicit semver (e.g. 1.0.1).`);
}

export function discoverWorkspaceManifests(rootDir = findRepoRoot()) {
  const manifests = [];

  // 1. Root package.json
  const rootPkg = path.join(rootDir, "package.json");
  if (fs.existsSync(rootPkg)) {
    manifests.push(rootPkg);
  }

  // 2. Discover from pnpm-workspace.yaml if present
  const workspaceYaml = path.join(rootDir, "pnpm-workspace.yaml");
  if (fs.existsSync(workspaceYaml)) {
    const yamlContent = fs.readFileSync(workspaceYaml, "utf8");
    const lines = yamlContent.split("\n");
    let inPackages = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed === "packages:") {
        inPackages = true;
        continue;
      }
      if (inPackages) {
        if (trimmed.startsWith("-")) {
          const rawPkg = trimmed.replace(/^-\s*['"]?/, "").replace(/['"]?\s*$/, "");
          if (rawPkg && rawPkg !== ".") {
            const pkgPath = path.join(rootDir, rawPkg, "package.json");
            if (fs.existsSync(pkgPath) && !manifests.includes(pkgPath)) {
              manifests.push(pkgPath);
            }
          }
        } else if (trimmed && !trimmed.startsWith("#")) {
          inPackages = false;
        }
      }
    }
  }

  // 3. packages/* and apps/*
  for (const group of ["packages", "apps"]) {
    const groupDir = path.join(rootDir, group);
    if (!fs.existsSync(groupDir)) continue;
    const entries = fs.readdirSync(groupDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const pkgPath = path.join(groupDir, entry.name, "package.json");
      if (fs.existsSync(pkgPath) && !manifests.includes(pkgPath)) {
        manifests.push(pkgPath);
      }
    }
  }

  return manifests;
}

export function bumpMonorepoVersion(targetVersionOrBump = "patch", options = {}) {
  const rootDir = options.rootDir || findRepoRoot();
  const rootPkgPath = path.join(rootDir, "package.json");
  if (!fs.existsSync(rootPkgPath)) {
    throw new Error(`Cannot find root package.json at ${rootDir}`);
  }

  const rootManifest = JSON.parse(fs.readFileSync(rootPkgPath, "utf8"));
  const currentVersion = rootManifest.version || "1.0.0";
  const nextVersion = computeNextVersion(currentVersion, targetVersionOrBump);

  const manifests = discoverWorkspaceManifests(rootDir);
  const updated = [];

  for (const manifestPath of manifests) {
    const raw = fs.readFileSync(manifestPath, "utf8");
    const json = JSON.parse(raw);
    const oldVersion = json.version;

    json.version = nextVersion;

    if (!options.dryRun) {
      fs.writeFileSync(manifestPath, `${JSON.stringify(json, null, 2)}\n`, "utf8");
    }

    updated.push({
      path: path.relative(rootDir, manifestPath),
      name: json.name || path.basename(path.dirname(manifestPath)),
      oldVersion,
      newVersion: nextVersion,
    });
  }

  // Update WordPress plugin metadata if present
  const wpPluginPath = path.join(rootDir, "modern-flash.php");
  if (fs.existsSync(wpPluginPath)) {
    const wpRaw = fs.readFileSync(wpPluginPath, "utf8");
    const updatedWp = wpRaw
      .replace(/(\*\s+Version:\s+)\d+\.\d+\.\d+/, `$1${nextVersion}`)
      .replace(/(define\('MODERN_FLASH_VERSION',\s*')\d+\.\d+\.\d+('\);)/, `$1${nextVersion}$2`);
    if (wpRaw !== updatedWp && !options.dryRun) {
      fs.writeFileSync(wpPluginPath, updatedWp, "utf8");
    }
    updated.push({
      path: "modern-flash.php",
      name: "WordPress Plugin",
      oldVersion: currentVersion,
      newVersion: nextVersion,
    });
  }

  // Update Docker publish script default if present
  const dockerScriptPath = path.join(rootDir, "scripts", "publish-docker.sh");
  if (fs.existsSync(dockerScriptPath)) {
    const dockerRaw = fs.readFileSync(dockerScriptPath, "utf8");
    const updatedDocker = dockerRaw.replace(/(VERSION="\$\{2:-)\d+\.\d+\.\d+(\}")/, `$1${nextVersion}$2`);
    if (dockerRaw !== updatedDocker && !options.dryRun) {
      fs.writeFileSync(dockerScriptPath, updatedDocker, "utf8");
    }
  }

  return { currentVersion, nextVersion, updated };
}

// CLI entrypoint
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(decodeURI(new URL(import.meta.url).pathname))) {
  const start = performance.now();
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const filteredArgs = args.filter((a) => !a.startsWith("--"));
  const target = filteredArgs[0] || "patch";

  try {
    const result = bumpMonorepoVersion(target, { dryRun });
    const elapsed = (performance.now() - start).toFixed(2);

    console.log(`\x1b[38;5;220m╭───────────────────────────────────────────────────────────────────╮\x1b[0m`);
    console.log(`\x1b[38;5;220m│\x1b[0m  \x1b[1m\x1b[97mMonorepo Version Bump Guardrail\x1b[0m \x1b[2m\x1b[36mv${result.currentVersion} -> v${result.nextVersion}\x1b[0m                  \x1b[38;5;220m│\x1b[0m`);
    console.log(`\x1b[38;5;220m╰───────────────────────────────────────────────────────────────────╯\x1b[0m`);
    if (dryRun) {
      console.log(`\x1b[33m[DRY-RUN] No files modified.\x1b[0m`);
    }
    console.log(`Updated ${result.updated.length} manifests in ${elapsed}ms:`);
    for (const pkg of result.updated) {
      console.log(`  \x1b[32m✔\x1b[0m \x1b[1m${pkg.name}\x1b[0m \x1b[90m(${pkg.path})\x1b[0m \x1b[2m${pkg.oldVersion} ->\x1b[0m \x1b[36m${pkg.newVersion}\x1b[0m`);
    }
  } catch (err) {
    console.error(`\x1b[31mError bumping version: ${err.message}\x1b[0m`);
    process.exit(1);
  }
}
