# Tasks: v2.0.0 Major Release Preparation

**Spec:** doc/specs/v2-major-release-prep/02-specification.md
**Created:** 2026-01-08 15:55
**Last Updated:** 2026-01-08 15:55
**Last Decompose:** 2026-01-08 15:55

## Summary

| Status | Count |
|--------|-------|
| ⏳ Pending | 1 |
| 🔄 In Progress | 0 |
| ✅ Completed | 17 |
| **Total** | **18** |

---

## Phase 1: Package & Scripts (Core)

### Task 1.1: Update package.json
**Status:** ✅ completed
**Started:** 2026-01-08 15:25
**Completed:** 2026-01-08 15:26

**Completion Notes:**
- Bumped version to 2.0.0
- Updated description to be tool-agnostic
- Changed Node.js engine to >=20.0.0
- Removed npm engine constraint
- Removed claudekit dependency
**Priority:** high
**Depends On:** none

**Description:**
Update the package manifest to reflect v2.0.0 changes:

1. Bump version from `1.2.0` to `2.0.0`
2. Update description to be tool-agnostic
3. Lower Node.js engine requirement
4. Remove npm engine requirement
5. Remove claudekit dependency

**Changes to make in `package.json`:**

```json
{
  "version": "2.0.0",
  "description": "Workflow orchestration for AI-assisted development - seamless end-to-end feature development workflow",
  "engines": {
    "node": ">=20.0.0"
  },
  "dependencies": {
    "update-notifier": "^7.0.0"
  }
}
```

**Lines to modify:**
- Line 3: `"version": "1.2.0"` → `"version": "2.0.0"`
- Line 4: Update description
- Lines 45-48: Change engines block (remove npm, change node to >=20.0.0)
- Lines 49-52: Remove claudekit from dependencies

**Acceptance Criteria:**
- [ ] Version is `2.0.0`
- [ ] Description mentions "AI-assisted development" not "Claude Code"
- [ ] Node.js engine is `>=20.0.0`
- [ ] npm engine constraint is removed
- [ ] claudekit dependency is removed
- [ ] update-notifier dependency is preserved

**Files to Modify:**
- `package.json`

---

### Task 1.2: Update lib/setup.js - Remove ClaudeKit
**Status:** ✅ completed
**Started:** 2026-01-08 15:25
**Completed:** 2026-01-08 15:26

**Completion Notes:**
- Removed verifyClaudeKit() function call
- Removed runClaudeKitSetup() function entirely
- Made Claude Code CLI check informational (not required)
- Removed ClaudeKit integration from success summary
**Priority:** high
**Depends On:** none

**Description:**
Remove all ClaudeKit-related code from the setup script while preserving core functionality.

**Code to remove:**

1. **Delete `verifyClaudeKit()` function** (lines 150-166):
```javascript
async function verifyClaudeKit() {
  printInfo("Verifying ClaudeKit installation...");
  // ... entire function
}
```

2. **Delete `runClaudeKitSetup()` function** (lines 252-273):
```javascript
async function runClaudeKitSetup(mode) {
  printInfo("Running ClaudeKit setup...");
  // ... entire function
}
```

3. **Update `setup()` function** - Remove calls to deleted functions:
   - Remove line 78: `await verifyClaudeKit();`
   - Remove lines 89-90: `await runClaudeKitSetup(mode);`

4. **Update `printSuccessSummary()` function** (lines 275-302):
   - Remove line 283: `console.log('  ✓ ClaudeKit integration\n');`
   - Update the summary to not mention ClaudeKit

5. **Update `checkPrerequisites()` function** (lines 117-148):
   - Change Node.js version check from 20 to 20 (already correct, verify)
   - Keep Claude Code CLI check but make it informational (not required)

**Acceptance Criteria:**
- [ ] `verifyClaudeKit()` function is deleted
- [ ] `runClaudeKitSetup()` function is deleted
- [ ] No calls to ClaudeKit functions remain
- [ ] Success summary doesn't mention ClaudeKit
- [ ] Setup still creates directories and copies files
- [ ] Setup still initializes settings
- [ ] Node.js 20+ check works

**Files to Modify:**
- `lib/setup.js`

---

### Task 1.3: Update lib/doctor.js - Remove ClaudeKit Checks
**Status:** ✅ completed
**Started:** 2026-01-08 15:25
**Completed:** 2026-01-08 15:26

**Completion Notes:**
- Removed ClaudeKit version check block entirely
- Updated header comment to remove ClaudeKit from list
- Made Claude Code CLI check optional (not counted as issue)
- Removed ClaudeKit recommendation from troubleshooting
**Priority:** high
**Depends On:** none

