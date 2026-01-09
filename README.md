# claudeflow - Workflow Orchestration for AI-Assisted Development

[![npm version](https://img.shields.io/npm/v/@33strategies/claudeflow.svg)](https://www.npmjs.com/package/@33strategies/claudeflow)
[![npm downloads](https://img.shields.io/npm/dm/@33strategies/claudeflow.svg)](https://www.npmjs.com/package/@33strategies/claudeflow)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](https://nodejs.org/)

Workflow commands for seamless end-to-end feature development with AI coding assistants. Works with Claude Code, OpenCode, and other AI development tools.

## What's New in v2

**claudeflow v2.0.0** is a major release with breaking changes:

- **Standalone package** - No external dependencies (ClaudeKit/STM removed)
- **Simplified installation** - Just `npm install` and `claudeflow setup`
- **Tool-agnostic** - Works with Claude Code, OpenCode, and other AI tools
- **Lower requirements** - Node.js 20+ (down from 22.14+)
- **Streamlined workflow** - Focus on workflow commands only

See [CHANGELOG.md](CHANGELOG.md) for full details.

## Quick Start

### Installation

> **Prerequisites:** Node.js 20+ 
> Check version: `node --version` | Install: https://nodejs.org 

Install claudeflow globally via your preferred package manager:

#### npm
```bash
npm install -g @33strategies/claudeflow
```

#### yarn
```bash
yarn global add @33strategies/claudeflow
```

#### pnpm
```bash
pnpm add -g @33strategies/claudeflow
```

### Setup

After installation, run the setup command:

```bash
claudeflow setup
```

Choose your installation mode:
- **1) Global** - Install to `~/.claude/` (available in all projects)
- **2) Project** - Install to `./.claude/` (this project only)

**Quick decision**:
- **Solo developer or want commands everywhere?** → Global mode
- **Team project or want version control?** → Project mode
- **Both?** → You can do both! They work together via configuration hierarchy.

The setup will:
1. Check prerequisites (Node.js 20+, npm)
2. Copy custom workflow commands to your chosen location
3. Set up configuration files

## What This Package Provides

claudeflow provides **workflow commands** for AI-assisted feature development:

### Custom Workflow Commands
- **/brainstorm:start**: Structured brainstorming with comprehensive documentation
- **/brainstorm:clarify**: Resolve open questions interactively
- **/brainstorm:spec**: Transform brainstorm into validated specification
- **/feedback:add**: Quick capture of feedback items after testing
- **/feedback:resolve**: Batch analyze and resolve pending feedback
- **/spec:doc-update**: Parallel documentation review based on specs

### Enhanced Spec Commands
- **/spec:create**: Detects output path and creates specs in feature directories
- **/spec:decompose**: Incremental mode preserves completed work
- **/spec:execute**: Session resume capability with implementation tracking
- **/spec:migrate**: Migrates existing specs to feature-directory structure

### Key Features
- Complete end-to-end workflow from brainstorming to deployment
- Task tracking via `doc/specs/<slug>/03-tasks.md`
- Session continuity across implementation runs
- Interactive question resolution in specifications

### Verify Installation

Check that everything is set up correctly:

```bash
claudeflow doctor
```

This diagnostic command checks:
- Node.js version (need 20+)
- npm availability
- Claude Code CLI (optional - other AI tools supported)
- .claude/ directory structure
- Command files presence

### Troubleshooting

#### "Command not found: claudeflow"
- Ensure npm global bin is in your PATH
- Try: `npm list -g @33strategies/claudeflow`
- Reinstall: `npm install -g @33strategies/claudeflow`

#### "Commands not loading in Claude Code"
- Run: `claudeflow doctor`
- Verify files exist in `~/.claude/commands/` (global) or `./.claude/commands/` (project)
- Restart Claude Code

#### Installation Issues
Run the diagnostic command for detailed information:
```bash
claudeflow doctor
```

### Migration from install.sh

If you previously used the bash script installation:

1. **Uninstall old version:**
   ```bash
   # Global installation
   rm -rf ~/.claude

   # OR Project installation
   rm -rf .claude
   ```

2. **Install via npm:**
   ```bash
   npm install -g @33strategies/claudeflow
   ```

3. **Run setup:**
   ```bash
   # Global (if you used install.sh user)
   claudeflow setup --global

   # OR Project (if you used install.sh project)
   claudeflow setup --project
   ```

4. **Verify installation:**
   ```bash
   claudeflow doctor
   ```

**Note:** The migration only affects the installation method, not your feature work or task data.

### Package Security

claudeflow is published with npm provenance attestations and SLSA Level 2 compliance. All releases are built and published via GitHub Actions with cryptographic verification.

For details on verifying package authenticity, supply chain security, and security best practices, see **[docs/SECURITY.md](docs/SECURITY.md)**.

### Update Management

claudeflow checks for updates automatically once per week (every 7 days). This check runs in the background and doesn't block command execution.

**Manual update check:**
```bash
npm outdated -g @33strategies/claudeflow
```

**When updates are available**, you'll see a notification:
```
╭───────────────────────────────────────────────────╮
│                                                   │
│   Update available: 1.3.0                        │
│   Current version:  1.2.0                        │
│   Run: npm install -g @33strategies/claudeflow   │
│                                                   │
╰───────────────────────────────────────────────────╯
```

**To update:**
```bash
# npm
npm update -g @33strategies/claudeflow

# yarn
yarn global upgrade @33strategies/claudeflow

# pnpm
pnpm update -g @33strategies/claudeflow
```

## Document Organization

All documents related to a feature are organized in a single directory:

```
doc/specs/
└── <feature-slug>/
    ├── 01-brainstorm.md        # Brainstorming and research
    ├── 02-specification.md     # Validated specification
    ├── 03-tasks.md             # Task breakdown
    ├── 04-implementation.md    # Implementation summary
    └── 05-feedback.md          # Post-implementation feedback log
```

**Benefits:**
- All related documents in one place
- Clear lifecycle progression (01 → 02 → 03 → 04)
- Easy to find and navigate
- Git-friendly tracking

**Example:**
```
doc/specs/add-user-auth-jwt/
├── 01-brainstorm.md        # Created by /brainstorm:start
├── 02-specification.md     # Created by /brainstorm:spec (after /brainstorm:clarify)
├── 03-tasks.md             # Created by /spec:decompose
├── 04-implementation.md    # Created by /spec:execute
└── 05-feedback.md          # Created by /feedback:add (after testing)
```

## Repository Structure

```
claudeflow/ (@33strategies/claudeflow npm package)
├── package.json                      # npm package metadata
├── bin/
│   └── claudeflow.js                 # CLI entry point
├── lib/
│   ├── setup.js                      # Installation logic
│   └── doctor.js                     # Diagnostic command
├── scripts/
│   └── verify-files.js               # Pre-publish file verification
│
├── .claude/                          # Custom configuration (distributed in package)
│   ├── commands/                     # Custom slash commands
│   │   ├── brainstorm/               # Brainstorming workflow commands
│   │   │   ├── start.md              # Structured brainstorming workflow
│   │   │   ├── clarify.md            # Resolve open questions
│   │   │   └── spec.md               # Transform brainstorm to spec
│   │   └── spec/
│   │       ├── create.md             # Enhanced spec creation
│   │       ├── decompose.md          # Incremental task breakdown
│   │       ├── execute.md            # Session-aware implementation
│   │       ├── feedback.md           # Post-implementation feedback
│   │       ├── doc-update.md         # Documentation review
│   │       └── migrate.md            # Spec structure migration
│   ├── settings.json.example         # Example configuration
│   └── README.md                     # Component documentation
│
├── .claude-plugin/                   # Plugin metadata
│   └── plugin.json                   # Package metadata
│
├── templates/                        # Configuration templates
│   ├── project-config/               # Project-level templates
│   │   ├── settings.json             # Team settings
│   │   ├── settings.local.json.example
│   │   ├── CLAUDE.md                 # Project instructions
│   │   ├── CLAUDE.local.md.example
│   │   └── .gitignore.example
│   └── user-config/                  # User-level templates
│       ├── settings.json             # Personal global settings
│       └── CLAUDE.md                 # Personal preferences
│
├── docs/                             # Documentation
│   ├── DESIGN_RATIONALE.md          # Design validation & best practices
│   └── ...
│
├── .github/
│   └── workflows/
│       └── release.yml               # CI/CD automation
├── .releaserc.json                   # Semantic-release config
├── .npmignore                        # Package exclusion rules
├── LICENSE                           # MIT License
├── CHANGELOG.md                      # Version history (auto-generated)
└── README.md                         # This file
```

## Configuration

### Configuration Hierarchy

Claude Code uses a 5-tier precedence system:

1. **Enterprise policies** (highest) - IT-managed, cannot be overridden
2. **CLI arguments** - Temporary session overrides
3. **Local settings** (`.claude/settings.local.json`) - Personal, gitignored
4. **Project settings** (`.claude/settings.json`) - Team, committed
5. **User settings** (`~/.claude/settings.json`) - Personal global defaults

## Available Commands

#### /brainstorm:start
Structured brainstorming workflow that enforces complete investigation for any code-change task (bug fix or feature). Produces comprehensive brainstorm documentation including:
- Intent & assumptions
- Pre-reading log
- Codebase mapping
- Root cause analysis (for bugs)
- Research findings
- Clarification questions

**Usage:** `/brainstorm:start Fix chat UI auto-scroll bug when messages exceed viewport height`

#### /brainstorm:clarify
Resolve open questions in a brainstorm or specification document interactively. This command:
1. Reads the document and detects unanswered questions
2. Presents each question with context and options
3. Records answers in strikethrough format (audit trail)
4. Re-validates and loops until all questions resolved
5. Shows progress: "Question 3 of 12"

**Key Features:**
- Supports multi-select for questions requiring multiple choices
- Detects external edits to prevent data loss
- Backward compatible (skips if no questions exist)
- Re-entrant (skips already-answered questions)
- Save-as-you-go for recoverability

**Usage:** `/brainstorm:clarify doc/specs/<slug>/01-brainstorm.md`

**Example:**
```bash
/brainstorm:clarify doc/specs/my-feature/01-brainstorm.md
# → System detects 5 open questions
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Question 1 of 5
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Package Manager Support
# → User selects: npm, yarn, pnpm (all three)
# → Document updated with strikethrough answer
# → Continues with questions 2-5
# → Final summary shows 5 questions resolved
```

**Answer Format (Audit Trail):**

Questions are marked as resolved using strikethrough format:

Before:
```markdown
1. **ClaudeKit Version Compatibility**
   - Option A: Pin exact version
   - Option B: Use caret range
```

After:
```markdown
1. ~~**ClaudeKit Version Compatibility**~~ (RESOLVED)
   **Answer:** Use caret range (^1.0.0)
   **Rationale:** Automatic updates, test compatibility in CI/CD

   Original context preserved:
   - Option A: Pin exact version
   - Option B: Use caret range
```

This format provides a complete audit trail showing both the original question and the final decision.

#### /brainstorm:spec
Transform a brainstorm document into a validated, implementation-ready specification. This command:
1. Reads and synthesizes the brainstorm document
2. Interactively gathers decisions from the user
3. Creates a detailed specification using `/spec:create`
4. Validates it with `/spec:validate`
5. Presents a summary with next steps

**Usage:** `/brainstorm:spec doc/specs/<slug>/01-brainstorm.md`

**Note:** Run `/brainstorm:clarify` first to resolve any open questions before creating the specification.

#### /feedback:add
Quick capture of feedback items after manual testing. This command:
1. Locates the specification (auto-selects most recent if not specified)
2. Creates or loads `05-feedback.md` file
3. Loops to capture multiple feedback items
4. Saves each item immediately (save-as-you-go)
5. Presents summary and next steps

**Usage:** `/feedback:add` or `/feedback:add doc/specs/my-feature/02-specification.md`

**Example:**
```bash
/feedback:add
# → Auto-selects most recent specification
# → "What feedback do you have?"
# → User enters: "Login button should be more prominent"
# → FB-1 added.
# → "What feedback do you have?" (loop continues)
# → User selects "Done"
# → Summary: 3 feedback item(s) added
# → Next: Run /feedback:resolve to analyze and resolve
```

#### /feedback:resolve
Batch analyze and resolve all pending feedback items. This command:
1. Locates the feedback file (auto-selects most recent if not specified)
2. Loads all pending items from `05-feedback.md`
3. Analyzes all items in parallel using domain experts
4. Presents each item with analysis for user decision (implement/defer/out-of-scope)
5. Updates specification with approved changes
6. Logs resolutions in `05-feedback.md`

Integrates with incremental `/spec:decompose` and resume `/spec:execute` for seamless iteration.

**Usage:** `/feedback:resolve` or `/feedback:resolve doc/specs/my-feature/05-feedback.md`

**Example:**
```bash
/feedback:resolve
# → Auto-selects most recent feedback file
# → "3 pending feedback item(s)"
# → Analyzes all items in parallel
# → Presents FB-1 with analysis
# → User selects: "Implement"
# → Presents FB-2 with analysis
# → User selects: "Defer" (reason: "Not enough time")
# → Presents FB-3 with analysis
# → User selects: "Out of scope"
# → Updates specification with FB-1 changes
# → Summary: 1 implement, 1 defer, 1 out of scope
# → Next: Run /spec:decompose to create new tasks
```

#### /spec:doc-update
Review all documentation to identify what needs to be updated based on a new specification file. Launches parallel documentation expert agents to review each doc file for:
- Deprecated content
- Content requiring updates
- Missing content for new features

**Usage:** `/spec:doc-update doc/specs/text-generator-spec.md`

### Enhanced Spec Commands

#### /spec:create
Creates specifications in feature directories at `doc/specs/<slug>/02-specification.md`.

**Usage:** `/spec:create Add user authentication with JWT tokens`

#### /spec:decompose
Breaks down specifications into tasks with **incremental mode** that preserves completed work. Creates task breakdown in `doc/specs/<slug>/03-tasks.md`.

**Usage:** `/spec:decompose doc/specs/add-user-auth/02-specification.md`

**Incremental Mode:** Automatically detects when spec changelog has been updated and creates only new tasks for changes.

#### /spec:execute
Implements tasks with **session resume capability**. Reads implementation summary to skip completed tasks and continue from previous progress. Creates/updates `doc/specs/<slug>/04-implementation.md`.

**Usage:** `/spec:execute doc/specs/add-user-auth/02-specification.md`

**Session Continuity:** When you run `/spec:execute` multiple times on the same spec, it reads `04-implementation.md` to understand what work has already been completed. This allows you to:
- Work on large features across multiple sessions without re-doing completed tasks
- Return to implementation after testing/feedback cycles
- Maintain a complete history of all sessions (Session 1, Session 2, etc.)
- Seamlessly integrate feedback workflow: implement → test → `/feedback:add` → `/feedback:resolve` → `/spec:decompose` (incremental) → `/spec:execute` (resume)

#### /spec:migrate
Migrates existing specs from flat structure to feature-directory structure.

**Usage:** `/spec:migrate`

## Standard Workflow

This repository implements a complete end-to-end workflow for feature development:

```
┌─────────────────────────────────────────────────────────────────┐
│                   BRAINSTORM PHASE                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                 /brainstorm:start <task-brief>
                   (Custom Command)
                              │
                   Creates brainstorm doc
                   with research & analysis
                              │
                              ▼
               /brainstorm:clarify <brainstorm-doc>
                   (Resolve open questions)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SPECIFICATION PHASE                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
          /brainstorm:spec <brainstorm-doc>
          (Custom, calls /spec:create & /spec:validate)
                              │
              Creates validated specification
                              │
                              ▼
            /spec:decompose <spec-file>
                              │
              Breaks spec into tasks
              (creates 03-tasks.md)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  IMPLEMENTATION PHASE                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
            /spec:execute <spec-file>
                              │
              Implements tasks
              (updates 03-tasks.md status)
                              │
                              ▼
                    Manual Testing
                              │
                   Discover issues or
                   improvement opportunities
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FEEDBACK PHASE                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              /feedback:add (capture items)
                              │
              Loop to add multiple items
              (save-as-you-go)
                              │
                              ▼
             /feedback:resolve (batch analyze)
                              │
              For each pending item:
              • Parallel analysis
              • User decision
                              │
                   ┌──────────┴──────────┬────────────┐
                   │                     │            │
               Implement Now           Defer     Out of Scope
                   │                     │            │
        Update spec changelog       Log for later    Log only
                   │                     │            │
                   └──────────┬──────────┴────────────┘
                              │
                              ▼
       /spec:decompose (incremental - if any "implement")
                              │
       /spec:execute (resume)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLETION PHASE                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
           /spec:doc-update <spec-file>
                              │
        Reviews & updates documentation
                              │
                              ▼
               git commit & push
                              │
                              ▼
                          DONE! 🎉
```

### Key Workflow Steps

1. **Brainstorm** → Comprehensive investigation and research
2. **Clarify** → Resolve open questions interactively
3. **Specification** → Validated, implementation-ready spec
4. **Decomposition** → Tasks broken down in `03-tasks.md`
5. **Implementation** → Iterative execution with task status tracking
6. **Feedback** → Process post-implementation feedback with structured decisions (implement/defer/out-of-scope)
7. **Completion** → Documentation updates and git workflow

## Usage Examples

### Complete Workflow Example

```bash
# Step 1: Start with brainstorming
/brainstorm:start Add user authentication with JWT tokens
# → Creates: doc/specs/add-user-auth-jwt/01-brainstorm.md

# Step 2: Resolve any open questions
/brainstorm:clarify doc/specs/add-user-auth-jwt/01-brainstorm.md
# → Interactively resolves all open questions

# Step 3: Transform to validated specification
/brainstorm:spec doc/specs/add-user-auth-jwt/01-brainstorm.md
# → Creates: doc/specs/add-user-auth-jwt/02-specification.md (validated & complete)

# Step 4: Break down into tasks
/spec:decompose doc/specs/add-user-auth-jwt/02-specification.md
# → Creates: doc/specs/add-user-auth-jwt/03-tasks.md

# Step 5: Start implementation
/spec:execute doc/specs/add-user-auth-jwt/02-specification.md
# → Implements tasks, updates status in 03-tasks.md

# Step 6: Continue implementing (loop back to step 5 if needed)
/spec:execute doc/specs/add-user-auth-jwt/02-specification.md
# → Resume mode: skips completed work

# Step 7: Manual testing (discover feedback items)
# Test the implemented feature manually

# Step 8: Capture feedback items
/feedback:add doc/specs/add-user-auth-jwt/02-specification.md
# → Loop to capture multiple feedback items
# → Each item saved immediately

# Step 9: Resolve feedback (batch analyze and decide)
/feedback:resolve doc/specs/add-user-auth-jwt/05-feedback.md
# → Analyzes all pending items in parallel
# → Interactive decisions: implement/defer/out-of-scope
# → Updates spec with approved changes

# Step 10: If any "Implement" decisions, run incremental decompose
/spec:decompose doc/specs/add-user-auth-jwt/02-specification.md
# → Incremental mode: preserves completed tasks, creates only new ones

# Step 11: Resume implementation for new tasks
/spec:execute doc/specs/add-user-auth-jwt/02-specification.md

# Step 12: Update documentation and commit
/spec:doc-update doc/specs/add-user-auth-jwt/02-specification.md
# git add . && git commit -m "feat: add user authentication"
# git push

# All documents for this feature are now in: doc/specs/add-user-auth-jwt/
```

### Quick Start (Skip Brainstorming)

If you already know what you need:

```bash
# Start directly with spec creation
/spec:create Add user authentication with JWT tokens

# Then follow steps 4-12 above
```

### Migrating Existing Specs

If you have specs in the old flat structure:

```bash
# Migrate all existing specs to new structure
/spec:migrate

# This will:
# - Move specs/*.md to doc/specs/<slug>/02-specification.md
# - Move specs/*-tasks.md to doc/specs/<slug>/03-tasks.md
# - Move docs/ideation/*.md to doc/specs/<slug>/01-brainstorm.md
# - Generate migration report
```

### Updating Documentation After Implementation

```bash
# After implementing a feature via a spec
/spec:doc-update doc/specs/add-user-auth-jwt/02-specification.md

# This will:
# - Review all docs for outdated content
# - Identify missing documentation for new features
# - Provide prioritized recommendations
```

## Settings Management

**Project Settings** (`.claude/settings.json` - committed):
```json
{
  "permissions": {
    "allow": ["Read", "Edit", "Bash(git:*)"],
    "deny": [".env", "**/*.key", "secrets/"]
  }
}
```

**Personal Overrides** (`.claude/settings.local.json` - gitignored):
- Use for personal preferences that shouldn't be committed

## Best Practices

### 1. Security First
- Never commit secrets to `.claude/settings.json`
- Use environment variable references: `"API_KEY": "${API_KEY}"`
- Keep `.env` files gitignored

### 2. Team Collaboration
- Commit `.claude/settings.json` and `CLAUDE.md` to git
- Gitignore `.claude/settings.local.json` and `CLAUDE.local.md`

### 3. Context Optimization
- Keep CLAUDE.md focused and concise
- Break large tasks into smaller steps

## Resources

### Documentation
- [Installation Guide](docs/INSTALLATION_GUIDE.md) - When to use global vs project installation
- [Setup Guide](docs/SETUP_GUIDE.md) - Detailed setup instructions
- [Design Rationale](docs/DESIGN_RATIONALE.md) - Design validation and best practices
- [Feedback Workflow Guide](docs/guides/feedback-workflow-guide.md) - Complete guide to post-implementation feedback
- [GitHub Issues](https://github.com/kennyjpowers/claude-flow/issues) - Report problems

## Contributing

Contributions welcome! Please:
1. Follow existing patterns and structure
2. Test changes thoroughly
3. Update documentation
4. Submit PRs with clear descriptions

## License

MIT License - feel free to use and modify for your projects.

## Acknowledgments

- **Anthropic** - Claude Code CLI and AI development
- Community contributors and examples
