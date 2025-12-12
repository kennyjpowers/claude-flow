---
description: Break down a validated specification into actionable implementation tasks
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(ls:*), Bash(find:*), Bash(mkdir:*), Bash(date:*), Task, mcp__*
argument-hint: "[path-to-spec-file]"
category: workflow
---

# Decompose Specification into Tasks

**Specification (optional):** $ARGUMENTS

---

## Workflow Instructions

This command breaks down a validated specification into actionable tasks tracked in a single markdown file. Follow each step sequentially.

### Step 1: Locate Specification

**If a path was provided:** Use that path directly.

**If no path was provided:** Find the most recently modified `02-specification.md` file in `doc/specs/`:
1. Search for all `02-specification.md` files under `doc/specs/`
2. Select the one with the most recent modification time
3. Inform the user which file was auto-selected

Extract the feature slug from the path (e.g., `doc/specs/fix-chat-scroll-bug/02-specification.md` → slug is `fix-chat-scroll-bug`).

### Step 2: Determine Mode

Check if `doc/specs/{slug}/03-tasks.md` already exists:

**If it doesn't exist:** Run in **Full Mode** - create complete task breakdown from scratch.

**If it exists:** Run in **Incremental Mode**:
1. Read existing 03-tasks.md to get:
   - Current task statuses
   - **Last Decompose** datetime from the header (format: `YYYY-MM-DD HH:MM`)
2. Read the spec's **## Changelog** section
3. Compare changelog entry datetimes against Last Decompose datetime
4. **If no changelog entries newer than Last Decompose:**
   - Display: "No spec changes since last decompose ({datetime}). Nothing to do."
   - Exit the command
5. **If new changelog entries found:**
   - Extract "New Requirements" from each new entry
   - These become the basis for new tasks

Display the mode:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mode: {Full | Incremental}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{If incremental:}
Last Decompose: {YYYY-MM-DD HH:MM}
New changelog entries: {count}
- {YYYY-MM-DD HH:MM}: {changelog entry title}
- {YYYY-MM-DD HH:MM}: {changelog entry title}
```

### Step 3: Read and Analyze Specification

Read the specification and extract:
- Implementation phases from the spec
- Technical requirements and dependencies
- Acceptance criteria
- Testing requirements
- Files/components to be modified

**Parallelization opportunity:** Launch domain expert agents in parallel (e.g., architecture, testing strategy, security considerations). Instruct them to analyze and return findings as text only - no file creation.

### Step 4: Consult Domain Experts

Launch relevant domain expert agents in parallel (e.g., react-expert, database-expert). **Instruct them to return findings as text only - no file creation.** Use their input to:
- Validate task breakdown covers all requirements
- Identify missing tasks or dependencies
- Suggest optimal task ordering
- Flag potential implementation challenges

### Step 5: Create Task Breakdown

Break the specification into concrete, actionable tasks.

**Key principles:**
- Each task has a single, clear objective
- **Copy full implementation details from spec** - tasks must be self-contained
- Include acceptance criteria with specific test scenarios
- Document dependencies between tasks
- Group tasks into logical phases
- **Identify parallelization opportunities** - which tasks have no dependencies on each other?

**Task structure:**
- **Phase 1: Foundation** - Core infrastructure, setup, dependencies
- **Phase 2: Core Implementation** - Main feature functionality
- **Phase 3: Testing & Validation** - Test coverage, edge cases
- **Phase 4: Documentation & Polish** - Docs, cleanup, optimization

**Parallelization Analysis:**
After defining tasks, analyze which can run in parallel:
- Tasks with `Depends On: none` within the same phase can potentially run in parallel
- Tasks modifying different files with no shared state can run in parallel
- Group parallelizable tasks together for the "## Parallelization Strategy" section

### Step 6: Generate 03-tasks.md

Create `doc/specs/{slug}/03-tasks.md` with this structure:

```markdown
# Tasks: {Feature Title}

**Spec:** doc/specs/{slug}/02-specification.md
**Created:** {YYYY-MM-DD HH:MM}
**Last Updated:** {YYYY-MM-DD HH:MM}
**Last Decompose:** {YYYY-MM-DD HH:MM}

## Summary

| Status | Count |
|--------|-------|
| ⏳ Pending | X |
| 🔄 In Progress | X |
| ✅ Completed | X |
| **Total** | **X** |

---

## Phase 1: Foundation

### Task 1.1: {Task Title}
**Status:** ⏳ pending
**Priority:** high | medium | low
**Depends On:** none | Task X.Y

**Description:**
{Full implementation details copied from spec - NOT summaries}

**Technical Requirements:**
- {Specific requirement from spec}
- {Code examples if applicable}

**Acceptance Criteria:**
- [ ] {Specific, testable criterion}
- [ ] {Another criterion}
- [ ] Tests written and passing

