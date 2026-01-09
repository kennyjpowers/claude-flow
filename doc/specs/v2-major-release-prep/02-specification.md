# Specification: v2.0.0 Major Release Preparation

**Status:** Draft
**Slug:** v2-major-release-prep
**Author:** Claude Code
**Created:** 2026-01-08
**Brainstorm:** [01-brainstorm.md](./01-brainstorm.md)

---

## 1. Overview

Prepare claudeflow for a v2.0.0 major release that removes all dependencies on ClaudeKit and simple-task-master (STM), simplifies the installer, and updates all documentation to reflect the new standalone workflow. This is a breaking change that positions claudeflow as a focused workflow command/skill package, agnostic to the underlying agentic orchestration tool.

## 2. Problem Statement

The current v1.x codebase has tight coupling to ClaudeKit and STM:
- `package.json` lists `claudekit: ^0.9.0` as a dependency
- `lib/setup.js` verifies ClaudeKit and runs `claudekit setup`
- `lib/doctor.js` checks for ClaudeKit installation
- Documentation extensively references ClaudeKit agents, hooks, and STM commands
- Settings templates include ClaudeKit/STM bash permissions
- The "three-layer architecture" framing is outdated

Commands have already been refactored to work standalone, but the package metadata, installer, diagnostics, and documentation still reference the old dependencies.

## 3. Goals

1. **Remove ClaudeKit dependency** - Delete from package.json, setup.js, doctor.js
2. **Remove STM dependency** - Remove all STM references from docs and settings
3. **Lower Node.js requirement** - From 22.14+ to 20+ (LTS)
4. **Update documentation** - Moderate rewrite focusing on workflow commands/skills
5. **Simplify settings template** - Minimal permissions for commands/skills only
6. **Add v2 changelog entry** - Document breaking changes
7. **Add README banner** - "What's New in v2" section for visibility

## 4. Non-Goals

- Adding new features or commands
- Changing command behavior (already done)
- Creating new commands
- Making the package fully tool-agnostic (future goal, out of scope)
- Writing a separate migration guide (changelog is sufficient)
- Rewriting documentation from scratch (moderate updates only)

## 5. Dependencies

### Build-Time
- Node.js 20+ (lowered from 22.14+)
- npm/yarn/pnpm (unchanged)

### Runtime
- `update-notifier` package (keep for version notifications)
- Claude Code CLI or compatible tool (unchanged)

### Removed Dependencies
- `claudekit` npm package
- `simple-task-master` (stm) CLI tool

## 6. Design

### 6.1 Package Manifest Changes (`package.json`)

```json
{
  "name": "@33strategies/claudeflow",
  "version": "2.0.0",
  "description": "Workflow orchestration for AI-assisted development - seamless end-to-end feature development workflow",
  "engines": {
    "node": ">=20.0.0"
    // Remove: "npm": ">=9.0.0" (unnecessary constraint)
  },
  "dependencies": {
    "update-notifier": "^7.0.0"
  }
  // Remove: "claudekit": "^0.9.0"
}
```

### 6.2 Setup Script Changes (`lib/setup.js`)

Remove:
- ClaudeKit verification check
- `claudekit setup` invocation
- Any ClaudeKit-specific messaging

Keep:
- Directory creation logic
- Command file copying
- Settings template copying
- Success/error messaging

### 6.3 Doctor Script Changes (`lib/doctor.js`)

Remove checks for:
- ClaudeKit installation
- ClaudeKit version

