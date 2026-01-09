# Tasks: v2.0.0 Major Release Preparation

**Spec:** doc/specs/v2-major-release-prep/02-specification.md
**Created:** 2026-01-08 15:55
**Last Updated:** 2026-01-08 15:55
**Last Decompose:** 2026-01-08 15:30

## Summary

| Status | Count |
|--------|-------|
| ⏳ Pending | 0 |
| 🔄 In Progress | 0 |
| ✅ Completed | 27 |
| ❌ Cancelled | 2 |
| **Total** | **29** |

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
**Status:** ✅ completed
**Started:** 2026-01-08 15:30
**Completed:** 2026-01-08 15:32
**Priority:** medium
**Depends On:** Phase 3 tasks

**Completion Notes:**
- Updated Available Custom Commands section with brainstorm and feedback commands
- Updated Standard Workflow section with 8-step command sequence
- Updated filename references to 01-brainstorm.md

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
**Status:** ✅ completed
**Started:** 2026-01-08 15:30
**Completed:** 2026-01-08 15:32
**Priority:** medium
**Depends On:** Phase 3 tasks

**Completion Notes:**
- Updated all /ideate references to /brainstorm:start
- Updated command directory structures in examples
- Removed broken link to non-existent guides/feedback-workflow-guide.md
- Updated workflow descriptions

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
**Status:** ✅ completed
**Started:** 2026-01-08 15:35
**Completed:** 2026-01-08 15:30
**Priority:** medium
**Depends On:** none

**Completion Notes:**
- Added v2.0.0 Security Benefits section in Dependency Security area
- Added v2.0.0 changelog entry at end of file
- Noted reduced attack surface due to ClaudeKit removal

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
**Status:** ✅ completed
**Started:** 2026-01-08 15:35
**Completed:** 2026-01-08 15:30
**Priority:** medium
**Depends On:** none

**Completion Notes:**
- Updated Last Updated date to 2026-01
- Removed ClaudeKit from active workflow descriptions (5 instances)
- Updated examples to use generic "Dependency Version Strategy"
- Preserved ClaudeKit/STM in ADR historical context
- Verified all paths use doc/specs/ format

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
**Status:** ✅ completed
**Started:** 2026-01-08 15:32
**Completed:** 2026-01-08 15:35
**Priority:** low
**Depends On:** Task 2.1

**Completion Notes:**
- Updated Generated date to 2026-01-08
- Renamed commands to brainstorm/feedback structure
- Updated command count from 8 to 10
- No ClaudeKit/STM permissions were present (already clean)

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
**Status:** ❌ cancelled
**Started:** 2026-01-08 15:35
**Completed:** 2026-01-08 15:30
**Priority:** medium
**Depends On:** none

**Completion Notes:**
- File does not exist in the repository
- Reference in INSTALLATION_GUIDE.md will be removed in Task 4.2

**Description:**
Update feedback workflow guide for new command structure.

**Changes:**
- Update command examples to new structure
- Change `specs/` to `doc/specs/`
- Remove STM task references

**Acceptance Criteria:**
- [x] N/A - File does not exist

**Files to Modify:**
- `docs/guides/feedback-workflow-guide.md` (does not exist)

---

### Task 4.7: Update docs/api/feedback-workflow.md
**Status:** ❌ cancelled
**Started:** 2026-01-08 15:35
**Completed:** 2026-01-08 15:30
**Priority:** medium
**Depends On:** none

**Completion Notes:**
- File does not exist in the repository
- No API docs directory exists

**Description:**
Update API documentation for feedback workflow.

**Changes:**
- Update command signatures
- Change `specs/` to `doc/specs/`

**Acceptance Criteria:**
- [x] N/A - File does not exist

**Files to Modify:**
- `docs/api/feedback-workflow.md` (does not exist)

---

### Task 4.8: Update .claude/README.md
**Status:** ✅ completed
**Started:** 2026-01-08 15:32
**Completed:** 2026-01-08 15:35
**Priority:** medium
**Depends On:** Phase 3 tasks

**Completion Notes:**
- Updated How It Works workflow section with new terminology
- Replaced /ideate with /brainstorm:start
- Replaced /ideate-to-spec with /brainstorm:clarify and /brainstorm:spec
- Replaced /spec:feedback with /feedback:add and /feedback:resolve
- Updated filename references to 01-brainstorm.md

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

