# claudeflow - AI-Assisted Development Workflow

## Project Overview

**claudeflow** is a workflow orchestration npm package that provides a complete end-to-end feature development lifecycle for AI-assisted development. It provides custom workflow commands that work with Claude Code, OpenCode, and other AI development tools.

**Version:** 2.0.0 (January 2026)
**Package:** @33strategies/claudeflow
**Distribution:** npm, yarn, pnpm

## Architecture

Standalone workflow package providing custom commands for AI-assisted feature development.

**System Requirements:**
- Node.js 20+
- npm/yarn/pnpm (any package manager)
- AI coding assistant (Claude Code, OpenCode, etc.) - optional but recommended

See [docs/INSTALLATION_GUIDE.md](docs/INSTALLATION_GUIDE.md) for detailed prerequisites and installation instructions.

## Core Workflow

Complete feature lifecycle in 6 phases:

```
BRAINSTORM → CLARIFY → SPECIFICATION → DECOMPOSITION → IMPLEMENTATION → FEEDBACK → COMPLETION
```

### Phase 1: Brainstorm
- **Command:** `/brainstorm:start <task-brief>`
- **Output:** `doc/specs/<slug>/01-brainstorm.md`
- **Purpose:** Enforce complete investigation before code changes
- **Includes:** Intent, pre-reading, codebase mapping, root cause analysis, research, clarifications

### Phase 2: Clarify
- **Command:** `/brainstorm:clarify <path-to-brainstorm>`
- **Output:** Updates `doc/specs/<slug>/01-brainstorm.md` with resolved questions
- **Purpose:** Resolve open questions interactively before creating specification
- **Process:** Detect questions → present with context → record answers → re-validate

### Phase 3: Specification
- **Command:** `/brainstorm:spec <path-to-brainstorm>`
- **Output:** `doc/specs/<slug>/02-specification.md`
- **Purpose:** Transform brainstorm into validated technical specification
- **Process:** Extract decisions → build spec → validate

### Phase 4: Decomposition
- **Command:** `/spec:decompose <path-to-spec>`
- **Output:** `doc/specs/<slug>/03-tasks.md`
- **Purpose:** Break specification into actionable tasks
- **Pattern:** Full implementation details copied into tasks (NOT summaries)

### Phase 5: Implementation
- **Command:** `/spec:execute <path-to-spec>`
- **Output:** `doc/specs/<slug>/04-implementation.md`
- **Purpose:** Implement tasks incrementally with session continuity
- **Process:** For each task: implement → test → code review → fix → commit
- **Tracks:** Progress, files modified, tests added, known issues, next steps

### Phase 6: Feedback
- **Commands:** `/feedback:add` then `/feedback:resolve`
- **Output:** `doc/specs/<slug>/05-feedback.md`
- **Purpose:** Capture and process post-implementation feedback with structured decisions
- **Two-Step Process:**
  1. **Capture:** `/feedback:add` - Loop to capture multiple feedback items (save-as-you-go)
  2. **Resolve:** `/feedback:resolve` - Batch analyze and resolve all pending items
- **Decision Outcomes:**
  - **Implement Now:** Update spec changelog → incremental `/spec:decompose` → resume `/spec:execute`
  - **Defer:** Log for future consideration in feedback file
  - **Out of Scope:** Log decision with rationale → no further action
- **Integration:** Works with incremental `/spec:decompose` and resume `/spec:execute`

### Phase 7: Completion
- **Commands:** `/spec:doc-update`, git commit & push
- **Purpose:** Finalize changes, update documentation, push to remote

## Key Commands

### Custom Commands (6)
| Command | Purpose |
|---------|---------|
| `/brainstorm:start <task-brief>` | Structured investigation workflow |
| `/brainstorm:clarify <path>` | Resolve open questions interactively |
| `/brainstorm:spec <path>` | Transform brainstorm → validated spec |
| `/feedback:add [path]` | Quick capture of feedback items |
| `/feedback:resolve [path]` | Batch analyze and resolve pending feedback |
| `/spec:doc-update <path>` | Review docs with parallel agents |

### Command Overrides (4)
Enhanced versions of spec commands:

| Command | Enhancement |
|---------|------------|
| `/spec:create <desc>` | Feature-directory aware with output path detection |
| `/spec:decompose <path>` | Incremental mode: preserves completed work, creates only new tasks |
| `/spec:execute <path>` | Resume mode: continues from previous session, skips completed work |
| `/spec:migrate` | Convert old flat structure to feature directories

## Document Organization

**Feature-Based Directories** - All docs for a feature in one place:

```
doc/specs/<feature-slug>/
├── 01-brainstorm.md        # Investigation & research
├── 02-specification.md     # Technical specification
├── 03-tasks.md             # Task breakdown
├── 04-implementation.md    # Progress tracking
└── 05-feedback.md          # Post-implementation feedback log
```

