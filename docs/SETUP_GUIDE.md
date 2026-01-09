# Setup Guide: claudeflow Workflow Configuration

This guide explains how to set up claudeflow for AI-assisted feature development.

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│           Your Project                      │
│  ┌───────────────────────────────────────┐  │
│  │     claudeflow (This Package)         │  │
│  │  - Workflow commands                   │  │
│  │  - Feature development lifecycle       │  │
│  │  - Task tracking via 03-tasks.md       │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │   AI Coding Tool (Claude Code, etc.)  │  │
│  │  - Base CLI                           │  │
│  │  - Custom commands support            │  │
│  │  - Configuration hierarchy            │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## Quick Start

### Step 1: Install claudeflow

```bash
# Install globally via npm
npm install -g @33strategies/claudeflow

# Verify installation
claudeflow doctor
```

### Step 2: Run Setup

```bash
# Interactive mode (prompts for global or project)
claudeflow setup

# Or specify mode directly
claudeflow setup --global   # Install to ~/.claude/
claudeflow setup --project  # Install to ./.claude/
```

### Step 3: Verify Installation

```bash
claudeflow doctor
```

You should see all checks passing:
```
✓ Node.js version - v20.x.x
✓ npm - 10.x.x
✓ Claude Code CLI (optional)
✓ Global (~/.claude/)
  ✓ Commands directory
  ✓ Command files - 8/8 found
```

## Detailed Setup

### For New Projects

```bash
# 1. Create project directory
mkdir my-project
cd my-project

# 2. Initialize git
git init

# 3. Install claudeflow
npm install -g @33strategies/claudeflow

# 4. Run project setup
claudeflow setup --project

# 5. Customize configuration
cp .claude/settings.json.example .claude/settings.json
# Edit .claude/settings.json

# 6. Create CLAUDE.md
cat > CLAUDE.md << 'EOF'
# My Project

## Overview
[Your project description]

## Development Commands
- `npm run dev` - Start development server
- `npm test` - Run tests

## Coding Standards
[Your standards]
EOF

# 7. Add to git
echo ".claude/settings.local.json" >> .gitignore
echo "CLAUDE.local.md" >> .gitignore
git add .claude/ CLAUDE.md .gitignore
git commit -m "Initialize claudeflow configuration"

# 8. Start coding with Claude Code
claude
```

### For Existing Projects

```bash
cd your-existing-project

# 1. Backup existing .claude directory (if it exists)
[ -d .claude ] && mv .claude .claude.backup

# 2. Install claudeflow
npm install -g @33strategies/claudeflow

# 3. Run project setup
claudeflow setup --project

# 4. Merge with backup (if you had one)
if [ -d .claude.backup ]; then
    cp -n .claude.backup/* .claude/ 2>/dev/null || true
    echo "Merged with existing configuration. Review .claude/ for duplicates."
fi

# 5. Commit changes
git add .claude/
git commit -m "Add claudeflow configuration"
```

### For Team Environments

```bash
# 1. One team member sets up configuration
cd team-project
claudeflow setup --project

# 2. Customize for team
# Edit .claude/settings.json with team standards
# Create CLAUDE.md with project context

# 3. Commit to repository
git add .claude/ CLAUDE.md
git commit -m "Add team claudeflow configuration"
git push origin main

# 4. Other team members
# After pulling the repository:
npm install -g @33strategies/claudeflow
claudeflow doctor

# 5. Personal overrides (optional)
cp .claude/settings.json .claude/settings.local.json
# Edit .claude/settings.local.json for personal preferences
# This file is gitignored
```

## Configuration Files

### .claude/settings.json (Team Settings)

**Purpose**: Team-shared settings committed to git

**Example**:
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

### .claude/settings.local.json (Personal Settings)

**Purpose**: Personal overrides, gitignored

**Example**:
```json
{
  "environmentVariables": {
    "EDITOR": "code",
    "MY_CUSTOM_VAR": "my-value"
  }
}
```

### CLAUDE.md (Project Context)

**Purpose**: Master project documentation for AI

**Example**:
```markdown
# Project Name

## Architecture
- Frontend: React 18 with TypeScript
- Backend: Node.js Express API
- Database: PostgreSQL

## Development Commands
```bash
npm run dev      # Start development server
npm test         # Run tests
npm run lint     # Run linter
```

## Coding Standards
- Use TypeScript strict mode
- Follow Airbnb style guide
- Write tests for all business logic
- Minimum 80% code coverage

## Git Workflow
- Branch naming: feature/*, fix/*, hotfix/*
- Commit format: Conventional Commits
- PRs require 1 approval + passing CI
```

