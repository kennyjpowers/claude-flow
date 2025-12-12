---
description: Review documentation for updates needed after implementation
allowed-tools: Read, Glob, Grep, Bash(ls:*), Bash(find:*), Task, AskUserQuestion, mcp__*
argument-hint: "[path-to-spec-file]"
category: workflow
---

# Documentation Update Review

**Specification (optional):** $ARGUMENTS

---

## Workflow Instructions

This command reviews all project documentation to identify what needs updating after a feature implementation. Run as the final step before completing a feature. Follow each step sequentially.

### Step 1: Locate Specification

**If a path was provided:** Use that path directly.

**If no path was provided:** Find the most recently modified `02-specification.md` file in `doc/specs/`:
1. Search for all `02-specification.md` files under `doc/specs/`
2. Select the one with the most recent modification time
3. Inform the user which file was auto-selected:
   ```
   Auto-selected: doc/specs/{slug}/02-specification.md (modified {time})
   ```

Extract the feature slug from the path.

### Step 2: Gather Implementation Context

Read the feature's full context to understand what was implemented:

1. **Specification:** `doc/specs/{slug}/02-specification.md`
   - What was planned
   - Acceptance criteria

2. **Implementation Summary:** `doc/specs/{slug}/04-implementation.md` (if exists)
   - What was actually built
   - Files modified
   - Any deviations from spec

3. **Feedback Log:** `doc/specs/{slug}/05-feedback.md` (if exists)
   - Any resolved feedback that changed the implementation

**Build a change summary:**
- New features/functionality added
- Changed behaviors or interfaces
- Deprecated or removed functionality
- New configuration options
- New commands or APIs

### Step 3: Find All Documentation Files

Scan for documentation files in common locations:

```
*.md (root)
docs/**/*.md
doc/**/*.md
developer-guides/**/*.md
```

Exclude:
- `doc/specs/**/*.md` (these are feature specs, not user docs)
- `node_modules/**`
- `CHANGELOG.md` (auto-generated)

List the files found:
```
Found {count} documentation files:
- README.md
- CLAUDE.md
- docs/installation.md
- ...
```

### Step 4: Launch Parallel Documentation Review

**Parallelization opportunity:** Launch review agents for all documentation files concurrently. **Instruct them to analyze and return findings as text only - no file creation.**

Look for documentation specialists (e.g., docs-architect, api-documenter, tutorial-engineer). Use `general-purpose` as fallback.

For each documentation file, launch the best available agent with this prompt (emphasize text-only output):

```
Review documentation file for updates needed after feature implementation.

## Feature Summary
{Change summary from Step 2}

## Documentation File
{path to doc file}

## Review Tasks

Analyze the documentation and identify:

1. **Outdated Content** - Sections describing functionality that changed
   - Quote the specific text
   - Explain what changed
   - Suggest updated wording

2. **Deprecated Content** - Sections documenting removed/deprecated features
   - Quote the specific text
   - Note severity: CRITICAL (would break users) or WARNING (just outdated)

3. **Missing Content** - New functionality that should be documented
   - What's missing
   - Where to add it (which section)
   - Draft suggested text

## Output Format

### {filename}

**Status:** Needs Updates | Minor Updates | No Updates Needed

#### Outdated Content
- **Location:** {section/line}
- **Current:** "{quote}"
- **Issue:** {what changed}
- **Suggested:** "{new text}"

#### Deprecated Content
- **Location:** {section/line}
- **Current:** "{quote}"
- **Severity:** CRITICAL | WARNING

#### Missing Content
- **Feature:** {feature name}
- **Placement:** {after which section}
- **Draft:** "{suggested text}"

If no updates needed: "{filename}: No updates required - documentation is current."
```

### Step 5: Consolidate Results

After all agents complete:

1. **Aggregate findings** by priority:
   - **P0 (Critical):** Deprecated features still documented as current
   - **P1 (High):** Incorrect documentation that would mislead users
   - **P2 (Medium):** Missing documentation for new features
   - **P3 (Low):** Minor clarifications

2. **Create summary table:**
   ```
   | File | P0 | P1 | P2 | P3 | Status |
   |------|----|----|----|----|--------|
   | README.md | 1 | 2 | 1 | 0 | Needs Updates |
   | CLAUDE.md | 0 | 0 | 2 | 1 | Minor Updates |
   | docs/api.md | 0 | 0 | 0 | 0 | Current |
   ```

3. **Present detailed findings** organized by priority (P0 first, then P1, etc.)

### Step 6: Ask User How to Proceed

Use **AskUserQuestion tool** to present options:

```
AskUserQuestion:
  questions:
    - header: "Action"
      question: "How should we handle the {count} documentation updates?"
      multiSelect: false
      options:
        - label: "Update all (Recommended)"
          description: "Apply all suggested changes across all files"
        - label: "Update critical only"
          description: "Apply only P0 and P1 changes"
        - label: "Review individually"
          description: "Go through each change for approval"
        - label: "Skip"
          description: "Document findings but don't make changes"
```

If user chooses to update, apply the changes and report what was modified.

### Step 7: Present Summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Documentation Review Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Feature:** {slug}
**Files Reviewed:** {count}

**Summary:**
- P0 (Critical): {count} items
- P1 (High): {count} items
- P2 (Medium): {count} items
- P3 (Low): {count} items

{If changes were made:}
**Files Updated:**
- {file1}: {brief description of changes}
- {file2}: {brief description of changes}

{If no changes needed:}
All documentation is current. No updates required.

**Next Steps:**
- Review changes: git diff
- Commit: /git:commit
- Push: /git:push
```

---

## Example Usage

```bash
# Auto-select most recently modified specification
/spec:doc-update

# Or specify a path explicitly
/spec:doc-update doc/specs/add-user-auth/02-specification.md
```

This will:
1. Locate the specification and gather implementation context
2. Find all documentation files
3. Review each in parallel for needed updates
4. Present findings by priority
5. Optionally apply updates
6. Report summary

---

## Notes

- **Run last:** This should be the final step before committing a completed feature
- **Parallelization:** All doc files reviewed concurrently for speed
- **Non-destructive:** Changes only applied if user approves
- **Context-aware:** Uses implementation summary to understand what actually shipped, not just what was planned