**Description:**
Remove ClaudeKit diagnostic checks while preserving other checks.

**Code to remove:**

1. **Delete ClaudeKit check block** (lines 65-74):
```javascript
// Check ClaudeKit
let claudekitOk = false;
let claudekitVersion = 'not found';
try {
  claudekitVersion = execSync('claudekit --version', { encoding: 'utf8' }).trim();
  claudekitOk = true;
} catch (error) {
  issuesFound++;
}
printCheck('ClaudeKit', claudekitOk, claudekitVersion);
```

2. **Update recommendations section** (lines 158-163):
   - Remove: `if (!claudekitOk) { console.log('  - Install ClaudeKit: npm install -g claudekit'); }`

3. **Update header comment** (lines 1-11):
   - Remove "ClaudeKit installation" from the checks list

4. **Update Claude Code CLI check** to be optional:
   - Change from required (causes issuesFound++) to informational
   - Update message to indicate it's optional for other tools

**Acceptance Criteria:**
- [ ] ClaudeKit check block is deleted
- [ ] ClaudeKit recommendation is removed
- [ ] Header comment doesn't mention ClaudeKit
- [ ] Claude Code CLI shows as "optional" not required
- [ ] Node.js 20+ check works
- [ ] npm check works
- [ ] Directory structure checks work

**Files to Modify:**
- `lib/doctor.js`

---

### Task 1.4: Update bin/claudeflow.js (if needed)
**Status:** ✅ completed
**Started:** 2026-01-08 15:25
**Completed:** 2026-01-08 15:26

**Completion Notes:**
- Updated help text from "Claude Code" to "AI-assisted development"
- No other ClaudeKit references were found in this file
**Priority:** low
**Depends On:** none

**Description:**
Check the CLI entry point for any ClaudeKit references in help text or messaging.

**Review and update if needed:**
- Help text that mentions ClaudeKit
- Version output that mentions ClaudeKit
- Any ClaudeKit-specific command handling

**Acceptance Criteria:**
- [ ] No ClaudeKit references in help output
- [ ] No ClaudeKit references in version output
- [ ] CLI works correctly after changes

**Files to Modify:**
- `bin/claudeflow.js`

---

## Phase 2: Settings & Templates

### Task 2.1: Update templates/project-config/settings.json
**Status:** ✅ completed
**Started:** 2026-01-08 15:27
**Completed:** 2026-01-08 15:28

**Completion Notes:**
- Removed Bash(stm:*) permissions (both occurrences)
- Removed Bash(claudekit:*) permission
- Removed all hook configurations
- Removed environmentVariables section
- Kept essential permissions (Read, Edit, Write, git, npm, node, npx, mkdir, ls, cat, grep, find)
**Priority:** high
**Depends On:** none

**Description:**
Simplify the settings template by removing ClaudeKit/STM permissions and unnecessary hooks.

**Current file has these issues:**
- Line 10: `"Bash(stm:*)"` - remove (STM dependency)
- Line 12: `"Bash(stm:*)"` - remove (duplicate)
- Line 13: `"Bash(claudekit:*)"` - remove (ClaudeKit dependency)
- Lines 44-67: Hook configurations - simplify or remove

**New simplified content:**
```json
{
  "permissions": {
    "allow": [
      "Read",
      "Edit",
      "Write",
      "Bash(git:*)",
      "Bash(npm:*)",
      "Bash(node:*)",
      "Bash(npx:*)",
      "Bash(mkdir:*)",
      "Bash(ls:*)",
      "Bash(cat:*)",
      "Bash(grep:*)",
      "Bash(find:*)"
    ],
    "deny": [
      ".env",
      ".env.*",
      "**/*.key",
      "**/*.pem",
      ".git/**"
    ]
  }
}
```

**Acceptance Criteria:**
- [ ] `Bash(stm:*)` permissions removed
- [ ] `Bash(claudekit:*)` permission removed
- [ ] Duplicate entries removed
- [ ] Hook configurations removed (not needed for standalone)
- [ ] Essential permissions preserved (Read, Edit, Write, git, npm, node)
- [ ] File permissions deny list preserved

**Files to Modify:**
- `templates/project-config/settings.json`

---

### Task 2.2: Update .claude/settings.json.example
**Status:** ✅ completed
**Started:** 2026-01-08 15:27
**Completed:** 2026-01-08 15:28

**Completion Notes:**
- Removed all ClaudeKit hooks (PreToolUse, PostToolUse, Stop, UserPromptSubmit)
- Removed environmentVariables section
- Added additional essential permissions to match project-config template
- File now matches simplified template from Task 2.1
**Priority:** medium
**Depends On:** Task 2.1

