# Feedback Log

Post-implementation feedback, analysis, and decisions for the add-feedback-workflow-command feature.

Each feedback item includes:
- Description of the issue or improvement
- Code exploration and research findings
- Interactive decision results
- Actions taken (spec updates, deferred tasks, or out-of-scope logging)

---

## Feedback #1

**Date:** 2025-11-21
**Status:** Accepted - Implementation in progress
**Type:** bug
**Priority:** High

### Description

The beginning of the feedback command workflow seems too complicated and the bash commands have lots of issues

### Code Exploration Findings

**Primary Issues in `.claude/commands/spec/feedback.md`:**

1. **Over-Prescription Syndrome**: 26 bash code blocks trying to script the entire workflow
   - Lines 42-62: Complex BASH_REMATCH regex patterns
   - Lines 82-98: Nested conditionals with string pattern matching
   - Lines 105-131: Piped commands with jq and nested parentheses

2. **Wrong Invocation Pattern**:
   - Using `$(claudekit status stm)` (bash substitution)
   - Should use `!claudekit status stm` (direct command pattern)
   - Compare: execute.md uses the correct `!command` pattern

3. **Complex Bash Patterns Causing Parse Errors**:
   - Associative arrays: `declare -A DECISIONS`
   - Heredocs with variables: `cat <<'EOF'`
   - Command substitution with parentheses: `$(stm list...)` - **This causes the parse error!**
   - JQ interpolation: `jq -r '.[] | "[\(.id)]"'` - Nested parentheses

4. **Variable Persistence Problem**: Bash variables don't persist between separate Bash tool invocations

**Affected Components:**
- `.claude/commands/spec/feedback.md` (PRIMARY - 1000+ lines)
- `.claude/commands/spec/decompose.md` (SECONDARY - similar patterns)

**Blast Radius:** Medium
- feedback.md needs significant refactoring
- decompose.md may have similar issues
- Other commands (create.md, execute.md) use simpler, working patterns

**Root Cause:** The command tries to prescribe exact bash scripts instead of providing declarative guidance for Claude to follow.

### Research Findings

Research skipped by user

### Decisions

- **Action:** Implement now
- **Scope:** Minimal
- **Approach:** Recommended: Declarative markdown pattern
- **Priority:** High

### Actions Taken

- Updated specification changelog (Section 18)
- Next steps: Update spec sections → /spec:decompose → /spec:execute

### Rationale

This feedback was addressed through the /spec:feedback workflow:
1. Code exploration identified affected components and blast radius
2. Research was skipped
3. Interactive decision process resulted in: Implement now
4. Accepted - Implementation in progress

The bash parsing errors are blocking the ability to test the feedback workflow itself. By following the execute.md pattern with declarative markdown and !command invocations, the command will be more reliable and maintainable. The minimal scope focuses on Step 1 (Validation & Setup) which is where the immediate issues occur.

---