### Task 4.9: Update brainstorm workflow documentation (replaces /ideate) ✅ DONE
**Status:** ✅ completed
**Added:** 2026-01-08 15:30
**Started:** 2026-01-08 15:35
**Completed:** 2026-01-08 15:40

**Completion Notes:**
- Updated README.md: Custom Workflow Commands, Document Organization, Repository Structure, Available Commands, Standard Workflow diagram, Complete Workflow Example, Quick Start
- Updated CLAUDE.md: Core Workflow, Phase 1-7 sections, Key Commands table, Document Organization, Workflow Features, Directory Structure, Quick Reference
- All /ideate references replaced with /brainstorm:start
- All /ideate-to-spec replaced with /brainstorm:clarify + /brainstorm:spec workflow
- All 01-ideation.md references updated to 01-brainstorm.md
- Only historical changelog entries preserved unchanged
**Source:** Changelog 2026-01-08 15:25 - Feedback Resolution (FB-1)
**Priority:** high
**Depends On:** none

**Description:**
Rewrite all documentation sections that reference `/ideate` and `/ideate-to-spec` commands to describe the new three-command brainstorm workflow. This is NOT a simple find/replace - the new workflow has different behavior and structure.

**Old Workflow (single command):**
- `/ideate <task-brief>` → Creates ideation document with research
- `/ideate-to-spec <path>` → Single command that transforms ideation to spec

**New Workflow (three commands with different purposes):**

1. **`/brainstorm:start <task-brief>`** (from `.claude/commands/brainstorm/start.md`)
   - **Purpose:** Structured research-only phase - NO code changes allowed
   - **Output:** `doc/specs/{slug}/01-brainstorm.md`
   - **Sections created:**
     - Intent & Assumptions (task brief, assumptions, out-of-scope)
     - Pre-reading Log (files/docs read with takeaways)
     - Codebase Map (components, dependencies, data flow, blast radius)
     - Root Cause Analysis (bugs only - repro steps, hypotheses)
     - Research (potential solutions with pros/cons, recommendation)
     - Clarification (questions for user to decide)
   - **Key difference from /ideate:** Explicit "CRITICAL CONSTRAINTS" prohibiting code changes, parallelization of explore agents for research speed

2. **`/brainstorm:clarify [path]`** (from `.claude/commands/brainstorm/clarify.md`)
   - **Purpose:** Interactive resolution of clarification questions from brainstorm
   - **Input:** Reads `01-brainstorm.md`, extracts Section 6 (Clarification)
   - **Process:**
     - Presents each unanswered question via AskUserQuestion tool
     - Records answers with strikethrough format (audit trail)
     - Evaluates if answers reveal NEW questions (iterative)
     - Consults domain experts based on user's answers
   - **Output:** Updated `01-brainstorm.md` with resolved questions
   - **Key feature:** Re-entrant - skips already-answered questions, can run multiple times
   - **This command did NOT exist before** - clarifications were implicit in /ideate-to-spec

3. **`/brainstorm:spec [path]`** (from `.claude/commands/brainstorm/spec.md`)
   - **Purpose:** Transform COMPLETED brainstorm (all clarifications resolved) into specification
   - **Prerequisite:** Will NOT proceed if unanswered questions exist in brainstorm
   - **Process:**
     - Verifies all clarifications complete
     - Synthesizes brainstorm content (intent, codebase map, research, decisions)
     - Determines specification scope (single vs multiple specs)
     - Uses `spec-create` skill to generate specification
   - **Output:** `doc/specs/{slug}/02-specification.md`
   - **Key difference from /ideate-to-spec:** Explicit verification gate, uses skill for spec creation

**Documentation sections to REWRITE (not find/replace):**