**Description:**
Update the example settings file to match the simplified template.

**Check if file exists and update similarly to Task 2.1.**

**Acceptance Criteria:**
- [ ] File matches simplified template from Task 2.1
- [ ] No ClaudeKit/STM references

**Files to Modify:**
- `.claude/settings.json.example` (if exists)

---

## Phase 3: Primary Documentation

### Task 3.1: Update README.md - Structure and Sections
**Status:** ✅ completed
**Started:** 2026-01-08 15:29
**Completed:** 2026-01-08 15:32

**Completion Notes:**
- Added "What's New in v2" banner after badges
- Removed flowchart image reference
- Removed Three-Layer Architecture section
- Removed ClaudeKit Agents, Commands, and Hooks sections
- Updated all specs/ paths to doc/specs/
- Updated Node.js requirement to 20+
- Simplified workflow diagram to remove STM references
- Updated usage examples with new paths
- Removed ClaudeKit troubleshooting sections
**Priority:** high
**Depends On:** Phase 1 tasks

**Description:**
Major structural updates to README.md. This is the largest documentation task.

**Sections to REMOVE entirely:**
- "Three-Layer Architecture" section and diagram
- "ClaudeKit Agents (30+)" section
- "ClaudeKit Commands (20+)" section
- "ClaudeKit Hooks (25+)" section
- Any "How They Work Together" tables referencing ClaudeKit
- The flowchart image reference: `![Claudeflow](docs/Claudeflow.jpg)`

**Sections to UPDATE:**
1. **Title/header** - Remove "ClaudeKit" from subtitle
2. **Quick Start > Prerequisites** - Change Node.js from 22.14+ to 20+
3. **What This Repository Provides** - Focus on workflow commands/skills only
4. **Repository Structure** - Update to reflect current structure
5. **Standard Workflow** - Update to new command structure:
   - `/brainstorm:start` → `/brainstorm:clarify` → `/brainstorm:spec`
   - `/spec:refine` → `/spec:decompose` → `/spec:execute`
   - `/feedback:add` → `/feedback:resolve`
6. **All path references** - Change `specs/` to `doc/specs/`
7. **Usage Examples** - Remove stm commands, update paths

**Sections to ADD:**
1. **"What's New in v2" banner** at the top after badges:
```markdown
## What's New in v2

**claudeflow v2.0.0** is a major release with breaking changes:

- **Standalone package** - No external dependencies (ClaudeKit/STM removed)
- **Simplified installation** - Just `npm install` and `claudeflow setup`
- **Tool-agnostic** - Works with Claude Code, OpenCode, and other AI tools
- **New workflow** - Streamlined command structure

See [CHANGELOG.md](CHANGELOG.md) for full details.
```

**Acceptance Criteria:**
- [ ] No ClaudeKit references (except historical in changelog mention)
- [ ] No STM references
- [ ] Node.js requirement shows 20+
- [ ] All `specs/` paths changed to `doc/specs/`
- [ ] Workflow diagram shows new command structure
- [ ] "What's New in v2" banner added
- [ ] Three-layer architecture section removed
- [ ] Agent/hooks sections removed

**Files to Modify:**
- `README.md`

---

### Task 3.2: Update CLAUDE.md
**Status:** ✅ completed
**Started:** 2026-01-08 15:29
**Completed:** 2026-01-08 15:33

**Completion Notes:**
- Removed ClaudeKit Agents Available section
- Removed Configuration Hooks section
- Updated all specs/ paths to doc/specs/
- Removed STM command references
- Updated Node.js requirement to 20+
- Added v2.0.0 to version history
- Updated architecture description to standalone model
- Removed Optional Enhancements section (STM)
**Priority:** high
**Depends On:** Phase 1 tasks

**Description:**
Update the project context file to reflect standalone workflow.

**Changes needed:**
1. Remove "ClaudeKit Agents Available" section
2. Remove "Configuration Hooks" section with hook examples
3. Update "Core Workflow" to new command structure
4. Change all `specs/` references to `doc/specs/`
5. Update "Architecture" description - remove three-layer model
6. Remove STM references (stm list, stm add commands)
7. Update Node.js version from 22.14+ to 20+

**Acceptance Criteria:**
- [ ] No ClaudeKit agent references
- [ ] No hook configuration examples
- [ ] No STM command references
- [ ] Workflow shows new command structure
- [ ] All paths use `doc/specs/`
- [ ] Node.js requirement is 20+

**Files to Modify:**
- `CLAUDE.md`

---