**Benefits:**
- Single source of truth per feature
- Clear lifecycle progression (01 → 02 → 03 → 04)
- Easy to find related documents
- Git-friendly tracking

## Workflow Features

### Interactive Question Resolution

The `/brainstorm:clarify` command provides automatic open questions resolution to ensure brainstorm documents are ready for specification creation:

**How It Works:**
1. System detects "Open Questions" section in brainstorm document
2. Presents each unanswered question interactively with context
3. Records answers with audit trail (strikethrough format)
4. Updates document incrementally (save-as-you-go)
5. Re-validates and loops until all questions resolved
6. Summary shows all resolved questions

**Key Features:**
- Progress indicators show "Question X of Y"
- Multi-select support for questions requiring multiple choices
- Strikethrough format preserves original question context
- Backward compatible (skips if no questions)
- Re-entrant (skips already-answered questions)
- External edit detection prevents data loss

**Backward Compatibility:**
- Documents without "Open Questions" section skip resolution steps entirely
- Already-answered questions (containing "Answer:") are skipped automatically
- Re-entrant: Can run multiple times, only processes unanswered questions

**Error Handling:**
- Edit failures automatically retry after re-reading document
- External edits detected via re-parsing on each loop iteration
- Validation failures for non-question issues prompt user interactively
- Manual intervention requested only when automated recovery fails

**Example Workflow:**
```bash
/brainstorm:clarify doc/specs/my-feature/01-brainstorm.md
# → Detects 5 open questions
# → Presents questions interactively
# → Question 1 of 5: Package Manager Support?
# → User answers each question
# → Document updated with strikethrough answers
# → Re-validates until complete
# → Summary shows 5 questions resolved
```

**Technical Implementation:**
- Uses only built-in AI coding tools (Read, Edit, Grep)
- No external dependencies or npm packages required
- Save-as-you-go approach enables recovery if interrupted

## Important Conventions

### Content Preservation Pattern
**CRITICAL:** When creating tasks, copy full implementation details from spec - DO NOT summarize or reference.

### Configuration Hierarchy
5-tier precedence (highest to lowest):
1. Enterprise policies
2. CLI arguments
3. Local settings (`.claude/settings.local.json` - gitignored)
4. Project settings (`.claude/settings.json` - committed)
5. User settings (`~/.claude/settings.json` - global)

### Specification Requirements
Valid specs must include 18 sections:
- Title, status, overview, problem, goals, non-goals
- Dependencies, design, UX, testing, performance, security
- Documentation, phases, open questions, references
- NO time/effort estimations

### Testing Convention
- Each test has purpose comment explaining why it exists
- Tests validate real behavior, not just passing
- Include edge cases to catch regressions
- Minimum 80% coverage on business logic

### Code Review Pattern
Two-pass review required:
1. **Completeness Check** - All spec requirements implemented?
2. **Quality Check** - Code quality, security, error handling, coverage

Tasks marked DONE only when:
- Implementation COMPLETE
- All CRITICAL issues fixed
- All tests passing
- Quality standards met

### Commit Convention
Follow conventional commits:
```
<type>(<scope>): <description>

<body>
<footer>
```
Types: feat, fix, docs, style, refactor, test, chore

## Directory Structure

```
claudeflow/                    # npm package (@33strategies/claudeflow)
├── package.json               # npm package metadata
├── bin/
│   └── claudeflow.js          # CLI entry point
├── lib/
│   ├── setup.js               # Installation logic
│   ├── doctor.js              # Diagnostics
│   └── utils/                 # Cross-platform utilities
├── .claude/                   # Distributed in package
│   ├── commands/              # Custom slash commands
│   │   ├── brainstorm/        # Brainstorming workflow commands
│   │   │   ├── start.md       # Structured brainstorming workflow
│   │   │   ├── clarify.md     # Resolve open questions
│   │   │   └── spec.md        # Transform brainstorm to spec
│   │   └── spec/              # Spec command overrides
│   ├── settings.json.example  # Configuration template
│   └── README.md
├── templates/
│   ├── project-config/        # Team-level templates
│   └── user-config/           # Personal templates
├── doc/specs/                 # Feature specifications (not in package)
│   └── <feature-slug>/        # Feature directory
├── docs/                      # Documentation
├── LICENSE                    # MIT License
├── CHANGELOG.md               # Auto-generated
└── CLAUDE.md                  # This file
```

## Installation

**Quick Install:**
```bash
npm install -g @33strategies/claudeflow
claudeflow setup                    # Interactive mode
# OR: claudeflow setup --global     # Install to ~/.claude/
# OR: claudeflow setup --project    # Install to ./.claude/
```

**Alternative Package Managers:**
```bash
yarn global add @33strategies/claudeflow
pnpm add -g @33strategies/claudeflow
```

**Diagnostics:**
```bash
claudeflow doctor                   # Verify installation health
```