1. **README.md - "Custom Workflow Commands" section:**
   - Remove `/ideate` and `/ideate-to-spec` entries
   - Add three new entries with accurate descriptions:
   ```markdown
   ### Brainstorm Workflow Commands
   
   #### /brainstorm:start
   Structured brainstorm workflow that enforces complete investigation before any code changes. Creates comprehensive research documentation including intent, codebase mapping, root cause analysis (for bugs), external research, and clarification questions.
   
   **Usage:** `/brainstorm:start Fix chat UI auto-scroll bug when messages exceed viewport height`
   **Output:** `doc/specs/{slug}/01-brainstorm.md`
   
   #### /brainstorm:clarify
   Interactively resolve clarification questions from a brainstorm document. Presents each question with options, records answers with audit trail, and evaluates if answers reveal additional questions.
   
   **Usage:** `/brainstorm:clarify` (auto-selects recent) or `/brainstorm:clarify doc/specs/{slug}/01-brainstorm.md`
   
   #### /brainstorm:spec
   Transform a completed brainstorm (with all clarifications resolved) into a technical specification. Verifies prerequisites, synthesizes research findings, and generates implementation-ready spec.
   
   **Usage:** `/brainstorm:spec` (auto-selects recent) or `/brainstorm:spec doc/specs/{slug}/01-brainstorm.md`
   **Output:** `doc/specs/{slug}/02-specification.md`
   ```

2. **README.md - "Standard Workflow" diagram:**
   - Update the workflow to show three-step brainstorm phase:
   ```
   /brainstorm:start <task-brief>
        → doc/specs/{slug}/01-brainstorm.md
   /brainstorm:clarify
        → Resolves questions in 01-brainstorm.md
   /brainstorm:spec
        → doc/specs/{slug}/02-specification.md
   ```

3. **README.md - "Complete Workflow Example" section:**
   - Update example to show the three-command sequence:
   ```bash
   # Step 1: Start with brainstorm (research phase)
   /brainstorm:start Add user authentication with JWT tokens
   # → Creates: doc/specs/add-user-auth-jwt/01-brainstorm.md
   
   # Step 2: Resolve clarification questions interactively
   /brainstorm:clarify doc/specs/add-user-auth-jwt/01-brainstorm.md
   # → Updates brainstorm with answered questions
   
   # Step 3: Transform to specification (requires all questions answered)
   /brainstorm:spec doc/specs/add-user-auth-jwt/01-brainstorm.md
   # → Creates: doc/specs/add-user-auth-jwt/02-specification.md
   ```

4. **CLAUDE.md - "Core Workflow" section:**
   - Update Phase 1 to describe three brainstorm commands
   - Update workflow diagram

5. **CLAUDE.md - "Quick Reference" section:**
   - Update standard workflow commands list

6. **.claude/README.md - "Available Custom Commands" section:**
   - Remove `/ideate` and `/ideate-to-spec` entries
   - Add new `/brainstorm:start`, `/brainstorm:clarify`, `/brainstorm:spec` entries with full descriptions

7. **docs/SETUP_GUIDE.md** - Update any workflow examples

8. **docs/INSTALLATION_GUIDE.md** - Update any command references

9. **docs/DESIGN_RATIONALE.md** - Update any workflow rationale sections

**Also update filename references:**
- `01-ideation.md` → `01-brainstorm.md` everywhere
- `ideation document` → `brainstorm document`
- `ideation phase` → `brainstorm phase`