### Task 3.3: Add CHANGELOG.md v2.0.0 Section
**Status:** ✅ completed
**Started:** 2026-01-08 15:29
**Completed:** 2026-01-08 15:30

**Completion Notes:**
- Added v2.0.0 section at top of CHANGELOG.md
- Documented all breaking changes
- Listed all removed items
- Date set to 2026-01-08
**Priority:** high
**Depends On:** Phase 1, Phase 2 tasks

**Description:**
Add the v2.0.0 release section at the top of the changelog.

**Content to add (at top, after header):**
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
- Updated package description to be tool-agnostic

### Removed
- ClaudeKit hooks configuration
- ClaudeKit agents documentation
- STM task tracking commands
- Outdated flowchart image (docs/Claudeflow.jpg)
- npm engine version constraint
```

**Acceptance Criteria:**
- [ ] v2.0.0 section added at top of changelog
- [ ] Breaking changes clearly listed
- [ ] All removed items documented
- [ ] Date placeholder ready to be filled on release

**Files to Modify:**
- `CHANGELOG.md`

---

### Task 3.4: Delete docs/Claudeflow.jpg
**Status:** ✅ completed
**Started:** 2026-01-08 15:33
**Completed:** 2026-01-08 15:33

**Completion Notes:**
- File deleted successfully
- README.md image reference already removed in Task 3.1
**Priority:** medium
**Depends On:** Task 3.1 (README update removes reference first)

**Description:**
Delete the outdated flowchart image.

**Command:**
```bash
rm docs/Claudeflow.jpg
```

**Acceptance Criteria:**
- [ ] File deleted
- [ ] No broken image references in README (verify Task 3.1 removed it)

**Files to Modify:**
- `docs/Claudeflow.jpg` (delete)

---

## Phase 4: Secondary Documentation

### Task 4.1: Update docs/SETUP_GUIDE.md
**Status:** ⏳ pending
**Priority:** medium
**Depends On:** Phase 3 tasks

**Description:**
Update setup guide to remove ClaudeKit references and update paths.

**Changes:**
- Remove ClaudeKit installation steps
- Update Node.js version requirement
- Change `specs/` to `doc/specs/`
- Update workflow examples

**Acceptance Criteria:**
- [ ] No ClaudeKit references
- [ ] No STM references
- [ ] Paths use `doc/specs/`
- [ ] Node.js shows 20+

**Files to Modify:**
- `docs/SETUP_GUIDE.md`

---

### Task 4.2: Update docs/INSTALLATION_GUIDE.md
**Status:** ⏳ pending
**Priority:** medium
**Depends On:** Phase 3 tasks

**Description:**
Update installation guide for standalone workflow.

**Changes:**
- Remove ClaudeKit prerequisite
- Update Node.js version
- Simplify installation steps
- Remove STM references

**Acceptance Criteria:**
- [ ] No ClaudeKit prerequisite listed
- [ ] No STM references
- [ ] Node.js shows 20+
- [ ] Installation steps are simplified

**Files to Modify:**
- `docs/INSTALLATION_GUIDE.md`

---

### Task 4.3: Update docs/SECURITY.md
**Status:** 🔄 in_progress
**Started:** 2026-01-08 15:35
**Priority:** medium
**Depends On:** none

**Description:**
Update security documentation for reduced dependency footprint.

**Changes:**
- Update dependency list (remove claudekit)
- Note reduced attack surface
- Update any ClaudeKit-specific security notes

**Acceptance Criteria:**
- [ ] No ClaudeKit in dependency list
- [ ] Security benefits of fewer deps noted

**Files to Modify:**
- `docs/SECURITY.md`

---

### Task 4.4: Update docs/DESIGN_RATIONALE.md
**Status:** 🔄 in_progress
**Started:** 2026-01-08 15:35
**Priority:** medium
**Depends On:** none

**Description:**
Update design rationale for standalone architecture.

**Changes:**
- Remove three-layer architecture rationale
- Update to reflect single-layer "workflow commands" focus
- Remove ClaudeKit integration rationale

**Acceptance Criteria:**
- [ ] Architecture reflects standalone model
- [ ] No ClaudeKit integration rationale

**Files to Modify:**
- `docs/DESIGN_RATIONALE.md`

---

### Task 4.5: Update docs/PERMISSIONS_AUDIT.md
**Status:** ⏳ pending
**Priority:** low
**Depends On:** Task 2.1

**Description:**
Update permissions audit to reflect simplified settings.

**Changes:**
- Remove claudekit/stm permissions from audit
- Update to match new settings template

**Acceptance Criteria:**
- [ ] Permissions match simplified template
- [ ] No ClaudeKit/STM permissions listed

**Files to Modify:**
- `docs/PERMISSIONS_AUDIT.md`

---

### Task 4.6: Update docs/guides/feedback-workflow-guide.md
**Status:** 🔄 in_progress
**Started:** 2026-01-08 15:35
**Priority:** medium
**Depends On:** none

**Description:**
Update feedback workflow guide for new command structure.

**Changes:**
- Update command examples to new structure
- Change `specs/` to `doc/specs/`
- Remove STM task references

**Acceptance Criteria:**
- [ ] Commands use new structure
- [ ] Paths use `doc/specs/`
- [ ] No STM references

**Files to Modify:**
- `docs/guides/feedback-workflow-guide.md`

---

### Task 4.7: Update docs/api/feedback-workflow.md
**Status:** 🔄 in_progress
**Started:** 2026-01-08 15:35
**Priority:** medium
**Depends On:** none

**Description:**
Update API documentation for feedback workflow.

**Changes:**
- Update command signatures
- Change `specs/` to `doc/specs/`

**Acceptance Criteria:**
- [ ] API docs reflect new commands
- [ ] Paths use `doc/specs/`

**Files to Modify:**
- `docs/api/feedback-workflow.md`

---

### Task 4.8: Update .claude/README.md
**Status:** ⏳ pending
**Priority:** medium
**Depends On:** Phase 3 tasks

**Description:**
Update the .claude directory README.

**Changes:**
- Remove ClaudeKit integration documentation
- Update command list to current structure
- Remove hook documentation
- Change `specs/` to `doc/specs/`

**Acceptance Criteria:**
- [ ] No ClaudeKit references
- [ ] Command list is current
- [ ] No hook documentation
- [ ] Paths use `doc/specs/`

**Files to Modify:**
- `.claude/README.md`

---

## Phase 5: Verification

### Task 5.1: Run Verification Checks
**Status:** ⏳ pending
**Priority:** high
**Depends On:** All previous tasks

**Description:**
Run comprehensive verification to ensure all changes are complete.

**Verification steps:**

1. **Search for remaining ClaudeKit references:**
```bash
grep -r "claudekit" --include="*.md" --include="*.json" --include="*.js" . | grep -v CHANGELOG | grep -v node_modules | grep -v 03-tasks.md
```
Should return empty (except changelog historical entries).

2. **Search for remaining STM references:**
```bash
grep -r "stm" --include="*.md" --include="*.json" --include="*.js" . | grep -v CHANGELOG | grep -v node_modules | grep -v 03-tasks.md
```
Should return empty (except changelog historical entries).

3. **Search for old specs/ paths (should be doc/specs/):**
```bash
grep -r "specs/" --include="*.md" . | grep -v "doc/specs/" | grep -v node_modules | grep -v CHANGELOG
```
Should return empty.

4. **Run claudeflow doctor:**
```bash
node bin/claudeflow.js doctor
```
Should pass without ClaudeKit checks.

5. **Verify package.json is valid:**
```bash
node -e "require('./package.json')"
```
Should not error.

**Acceptance Criteria:**
- [ ] No ClaudeKit references found (except changelog)
- [ ] No STM references found (except changelog)
- [ ] All `specs/` paths are `doc/specs/`
- [ ] `claudeflow doctor` passes
- [ ] package.json is valid JSON
- [ ] Node.js 20+ check works in doctor

**Files to Modify:**
- None (verification only)

---

## Parallelization Strategy

Tasks that can be executed in parallel (no dependencies between them):

### Parallel Group 1 (Phase 1 - Independent Scripts)
- Task 1.1: Update package.json
- Task 1.2: Update lib/setup.js
- Task 1.3: Update lib/doctor.js
- Task 1.4: Update bin/claudeflow.js

### Parallel Group 2 (Phase 2 - Settings)
- Task 2.1: Update templates/project-config/settings.json
- Task 2.2: Update .claude/settings.json.example

### Parallel Group 3 (Phase 4 - Independent Docs)
- Task 4.3: Update docs/SECURITY.md
- Task 4.4: Update docs/DESIGN_RATIONALE.md
- Task 4.6: Update docs/guides/feedback-workflow-guide.md
- Task 4.7: Update docs/api/feedback-workflow.md

### Sequential Dependencies
Tasks that must be executed in order:
1. Phase 1 (any) → Task 3.1 (README needs script changes done first for accuracy)
2. Phase 1 (any) → Task 3.2 (CLAUDE.md needs script changes done first)
3. Task 2.1 → Task 2.2 (example should match template)
4. Task 3.1 → Task 3.4 (delete image after README removes reference)
5. Phase 1-4 → Task 5.1 (verification after all changes)