**Files to Modify:**
- `path/to/file.ts`

---

### Task 1.2: {Next Task}
...

## Phase 2: Core Implementation
...

## Phase 3: Testing & Validation
...

## Phase 4: Documentation & Polish
...

---

## Parallelization Strategy

Tasks that can be executed in parallel (no dependencies between them):

### Parallel Group 1
- Task X.Y: {title}
- Task X.Z: {title}

### Parallel Group 2
- Task A.B: {title}
- Task A.C: {title}

### Sequential Dependencies
Tasks that must be executed in order:
1. Task 1.1 → Task 1.2 (1.2 depends on 1.1)
2. Task 2.1 → Task 2.3 (2.3 depends on 2.1)
```

### Step 7: Incremental Mode Processing

**If running in Incremental Mode:**

1. **Preserve completed tasks:** Keep all tasks marked `✅ completed` exactly as-is

2. **Preserve in-progress tasks:** Keep tasks marked `🔄 in_progress` with their current content

3. **Process new changelog entries:** For each changelog entry newer than Last Decompose:
   - Read the **New Requirements** list from the entry
   - Read the **Changes** list to understand which spec sections were modified
   - For each new requirement, create a task

4. **Add new tasks:** For each new requirement from changelog, add tasks marked `⏳ NEW`:
   ```markdown
   ### Task 2.8: {New Task Title} ⏳ NEW
   **Status:** ⏳ pending
   **Added:** {YYYY-MM-DD HH:MM}
   **Source:** Changelog {YYYY-MM-DD HH:MM} - {entry title}

   {Full implementation details for this requirement}

   **Acceptance Criteria:**
   - [ ] {criteria from the new requirement}
   ...
   ```

5. **Continue numbering:** New tasks continue the sequence in their phase (e.g., if Phase 2 has tasks 2.1-2.7, new tasks are 2.8, 2.9, etc.)

6. **Update Last Decompose:** Set `**Last Decompose:** {YYYY-MM-DD HH:MM}` in header (current datetime)

7. **Update summary counts:** Recalculate the Summary table

### Step 8: Present Summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Decomposition Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Feature:** {slug}
**Tasks File:** doc/specs/{slug}/03-tasks.md

### Task Summary
- Phase 1 (Foundation): X tasks
- Phase 2 (Core): X tasks
- Phase 3 (Testing): X tasks
- Phase 4 (Docs): X tasks
- **Total:** X tasks

{If incremental mode:}
### Changes This Session
- Preserved: X completed tasks
- Added: X new tasks

### Recommended Execution Order
1. {First task to start with}
2. {Next task}
3. {Tasks that can run in parallel: X.Y, X.Z}

### Next Step
Run /spec:execute to begin implementation
```

---

## Status Markers

Tasks use emoji status markers for easy parsing:

| Marker | Status | Meaning |
|--------|--------|---------|
| ⏳ | pending | Not started |
| 🔄 | in_progress | Currently being worked on |
| ✅ | completed | Done and verified |
| ⏳ NEW | pending (new) | Added in incremental mode |

---

## Example Usage

```bash
# Auto-select most recently modified specification
/spec:decompose

# Or specify a path explicitly
/spec:decompose doc/specs/add-user-auth/02-specification.md
```

---

## Content Preservation Requirements

**CRITICAL:** When creating tasks, copy ALL implementation details from the spec:

❌ **WRONG:**
```markdown
**Description:** Implement file operations as specified in spec section 9.
```

✅ **CORRECT:**
```markdown
**Description:**
Create `src/utils/filesystem.ts` with the following functions:

- `validatePath(input: string): boolean` - Check path is safe
- `ensureDir(path: string): Promise<void>` - Create directory recursively
- `copyWithBackup(src: string, dest: string): Promise<void>` - Copy with .bak

Implementation:
```typescript
export async function validatePath(input: string): boolean {
  // No directory traversal
  if (input.includes('..')) return false;
  // Must be absolute or relative to project
  return path.isAbsolute(input) || !input.startsWith('/');
}
```
```

Each task must be **self-contained** - implementable without referring back to the spec.

---

## Integration with Other Commands

- **Prerequisites:** Run `/spec:refine` first to ensure spec is ready
- **Next step:** Run `/spec:execute` to implement the tasks
- **Progress tracking:** Task status is tracked directly in 03-tasks.md
- **Feedback loop:** After `/feedback:resolve` updates the spec, re-run `/spec:decompose` to create tasks for new requirements (incremental mode detects changelog changes automatically)

---

## Notes

- **Single source of truth:** All task state lives in 03-tasks.md
- **No external dependencies:** No task management tools required
- **Git-friendly:** All changes tracked in version control
- **Resilient:** File persists state between sessions
- **Re-entrant:** Safe to run multiple times; preserves completed work
