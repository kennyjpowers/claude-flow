# v2.0.0 Major Release Preparation

**Slug:** v2-major-release-prep
**Author:** Claude Code
**Date:** 2026-01-08
**Branch:** preflight/v2-major-release-prep
**Related:** Previous v1.2.0 release

---

## 1) Intent & Assumptions

- **Task brief:** Prepare claudeflow for a v2.0.0 major release that removes all dependencies on ClaudeKit and simple-task-master (STM), simplifies the installer, updates all documentation to reflect the new standalone workflow (`/brainstorm:start` → `/brainstorm:clarify` → `/brainstorm:spec` → `/spec:refine` → `/spec:decompose` → `/spec:execute` → `/feedback:add` → `/feedback:resolve` → loop), and creates appropriate release notes and changelog entries.

- **Assumptions:**
  - Commands have already been refactored to work without claudekit/stm dependencies
  - The new workflow command structure exists (brainstorm/*, spec/*, feedback/*)
  - This is a breaking change justifying a major version bump (v1.x → v2.0.0)
  - The package will remain an npm package (`@33strategies/claudeflow`)
  - Task tracking is now handled via markdown files (`03-tasks.md`) instead of external STM
  - The user wants comprehensive documentation updates, not just minimal changes

- **Out of scope:**
  - Adding new features beyond workflow documentation
  - Changing the core command behavior (already done)
  - Creating new commands
  - Rewriting existing commands (only documentation about them)
  - Major architectural changes to the package structure

## 2) Pre-reading Log

- `package.json`: Current v1.2.0, has `claudekit: ^0.9.0` as dependency, `update-notifier` for version checks
- `bin/claudeflow.js`: CLI entry point with setup, doctor, version, help commands
- `lib/setup.js`: Verifies ClaudeKit, runs `claudekit setup` after copying files
- `lib/doctor.js`: Checks Node.js, npm, Claude Code CLI, ClaudeKit installation
- `README.md`: 1034 lines, heavily references ClaudeKit/STM throughout, documents old workflow
- `CLAUDE.md`: Project context file, references ClaudeKit agents, STM commands, old workflow
- `CHANGELOG.md`: 323 lines, documents v1.0.0-v1.2.0 releases with ClaudeKit integration
- `.claude/commands/brainstorm/`: New command structure - start.md, clarify.md, spec.md
- `.claude/commands/spec/`: create.md, validate.md, refine.md, decompose.md, execute.md, doc-update.md
- `.claude/commands/feedback/`: add.md, resolve.md
- `templates/project-config/settings.json`: Contains `Bash(claudekit:*)` and `Bash(stm:*)` permissions
- `docs/`: Multiple guide files with ClaudeKit/STM references

## 3) Codebase Map

### Primary Components to Modify

| Component | Path | Role | v2 Changes Needed |
|-----------|------|------|-------------------|
| Package manifest | `package.json` | npm metadata, dependencies | Remove claudekit dependency, bump to 2.0.0 |
| CLI entry | `bin/claudeflow.js` | Command routing | Update help text if workflow changes |
| Setup script | `lib/setup.js` | Installation logic | Remove claudekit verification and setup steps |
| Doctor script | `lib/doctor.js` | Diagnostics | Remove claudekit checks |
| Main README | `README.md` | Primary documentation | Complete rewrite of workflow, remove ClaudeKit refs |
| Context file | `CLAUDE.md` | AI context | Update workflow, remove ClaudeKit/STM refs |
| Changelog | `CHANGELOG.md` | Version history | Add v2.0.0 section |
| Settings template | `templates/project-config/settings.json` | Permissions | Remove claudekit/stm bash permissions |
| .claude README | `.claude/README.md` | Command documentation | Update workflow, remove ClaudeKit refs |

### Shared Dependencies
- Node.js 22.14+ (can potentially lower this if claudekit was the reason)
- npm/yarn/pnpm (no change)
- Claude Code CLI (no change)
- `update-notifier` package (keep for version notifications)

### Data Flow (New Workflow)
```
/brainstorm:start <task-brief>
       ↓
  doc/specs/{slug}/01-brainstorm.md
       ↓
/brainstorm:clarify [path]
       ↓
  (resolves clarification questions)
       ↓
/brainstorm:spec [path]
       ↓
  doc/specs/{slug}/02-specification.md
       ↓
/spec:refine [path]
       ↓
  (resolves validation feedback iteratively)
       ↓
/spec:decompose [path]
       ↓
  doc/specs/{slug}/03-tasks.md
       ↓
/spec:execute [path]
       ↓
  doc/specs/{slug}/04-implementation.md
       ↓
  (manual testing)
       ↓
/feedback:add [path]
       ↓
  doc/specs/{slug}/05-feedback.md
       ↓
/feedback:resolve [path]
       ↓
  (updates spec changelog if implementing)
       ↓
/spec:decompose (incremental mode)
       ↓
/spec:execute (resume mode)
       ↓
  (repeat feedback loop as needed)
```

### Feature Directories
- Specs now live in `doc/specs/{slug}/` (changed from `specs/`)
- Old locations still referenced in some docs

### Potential Blast Radius
- **High Impact:**
  - README.md (primary user-facing documentation)
  - CLAUDE.md (affects AI assistant behavior)
  - lib/setup.js (installation flow changes)
  - lib/doctor.js (diagnostic checks change)
  - package.json (dependency and version changes)
  
- **Medium Impact:**
  - docs/* (multiple guide files)
  - templates/* (settings templates)
  - .claude/README.md (command documentation)
  
- **Low Impact:**
  - Old spec files in `specs/` (historical, can leave alone)
  - bin/claudeflow.js (minor help text updates)

## 4) Root Cause Analysis

N/A - This is a feature/refactoring task, not a bug fix.

## 5) Research

### Files with ClaudeKit/STM References (from explore agent)

**Critical files requiring updates:**
1. `package.json` - `claudekit: ^0.9.0` dependency
2. `lib/setup.js` - ClaudeKit verification and setup calls
3. `lib/doctor.js` - ClaudeKit diagnostic checks
4. `README.md` - 50+ references throughout
5. `CLAUDE.md` - Extensive ClaudeKit agent and workflow references
6. `templates/project-config/settings.json` - Bash permissions for claudekit/stm
7. `.claude/README.md` - ClaudeKit integration documentation

**Documentation files with references:**
- `docs/SETUP_GUIDE.md`
- `docs/SECURITY.md`
- `docs/DESIGN_RATIONALE.md`
- `docs/INSTALLATION_GUIDE.md`
- `docs/PERMISSIONS_AUDIT.md`
- `docs/guides/feedback-workflow-guide.md`
- `docs/api/feedback-workflow.md`

**Historical spec files (can leave as-is for history):**
- `specs/add-feedback-workflow-command/*`
- `specs/feat-spec-organization/*`
- `specs/package-publishing-strategy/*`
- `specs/spec-open-questions-workflow/*`

### Potential Approaches

**Approach 1: Complete Removal (Recommended)**
- Remove claudekit from package.json dependencies
- Rewrite setup.js to only copy commands and create directories
- Rewrite doctor.js to check only Node.js, npm, Claude CLI
- Update all documentation to reflect standalone workflow
- **Pros:** Clean break, simpler installation, no external dependencies
- **Cons:** Breaking change for existing users, significant doc rewrite

**Approach 2: Optional ClaudeKit**
- Keep claudekit as optional peer dependency
- Setup detects if available and integrates
- **Pros:** Backward compatible
- **Cons:** Complexity, confusing UX, two code paths

**Approach 3: Deprecation Period**
- v2.0.0 warns about ClaudeKit deprecation
- v3.0.0 fully removes
- **Pros:** Gradual migration
- **Cons:** Delays cleanup, prolonged maintenance burden

### Recommendation

**Approach 1: Complete Removal** is recommended because:
- Commands already refactored to work standalone
- Task tracking via `03-tasks.md` replaces STM entirely
- Cleaner user experience with fewer dependencies
- Major version bump (v2.0.0) is appropriate time for breaking change
- Simplifies installation and reduces failure points

## 6) Clarification

1. ~~**Node.js Version Requirement**~~ (RESOLVED)
   **Answer:** Lower to 20+ - LTS version, widely adopted, good balance of features and compatibility

2. ~~**Documentation Completeness**~~ (RESOLVED)
   **Answer:** Moderate - Update workflow sections, fix references, keep good content. Also remove the flowchart image (docs/Claudeflow.jpg) as it is out of date.

3. ~~**Migration Guide**~~ (RESOLVED)
   **Answer:** No - Changelog is sufficient, no separate migration guide needed.

4. ~~**Old Spec Directory**~~ (RESOLVED)
   **Answer:** Migrate references - Update all docs to use `doc/specs/` consistently.

5. ~~**Update Notifier**~~ (RESOLVED)
   **Answer:** Keep it - Users get notified of new versions automatically.

6. ~~**Hooks/Agents Section**~~ (RESOLVED)
   **Answer:** Remove entirely - Get rid of any insinuation that this project adds "agents". This repo is now exclusively focused on workflow commands and skills.

7. ~~**Three-Layer Architecture**~~ (RESOLVED)
   **Answer:** Single layer - Just "claudeflow workflow commands". Future goal (out of scope for v2) is to make this workflow agnostic to what agentic orchestration tool is being used (already testing with OpenCode in addition to Claude Code).

8. ~~**Settings Template**~~ (RESOLVED)
   **Answer:** Simpler settings template - Remove hook configurations, keep basic structure. Permissions should be minimal to just what's needed by the commands and skills in this project.

9. ~~**Release Notes Location**~~ (RESOLVED)
   **Answer:** CHANGELOG only - Standard approach, single source of truth.

10. ~~**Breaking Change Communication**~~ (RESOLVED)
    **Answer:** README banner on v2 - Prominent "What's New in v2" section to communicate breaking changes.