### .gitignore (Git Exclusions)

**Add these lines**:
```gitignore
# Claude Code local settings
.claude/settings.local.json
CLAUDE.local.md

# Environment files
.env
.env.*

# Secrets
secrets/
credentials/
**/*.key
**/*.pem
```

## Using the Configuration

### Available Custom Commands

```bash
# Start Claude Code (or your preferred AI tool)
claude

# Use custom workflow commands
/brainstorm:start Fix chat UI auto-scroll bug       # Start brainstorming
/brainstorm:clarify doc/specs/<slug>/01-brainstorm.md  # Clarify with questions
/brainstorm:spec doc/specs/<slug>/01-brainstorm.md     # Transform to spec
/spec:decompose doc/specs/<slug>/02-specification.md   # Break down tasks
/spec:execute doc/specs/<slug>/02-specification.md     # Implement tasks
/feedback:add doc/specs/<slug>/02-specification.md     # Add feedback item
/feedback:resolve doc/specs/<slug>/05-feedback.md      # Resolve feedback
/spec:doc-update doc/specs/<slug>/02-specification.md  # Documentation review
```

### Standard Workflow

1. **Brainstorm** → `/brainstorm:start <task-brief>`
2. **Clarify** → `/brainstorm:clarify doc/specs/<slug>/01-brainstorm.md`
3. **Specification** → `/brainstorm:spec doc/specs/<slug>/01-brainstorm.md`
4. **Decomposition** → `/spec:decompose doc/specs/<slug>/02-specification.md`
5. **Implementation** → `/spec:execute doc/specs/<slug>/02-specification.md`
6. **Add Feedback** → `/feedback:add doc/specs/<slug>/02-specification.md`
7. **Resolve Feedback** → `/feedback:resolve doc/specs/<slug>/05-feedback.md`
8. **Documentation** → `/spec:doc-update doc/specs/<slug>/02-specification.md`

## Customization

### Add Your Own Command

```bash
# Create command file
cat > .claude/commands/deploy.md << 'EOF'
---
name: deploy
description: Deploy to specified environment
---

Deploy the application to: $ARGUMENTS

## Steps:
1. Run tests: `npm test`
2. Build: `npm run build`
3. Deploy: `npm run deploy:$ARGUMENTS`
4. Verify deployment health

Provide deployment summary and any issues encountered.
EOF

# Test
claude
# Then use: /deploy staging
```

## Maintenance

### Update claudeflow

```bash
# Check for updates
npm outdated -g | grep claudeflow

# Update to latest
npm update -g @33strategies/claudeflow

# Re-run setup if needed
claudeflow setup --global  # or --project

# Verify
claudeflow doctor
```

### Validate Configuration

```bash
# Run all validation checks
claudeflow doctor

# Check JSON syntax
cat .claude/settings.json | jq .
```

## Troubleshooting

### Common Issues

**Issue**: `claudeflow: command not found`

```bash
# Solution 1: Reinstall
npm install -g @33strategies/claudeflow

# Solution 2: Check npm prefix
npm config get prefix
# Add to PATH if needed
export PATH="$PATH:$(npm config get prefix)/bin"
```

**Issue**: Commands not appearing in Claude Code

```bash
# Solution: Run diagnostics
claudeflow doctor

# Verify files exist
ls -la ~/.claude/commands/         # For global
ls -la ./.claude/commands/         # For project

# Restart Claude Code
```

**Issue**: Settings not applied

- Check hierarchy: local > project > user
- Restart Claude Code session
- Validate JSON: `jq . .claude/settings.json`

## Best Practices

1. **Start Simple**: Begin with default settings, customize as needed
2. **Document Customizations**: Keep `.claude/README.md` updated
3. **Version Control**: Commit `.claude/settings.json`, gitignore `.claude/settings.local.json`
4. **Team Alignment**: Document setup in project README
5. **Regular Updates**: Update claudeflow monthly
6. **Validate Changes**: Run `claudeflow doctor` before committing

## Support

- **This Repository**: [GitHub Issues](https://github.com/kennyjpowers/claude-flow/issues)
- **Claude Code**: [Docs](https://docs.anthropic.com/en/docs/claude-code/)

---

**Last Updated**: January 2026