**For detailed installation instructions, troubleshooting, and migration from install.sh, see:**
- [docs/INSTALLATION_GUIDE.md](docs/INSTALLATION_GUIDE.md) - Complete installation guide
- [README.md](README.md#troubleshooting) - Troubleshooting section

## Quick Reference

### First-Time Setup
```bash
npm install -g @33strategies/claudeflow
claudeflow setup
claudeflow doctor    # Verify installation
```

### Standard Workflow
```bash
/brainstorm:start <task-brief>
/brainstorm:clarify doc/specs/<slug>/01-brainstorm.md
/brainstorm:spec doc/specs/<slug>/01-brainstorm.md
/spec:decompose doc/specs/<slug>/02-specification.md
/spec:execute doc/specs/<slug>/02-specification.md

# After manual testing, capture and resolve feedback
/feedback:add doc/specs/<slug>/02-specification.md    # Capture multiple items
/feedback:resolve doc/specs/<slug>/05-feedback.md     # Batch analyze & decide
# (For each item: implement/defer/out-of-scope)
# If any "implement": spec updated, then run:
/spec:decompose doc/specs/<slug>/02-specification.md  # Incremental mode
/spec:execute doc/specs/<slug>/02-specification.md    # Resume mode

# Final steps
/spec:doc-update doc/specs/<slug>/02-specification.md
```

### Quick Start (Skip Brainstorming)
```bash
/spec:create <description>
/spec:decompose doc/specs/<slug>/02-specification.md
/spec:execute doc/specs/<slug>/02-specification.md
```

### Migrate Existing Project
```bash
/spec:migrate
```

## Key Files

| File | Purpose |
|------|---------|
| `README.md` | Comprehensive guide |
| `CHANGELOG.md` | Version history |
| `docs/DESIGN_RATIONALE.md` | Design validation and best practices |
| `.claude/README.md` | Component documentation |
| `docs/INSTALLATION_GUIDE.md` | Detailed installation guidance |
| `templates/*/CLAUDE.md` | Context templates |

## Best Practices

1. **Security First** - Never commit secrets
2. **Team Collaboration** - Commit settings.json and CLAUDE.md, gitignore local overrides
3. **Content Preservation** - Copy full details into tasks, not summaries
4. **Task Organization** - Always tag with `feature:<slug>`
5. **Session Continuity** - `/spec:execute` reads previous progress
6. **Documentation Updates** - Use `/spec:doc-update` after implementation

## Common Issues

**Installation problems?** Run `claudeflow doctor` for diagnostics
**Commands not loading?** Verify with `claudeflow doctor`, restart Claude Code
**Hooks not running?** Check settings precedence (local overrides project)
**Migration needed?** Use `/spec:migrate` to convert old structure

**For comprehensive troubleshooting, see [README.md](README.md#troubleshooting)**

## Version History

**v2.0.0 (January 2026):**
- **Standalone:** Removed ClaudeKit dependency - fully standalone package
- **Simplified:** Removed STM integration - task tracking via 03-tasks.md
- **Requirements:** Lowered Node.js from 22.14+ to 20+
- **Paths:** Specs directory changed from `specs/` to `doc/specs/`
- **Tool-Agnostic:** Works with Claude Code, OpenCode, and other AI tools

**v1.2.0 (Nov 21, 2025):**
- **Distribution:** Published to npm as @33strategies/claudeflow
- **Installation:** Cross-platform CLI (`claudeflow setup`) replaces install.sh
- **Diagnostics:** New `claudeflow doctor` command
- **Updates:** Automatic weekly update notifications
- **CI/CD:** Automated releases via semantic-release with npm provenance
- **Platforms:** Full Windows, macOS, Linux support
- **Package Managers:** Works with npm, yarn, pnpm
- **Interactive Question Resolution:** Automatic detection and resolution of open questions in `/ideate-to-spec`
- **Strikethrough Audit Trail:** Questions marked resolved with strikethrough format preserving history
- **Validation Loop:** Re-validation and iteration until all questions answered
- **Feedback Workflow:** New `/spec:feedback` command for post-implementation feedback
- **Incremental Mode:** `/spec:decompose` preserves completed work
- **Resume Mode:** `/spec:execute` session continuity across runs
- **Feedback Log:** New `05-feedback.md` format
- **Integration:** Seamless feedback → decompose → execute loop
- **License:** MIT License
- **Security:** npm provenance attestations (SLSA Level 2)

**v1.1.0 (Nov 21, 2025):**
- Feature-based directory structure
- Removed `/spec:progress`
- Feature task tagging in 03-tasks.md
- Session continuity in `/spec:execute`
- Migration command `/spec:migrate`
- Enhanced overrides for spec commands
- Make sure you don't treat specs about writing commands like it's writing code. Commands require writing structured markdown documentation that
  will guide Claude Code, not about writing code.
- Don't over-engineer command prompts