# .claude/ Directory

This directory contains custom commands and settings distributed via the **claudeflow** npm package. These commands provide workflow orchestration for AI-assisted feature development.

## Structure

- **commands/** - Custom slash commands for project workflows
- **settings.json.example** - Example permission configuration

## How It Works

claudeflow provides a complete feature development workflow:

1. **Brainstorm** - Structured investigation before coding
2. **Clarify & Specify** - Transform brainstorm into validated specs
3. **Decomposition** - Break specs into actionable tasks
4. **Implementation** - Execute tasks with session continuity
5. **Feedback** - Add and resolve post-implementation feedback
6. **Documentation** - Update docs based on changes

## Available Custom Commands

### /brainstorm:start
Structured brainstorming workflow that enforces complete investigation for any code-change task (bug fix or feature). Creates comprehensive brainstorm documentation.

**Usage**: `/brainstorm:start Fix chat UI auto-scroll bug when messages exceed viewport height`

### /brainstorm:clarify
Interactive clarification phase for brainstorm documents. Extracts decisions from brainstorm clarifications and prepares for specification creation.

**Features:**
- Extracts decisions from brainstorm clarifications
- **Automatically resolves open questions interactively**
- Presents questions one at a time with progress ("Question 3 of 12")
- Shows context and available options for each question
- Supports multi-select questions (e.g., "Which package managers?")
- Updates brainstorm doc with strikethrough answers (preserves original context)
- Skips already-answered questions (re-entrant support)

**Usage**: `/brainstorm:clarify doc/specs/<slug>/01-brainstorm.md`

### /brainstorm:spec
Transform a brainstorm document into a validated, implementation-ready specification. Bridges the gap between brainstorming and implementation.

**Features:**
- Builds detailed spec via `/spec:create`
- Validates completeness via `/spec:validate`
- Loops until all validation issues resolved
- Preserves audit trail in spec file

**Usage**: `/brainstorm:spec doc/specs/<slug>/01-brainstorm.md`

**Note:** For a complete workflow, run `/brainstorm:clarify` first to resolve open questions, then `/brainstorm:spec` to generate the specification.

### /feedback:add
Add ONE specific piece of post-implementation feedback. After manual testing reveals issues or improvement opportunities, this command:

1. Validates prerequisites (implementation must exist)
2. Collects detailed feedback description
3. Explores relevant code with targeted investigation
4. Optionally consults research-expert for solution approaches
5. Logs feedback in `05-feedback.md`

**Usage**: `/feedback:add doc/specs/add-user-auth/02-specification.md`

### /feedback:resolve
Resolve pending feedback items with structured decisions. For each unresolved feedback item:

1. Presents feedback with context
2. Guides through interactive decisions (implement now/defer/out-of-scope)
3. Updates spec changelog for "implement now" decisions
4. Updates feedback status in `05-feedback.md`

Seamlessly integrates with incremental `/spec:decompose` and resume `/spec:execute` for feedback iteration cycles.

**Usage**: `/feedback:resolve doc/specs/add-user-auth/02-specification.md`

### /spec:doc-update
Review all documentation to identify what needs to be updated based on a new specification file. Launches parallel documentation expert agents.

**Usage**: `/spec:doc-update doc/specs/text-generator-spec.md`

## Enhanced Spec Commands (Overrides)

These commands provide enhanced features for specification management:

### /spec:create
Enhanced with feature-directory awareness and automatic output path detection. Creates specifications in `doc/specs/<slug>/02-specification.md` format.

**Usage**: `/spec:create Add user authentication with JWT tokens`

### /spec:decompose
Enhanced with incremental mode that preserves completed work and creates only new tasks when spec changelog is updated. Creates task breakdown in `doc/specs/<slug>/03-tasks.md`.

**Usage**: `/spec:decompose doc/specs/add-user-auth/02-specification.md`

### /spec:execute
Enhanced with resume capability that continues from previous sessions, skipping completed work and maintaining implementation history. Reads `04-implementation.md` for session continuity.

**Usage**: `/spec:execute doc/specs/add-user-auth/02-specification.md`

### /spec:migrate
Migrates existing specs from flat structure to feature-directory structure.

**Usage**: `/spec:migrate`

## Installation

This configuration is distributed as part of the **claudeflow** npm package.

**Install claudeflow:**
```bash
# Using npm (recommended)
npm install -g @33strategies/claudeflow

# Using yarn
yarn global add @33strategies/claudeflow

# Using pnpm
pnpm add -g @33strategies/claudeflow
```

**Run setup:**
```bash
claudeflow setup    # Interactive mode (prompts for global or project)
```

**Choose installation mode:**
- **Global:** Install to `~/.claude/` (available in all projects)
- **Project:** Install to `./.claude/` (this project only)

For detailed installation instructions, see [docs/INSTALLATION_GUIDE.md](../docs/INSTALLATION_GUIDE.md).

## Troubleshooting

If commands aren't loading or you encounter issues, run the diagnostic command:

```bash
claudeflow doctor
```

This checks:
- Node.js version (requires 20+)
- npm availability
- Claude Code CLI (optional - other AI tools work too)
- .claude/ directory structure
- Command files presence (8/8 required)

The doctor command provides specific recommendations for any issues found.

**Common issues:**
- **"Commands not loading"** - Run `claudeflow doctor`, restart Claude Code
- **"Node.js too old"** - Requires Node.js 20+, install from https://nodejs.org

For comprehensive troubleshooting, see [README.md](../README.md#troubleshooting).

## Migration from install.sh

If you previously installed using install.sh:

1. **Remove old installation:**
   ```bash
   # For global installation
   rm -rf ~/.claude

   # For project installation
   rm -rf ./.claude
   ```

2. **Install via npm:**
   ```bash
   npm install -g @33strategies/claudeflow
   ```

3. **Run setup:**
   ```bash
   # For global (if you used install.sh user)
   claudeflow setup --global

   # For project (if you used install.sh project)
   claudeflow setup --project
   ```

4. **Verify installation:**
   ```bash
   claudeflow doctor
   ```

## Customization

1. Copy `settings.json.example` to `settings.json` and modify for your needs
2. Add your own commands to the `commands/` directory
3. Commit `settings.json` for team sharing, or use `settings.local.json` for personal settings

## Maintenance

**Update claudeflow to latest version:**
```bash
# Using npm
npm update -g @33strategies/claudeflow

# Using yarn
yarn global upgrade @33strategies/claudeflow

# Using pnpm
pnpm update -g @33strategies/claudeflow
```

**Verify installation health:**
```bash
claudeflow doctor
```