Keep checks for:
- Node.js version (update to 20+)
- npm availability
- Claude Code CLI (or note it's optional for other tools)

### 6.4 Documentation Updates

**README.md** (moderate rewrite):
- Remove flowchart image (`docs/Claudeflow.jpg`)
- Add "What's New in v2" banner section at top
- Remove "Three-Layer Architecture" section entirely
- Remove "ClaudeKit Agents" section entirely
- Remove "ClaudeKit Commands" section entirely  
- Remove "ClaudeKit Hooks" section entirely
- Update "What This Repository Provides" to focus on workflow commands/skills
- Update all `specs/` references to `doc/specs/`
- Update Node.js requirement from 22.14+ to 20+
- Remove STM references (stm list, stm add, etc.)
- Update workflow diagram to new command structure
- Simplify "Quick Start" and "Installation" sections

**CLAUDE.md** (moderate rewrite):
- Remove ClaudeKit agent references
- Remove STM command references
- Update workflow to new command structure
- Update `specs/` to `doc/specs/`
- Remove hooks configuration examples

**CHANGELOG.md** (add v2.0.0 section):
```markdown
## [2.0.0] - 2026-01-XX

### Breaking Changes
- Removed ClaudeKit dependency - claudeflow is now fully standalone
- Removed simple-task-master (STM) integration - task tracking via 03-tasks.md
- Lowered Node.js requirement from 22.14+ to 20+
- Specs directory changed from `specs/` to `doc/specs/`

### Changed
- Simplified setup process (no ClaudeKit verification)
- Simplified doctor diagnostics (no ClaudeKit checks)
- Updated all documentation for standalone workflow
- Simplified settings template (minimal permissions)

### Removed
- ClaudeKit hooks configuration
- ClaudeKit agents documentation
- STM task tracking commands
- Outdated flowchart image
```

**Other docs to update** (reference fixes):
- `docs/SETUP_GUIDE.md`
- `docs/SECURITY.md`
- `docs/DESIGN_RATIONALE.md`
- `docs/INSTALLATION_GUIDE.md`
- `docs/PERMISSIONS_AUDIT.md`
- `docs/guides/feedback-workflow-guide.md`
- `docs/api/feedback-workflow.md`
- `.claude/README.md`

### 6.5 Settings Template Changes

**`templates/project-config/settings.json`**:

Remove:
- `Bash(claudekit:*)` permission
- `Bash(stm:*)` permission
- Hook configurations referencing ClaudeKit

Keep:
- Basic file permissions (Read, Write, Edit)
- Git permissions if needed by commands
- Minimal bash permissions for command execution

### 6.6 Files to Delete

- `docs/Claudeflow.jpg` (outdated flowchart image)

## 7. User Experience

### Installation (Simplified)
```bash
npm install -g @33strategies/claudeflow
claudeflow setup
```

No ClaudeKit verification step. No secondary `claudekit setup` invocation.

### Doctor Output (Simplified)
```
claudeflow doctor

Checking prerequisites...
  Node.js: 20.11.0 (required: >=20.0.0)
  npm: 10.2.0
  Claude Code CLI: Installed (optional)

Checking installation...
  Commands directory: ~/.claude/commands/ (12 commands)
  Settings template: Present

All checks passed!
```

### Workflow (Unchanged Commands, Updated Paths)
```
/brainstorm:start <task-brief>
     -> doc/specs/{slug}/01-brainstorm.md
/brainstorm:clarify [path]
/brainstorm:spec [path]
     -> doc/specs/{slug}/02-specification.md
/spec:refine [path]
/spec:decompose [path]
     -> doc/specs/{slug}/03-tasks.md
/spec:execute [path]
     -> doc/specs/{slug}/04-implementation.md
/feedback:add [path]
     -> doc/specs/{slug}/05-feedback.md
/feedback:resolve [path]
```

## 8. Testing Strategy

### Manual Testing Checklist

1. **Fresh install test:**
   - `npm install -g @33strategies/claudeflow` (from npm)
   - `claudeflow setup --global`
   - Verify commands copied to `~/.claude/commands/`
   - Verify no ClaudeKit errors

2. **Doctor command test:**
   - `claudeflow doctor`
   - Verify no ClaudeKit checks
   - Verify Node.js 20+ check

3. **Workflow test:**
   - Run through complete workflow with new command paths
   - Verify `doc/specs/` directory structure works

4. **Documentation review:**
   - No ClaudeKit references remain (except historical changelog)
   - No STM references remain (except historical changelog)
   - All `specs/` paths updated to `doc/specs/`

## 9. Performance Considerations

- **Faster setup:** Removing ClaudeKit verification and setup reduces installation time
- **Smaller dependency tree:** Removing claudekit reduces npm install time
- **No runtime impact:** Commands already work standalone

## 10. Security Considerations

- **Reduced attack surface:** Fewer dependencies = fewer potential vulnerabilities
- **Simplified permissions:** Settings template has minimal required permissions
- **No credential changes:** Package publishing workflow unchanged

## 11. Documentation Requirements

All documentation changes are part of the core deliverable (see Section 6.4).

## 12. Implementation Phases

### Phase 1: Package & Scripts (Core)
1. Update `package.json` (version, engines, remove claudekit dep)
2. Update `lib/setup.js` (remove ClaudeKit logic)
3. Update `lib/doctor.js` (remove ClaudeKit checks)
4. Update `bin/claudeflow.js` (if any ClaudeKit refs in help text)

### Phase 2: Settings & Templates
1. Update `templates/project-config/settings.json`
2. Update `.claude/settings.json.example` if exists
3. Remove ClaudeKit/STM bash permissions

### Phase 3: Primary Documentation
1. Update `README.md` (major updates, add v2 banner)
2. Update `CLAUDE.md` (workflow and reference updates)
3. Add `CHANGELOG.md` v2.0.0 section
4. Delete `docs/Claudeflow.jpg`

### Phase 4: Secondary Documentation
1. Update `docs/SETUP_GUIDE.md`
2. Update `docs/INSTALLATION_GUIDE.md`
3. Update `docs/SECURITY.md`
4. Update `docs/DESIGN_RATIONALE.md`
5. Update `docs/PERMISSIONS_AUDIT.md`
6. Update `docs/guides/feedback-workflow-guide.md`
7. Update `docs/api/feedback-workflow.md`
8. Update `.claude/README.md`

### Phase 5: Verification
1. Run `claudeflow doctor` locally
2. Test fresh install flow
3. Search for remaining ClaudeKit/STM references
4. Review all path references (`specs/` -> `doc/specs/`)

## 13. Open Questions

None - all clarifications resolved during brainstorming.

## 14. References

- [01-brainstorm.md](./01-brainstorm.md) - Original brainstorm document
- [CHANGELOG.md](/CHANGELOG.md) - Version history
- [package.json](/package.json) - Current package manifest

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-01-08 | Initial specification created from brainstorm | Claude Code |

### 2026-01-08 15:25 - Feedback Resolution

**Source:** /feedback:resolve
**Feedback Items:** FB-1, FB-2, FB-3

**Changes:**
- Section 6.4: Added documentation update requirements for command renames
- Section 12 Phase 3-4: Added tasks for updating command references in docs

**New Requirements:**
- Replace all `/ideate` command references with `/brainstorm:start` in documentation
- Replace all `/ideate-to-spec` command references with `/brainstorm:clarify` + `/brainstorm:spec` workflow in documentation
- Replace all `01-ideation.md` filename references with `01-brainstorm.md` in documentation
- Replace all `/spec:feedback` command references with `/feedback:add` + `/feedback:resolve` workflow in documentation
- Update `.github/workflows/release.yml` to use Node.js 20.x instead of 22.14.0 for both test and release jobs