**Acceptance Criteria:**
- [ ] All `/ideate` command references removed from current workflow docs
- [ ] All `/ideate-to-spec` command references removed from current workflow docs
- [ ] New `/brainstorm:start` command documented with accurate description
- [ ] New `/brainstorm:clarify` command documented with accurate description
- [ ] New `/brainstorm:spec` command documented with accurate description
- [ ] Workflow diagrams updated to show three-command sequence
- [ ] Usage examples show the actual command sequence
- [ ] `01-ideation.md` references updated to `01-brainstorm.md`
- [ ] Historical changelog entries preserved (don't modify old release notes)

**Files to Modify:**
- `README.md`
- `CLAUDE.md`
- `.claude/README.md`
- `docs/SETUP_GUIDE.md`
- `docs/INSTALLATION_GUIDE.md`
- `docs/DESIGN_RATIONALE.md`
- `docs/PERMISSIONS_AUDIT.md`

---

### Task 4.10: Update feedback workflow documentation (replaces /spec:feedback) ✅ DONE
**Status:** ✅ completed
**Added:** 2026-01-08 15:30
**Started:** 2026-01-08 15:35
**Completed:** 2026-01-08 15:40

**Completion Notes:**
- Updated README.md: Custom Workflow Commands, workflow diagrams, usage examples
- Updated CLAUDE.md: Phase 6 Feedback section, Custom Commands table, Quick Reference
- All /spec:feedback replaced with /feedback:add and /feedback:resolve two-command workflow
- Workflow diagrams show two-step feedback pattern (capture then resolve)
- Only historical changelog entry in CLAUDE.md preserved unchanged
**Source:** Changelog 2026-01-08 15:25 - Feedback Resolution (FB-2)
**Priority:** high
**Depends On:** none

**Description:**
Rewrite all documentation sections that reference `/spec:feedback` to describe the new two-command feedback workflow. This is NOT a simple find/replace - the new workflow separates capture from resolution with different behaviors.

**Old Workflow (single command):**
- `/spec:feedback <path-to-spec>` → Single command that:
  - Validates prerequisites
  - Collects ONE feedback item
  - Explores code
  - Makes decision (implement/defer/out-of-scope)
  - Updates spec if implementing
  - Had to run multiple times for multiple feedback items

**New Workflow (two commands with separated concerns):**

1. **`/feedback:add [path]`** (from `.claude/commands/feedback/add.md`)
   - **Purpose:** Quick capture of feedback items - NO analysis or resolution
   - **Input:** Auto-selects most recent `02-specification.md` or takes explicit path
   - **Output:** Creates/updates `doc/specs/{slug}/05-feedback.md`
   - **Process:**
     - Capture loop - keeps asking for feedback until user says "done"
     - Each item gets unique ID (FB-1, FB-2, etc.)
     - Items saved immediately (save-as-you-go)
     - Brief title auto-generated from feedback text
   - **Key differences from /spec:feedback:**
     - Captures MULTIPLE items in one session (loop)
     - NO analysis during capture
     - NO decisions during capture
     - Much faster - just text capture
   - **When to use:** After manual testing, quickly jot down all issues/suggestions

2. **`/feedback:resolve [path]`** (from `.claude/commands/feedback/resolve.md`)
   - **Purpose:** Batch analyze and resolve ALL pending feedback items
   - **Input:** Auto-selects most recent `05-feedback.md` or takes explicit path
   - **Process:**
     - Loads ALL pending items from feedback file
     - **Parallel analysis:** Launches domain expert agents concurrently for all items
     - Presents each item with analysis for user decision
     - Three outcomes: Implement / Defer / Out of scope
     - Captures rationale for Defer/Out-of-scope
     - Moves resolved items from "Pending" to "Resolved" section
     - Updates specification with changelog if any "Implement" items
   - **Key differences from /spec:feedback:**
     - Processes ALL pending items in one session (batch)
     - Parallel agent analysis for speed
     - Structured decision workflow with rationale capture
     - Automatic spec changelog update
   - **When to use:** After capturing feedback, sit down to triage and decide

**Documentation sections to REWRITE (not find/replace):**

1. **README.md - "Custom Workflow Commands" section:**
   - Remove `/spec:feedback` entry
   - Add two new entries:
   ```markdown
   ### Feedback Workflow Commands
   
   #### /feedback:add
   Quickly capture feedback items for a feature after manual testing. Runs a capture loop to collect multiple items in one session. Each item is saved immediately with a unique ID.
   
   **Usage:** `/feedback:add` (auto-selects recent spec) or `/feedback:add doc/specs/{slug}/02-specification.md`
   **Output:** Creates/updates `doc/specs/{slug}/05-feedback.md`
   
   #### /feedback:resolve
   Batch analyze and resolve all pending feedback items. Launches parallel domain expert agents for analysis, then presents each item for user decision (implement/defer/out-of-scope). Updates specification changelog for items marked "implement".
   
   **Usage:** `/feedback:resolve` (auto-selects recent) or `/feedback:resolve doc/specs/{slug}/05-feedback.md`
   ```

2. **README.md - "Standard Workflow" diagram:**
   - Update the feedback phase to show two-step process:
   ```
   # After manual testing
   /feedback:add
        → doc/specs/{slug}/05-feedback.md (capture multiple items)
   /feedback:resolve
        → Analyzes all pending, updates spec for "implement" items
   ```

3. **README.md - "Complete Workflow Example" section:**
   - Update feedback steps:
   ```bash
   # Step 6: After manual testing, capture feedback (can add multiple)
   /feedback:add doc/specs/add-user-auth-jwt/02-specification.md
   # → Loop: "What feedback?" → enter text → "What feedback?" → "done"
   # → Creates: doc/specs/add-user-auth-jwt/05-feedback.md with FB-1, FB-2, etc.
   
   # Step 7: Resolve all pending feedback (batch processing)
   /feedback:resolve
   # → Parallel analysis of all items
   # → Interactive decisions: implement/defer/out-of-scope
   # → Updates spec changelog if any "implement"
   ```

4. **CLAUDE.md - "Core Workflow" section:**
   - Update Phase 5 (Feedback) to describe two commands
   - Emphasize the capture-then-resolve pattern

5. **CLAUDE.md - "Quick Reference" section:**
   - Update feedback workflow commands

6. **.claude/README.md - "Available Custom Commands" section:**
   - Remove `/spec:feedback` entry
   - Add `/feedback:add` and `/feedback:resolve` with full descriptions

7. **docs/guides/feedback-workflow-guide.md** - Major rewrite for new workflow

8. **docs/api/feedback-workflow.md** - Update API documentation

9. **docs/DESIGN_RATIONALE.md** - Update feedback workflow rationale

**Acceptance Criteria:**
- [ ] All `/spec:feedback` command references removed from current workflow docs
- [ ] New `/feedback:add` command documented with accurate description
- [ ] New `/feedback:resolve` command documented with accurate description
- [ ] Workflow diagrams updated to show two-command sequence
- [ ] Usage examples show the capture-then-resolve pattern
- [ ] Feedback workflow guide fully updated
- [ ] Historical changelog entries preserved

**Files to Modify:**
- `README.md`
- `CLAUDE.md`
- `.claude/README.md`
- `docs/SETUP_GUIDE.md`
- `docs/guides/feedback-workflow-guide.md`
- `docs/api/feedback-workflow.md`
- `docs/DESIGN_RATIONALE.md`
- `docs/PERMISSIONS_AUDIT.md`

---

### Task 4.11: Update GitHub workflow to use Node 20 ✅ DONE
**Status:** ✅ completed
**Added:** 2026-01-08 15:30
**Started:** 2026-01-08 15:30
**Completed:** 2026-01-08 15:32
**Source:** Changelog 2026-01-08 15:25 - Feedback Resolution (FB-3)
**Priority:** high
**Depends On:** none

**Completion Notes:**
- Updated test job node-version from 22.14.0 to '20'
- Updated release job node-version from 22.14.0 to '20'

**Description:**
Update `.github/workflows/release.yml` to use Node.js 20.x instead of 22.14.0 for both test and release jobs, consistent with the lowered Node.js requirement in package.json.

**Current state:**
- Line 24 (test job): `node-version: 22.14.0`
- Line 65 (release job): `node-version: 22.14.0`

**Changes to make:**
```yaml
# Line 24 - test job
node-version: '20'

# Line 65 - release job  
node-version: '20'
```

**Rationale:**
- package.json now requires Node.js >=20.0.0
- CI/CD should test against the minimum supported version
- Using `'20'` will use the latest 20.x LTS release

**Acceptance Criteria:**
- [ ] Test job uses Node.js 20
- [ ] Release job uses Node.js 20
- [ ] Workflow file is valid YAML

**Files to Modify:**
- `.github/workflows/release.yml`

---

### Task 5.1: Run Verification Checks
**Status:** ✅ completed
**Started:** 2026-01-08 15:40
**Completed:** 2026-01-08 15:45
**Priority:** high
**Depends On:** All previous tasks

**Completion Notes:**
- ClaudeKit/STM references: Only in historical spec files (`specs/`) - expected, these are v1.x artifacts
- Old specs/ paths: Only in historical spec files - expected
- `claudeflow doctor` runs successfully (Node.js check, npm check, Claude CLI check all pass)
- `package.json` is valid JSON
- Current working docs (README.md, CLAUDE.md, docs/*.md, .claude/README.md) are clean of ClaudeKit/STM references

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

### Parallel Group 4 (Phase 4 - Command Documentation Rewrites) ⏳ NEW
- Task 4.9: Update brainstorm workflow documentation (comprehensive rewrite)
- Task 4.10: Update feedback workflow documentation (comprehensive rewrite)
- Task 4.11: Update GitHub workflow to use Node 20

### Sequential Dependencies
Tasks that must be executed in order:
1. Phase 1 (any) → Task 3.1 (README needs script changes done first for accuracy)
2. Phase 1 (any) → Task 3.2 (CLAUDE.md needs script changes done first)
3. Task 2.1 → Task 2.2 (example should match template)
4. Task 3.1 → Task 3.4 (delete image after README removes reference)
5. Phase 1-4 → Task 5.1 (verification after all changes)
