# Baseline Agentic Control Surface

> **Developer Level**: Level 3 : Systems & Infrastructure ("Geek Tier")  
> **Technical Depth**: Deep Systems (Autonomous agent pairing contracts and quality gates)  
> **Audience**: Agentic engineers and maintainers configuring autonomous tooling.

This document defines the agentic control surface configured for this repository. It establishes predictable collaboration between developers, coding agents, and autonomous tooling.

## Architectural Objectives

Autonomous coding agents require explicit boundaries, reliable entry points, and deterministic feedback loops. The control surface provides:

1. **Clear Directives**: An explicit contract governing code standards, voice, and modification constraints.
2. **Defensive Boundaries**: Automated gates preventing accidental leakage of credentials or broken internal links.
3. **Machine Discovery**: Standardised index files allowing LLMs and agent crawlers to ingest repository context efficiently.
4. **Isolated Scratchpads**: Designated storage for exploratory scripts and transient artifacts without repository pollution.

---

## Control Surface Components

### 1. Operational Directives (`AGENTS.md`)

Located at the repository root, `AGENTS.md` serves as the primary system prompt anchor for autonomous agents. It declares:

- **Pack Ethos**: Impeccable discipline, zero conversational filler, and strict British English.
- **Surgical Modification Protocol**: Four-step cycle (Locate, Inspect, Patch, Verify) requiring targeted edits instead of indiscriminate file rewrites.
- **Stylistic Invariants**: Absolute ban on em-dash characters, prevention of artificial transition words, and prohibition of flowery padding.

### 2. Machine Discovery (`llms.txt` and `llms-full.txt`)

Following the standard machine discovery pattern:

- **`llms.txt`**: A clean, human-readable and machine-parseable index summarising project scope and linking to core documents.
- **`llms-full.txt`**: A zero-chrome concatenated technical corpus enabling deep context ingestion in a single read.

### 3. Automated Hygiene Gate (`scripts/verify-hygiene.py`)

A standalone Python runner enforcing Government Standard security and repository hygiene controls:

- **GS-AI-DATA-02 (Secret Detection)**: Scans for AWS tokens, GitHub PATs, private cryptographic keys, high-entropy tokens, and database connection strings.
- **GS-AI-CODE-02 (Link & Asset Integrity)**: Validates that all internal markdown links and HTML image references resolve cleanly on disk.
- **Pre-commit Integration**: `scripts/setup-hooks.sh` installs a local git pre-commit hook that verifies staged changes automatically before commits land.

### 4. Agent Workspace & Scratchpad (`.agents/`)

- **`.agents/scratch/`**: Safe sandbox for agents to create temporary scripts, test fixtures, or spike implementations. Excluded by `.gitignore` to prevent cluttering git history.
- **`.agents/skills/`**: Storage for repository-specific Antigravity agent skills.

---

## Operational Verification

Developers and agents verify the integrity of the workspace using the following commands:

```bash
# Run full repository security and link audit
python3 scripts/verify-hygiene.py

# Verify only staged git changes (fast pre-commit check)
python3 scripts/verify-hygiene.py --staged

# Setup automated git pre-commit hook
bash scripts/setup-hooks.sh
```
