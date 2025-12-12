---
description: Implement a validated specification task by task
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(ls:*), Bash(find:*), Bash(git:*), Bash(npm:*), Bash(npx:*), Task, TodoWrite, mcp__*
argument-hint: "[path-to-tasks-file]"
category: workflow
---

# Execute Specification

**Tasks File (optional):** $ARGUMENTS

---

## Workflow Instructions

This command implements a validated specification by working through tasks in `03-tasks.md`, updating progress in real-time. Follow each step sequentially.

### Step 1: Locate Tasks File

**If a path was provided:** Use that path directly.

**If no path was provided:** Find the most recently modified `03-tasks.md` file in `doc/specs/`:
1. Search for all `03-tasks.md` files under `doc/specs/`
2. Select the one with the most recent modification time
3. Inform the user which file was auto-selected:
   ```
   Auto-selected: doc/specs/{slug}/03-tasks.md (modified {time})
   ```

**If no tasks file found:**
```
No 03-tasks.md found. Run /spec:decompose first to create tasks from a specification.
```
Exit the command.

Extract the feature slug from the path (e.g., `doc/specs/fix-chat-scroll-bug/03-tasks.md` → slug is `fix-chat-scroll-bug`).

Derive the specification path: `doc/specs/{slug}/02-specification.md`

### Step 2: Verify Prerequisites

1. **Check for spec file:** Confirm `doc/specs/{slug}/02-specification.md` exists
   - If missing: Warn user that spec is missing but continue (tasks file is the primary input)

2. **Read task file** to understand:
   - Total number of tasks
   - Task statuses (pending, in progress, completed)
   - Dependencies between tasks
   - Current phase

3. **Read the specification** to understand overall scope and requirements

### Step 3: Determine Execution State

Parse `03-tasks.md` to build execution plan:

**Summary display:**
```
---------------------------------------------------
Execution State
---------------------------------------------------

Feature: {slug}
Tasks File: doc/specs/{slug}/03-tasks.md

| Status | Count |
|--------|-------|
| Completed | X |
| In Progress | X |
| Pending | X |
| **Total** | **X** |

{If resuming:}
Resuming from previous session. {X} tasks already completed.
Next task: Task {X.Y} - {title}
```

**If all tasks completed:** Inform user and skip to Step 6 (Summary).

### Step 4: Execute Tasks

Work through tasks in dependency order (Phase 1 → Phase 2 → etc.).

For each pending task:

#### 4a. Mark Task In Progress

Update `03-tasks.md` immediately:
- Change task status from `pending` to `in_progress`
- Note start time

**Display:**
```
---------------------------------------------------
Starting Task {X.Y}: {Title}
---------------------------------------------------
Phase: {phase}
Priority: {priority}
Depends On: {dependencies}
```

#### 4b. Implement

Read the full task details from `03-tasks.md` (technical requirements, acceptance criteria, files to modify).

**Leverage available AI resources:** Check which specialized agents, skills, plugins, or MCP servers are available and use them for implementation:
- Match task domain to appropriate specialists (e.g., react-expert for React components, database-expert for data layer, typescript-expert for type issues)
- Use MCP tools for documentation lookup, external integrations, etc.
- Invoke relevant skills when they match the task domain

**Parallelization opportunity:** If implementation involves multiple independent concerns (e.g., frontend + backend, multiple modules), launch specialist agents in parallel.

**Agent prompt pattern:**
```
Implement Task {X.Y}: {Title}

Context:
- Spec: doc/specs/{slug}/02-specification.md
- This is task {X} of {total} in the implementation

Technical Requirements:
{Copy from 03-tasks.md}

Acceptance Criteria:
{Copy from 03-tasks.md}

Files to Modify:
{Copy from 03-tasks.md}

{If this task has dependencies:}
Previous work completed:
- Task {dep}: {brief summary of what was done}

Implement this task following project conventions.
Report back with:
1. What was implemented
2. Files modified/created
3. Any issues or concerns
```

#### 4c. Write Tests

Launch testing expert to write/update tests:
- Cover acceptance criteria
- Test edge cases
- Aim for meaningful coverage (not 100%, but critical paths)

Run tests to verify they pass.

#### 4d. Code Review

**Required step** - Launch code review expert for two-pass review:

1. **Completeness Check:** Are ALL acceptance criteria met?
2. **Quality Check:** Code quality, security, error handling

**If issues found:**
- CRITICAL issues: Must fix before proceeding
- IMPORTANT issues: Should fix
- MINOR issues: Note for later

Loop back to 4b if critical issues need fixing.

#### 4e. Update Task Status

Once task passes review, update `03-tasks.md`:
- Change status from `in_progress` to `completed`
- Add completion note with date and summary

**Display:**
```
Task {X.Y} Complete
- Files modified: {list}
- Tests added: {list}
- Notes: {any relevant notes}
```

#### 4f. Commit Changes

Create atomic commit for the task:
```
git add [relevant files]
git commit -m "{type}({scope}): {description}"
```

Follow project's commit conventions.

### Step 5: Track Progress in Real-Time

Throughout execution, keep `03-tasks.md` updated:

1. **Task status changes** - Update immediately when starting/completing tasks
2. **Summary table** - Update counts as tasks progress
3. **Notes** - Add implementation notes, decisions, issues discovered

**Save-as-you-go:** Update the file after each significant action to prevent data loss if session is interrupted.

### Step 6: Create/Update Implementation Summary

After completing tasks (or when session ends), create/update `doc/specs/{slug}/04-implementation.md`:

```markdown
# Implementation Summary: {Feature Title}

**Spec:** doc/specs/{slug}/02-specification.md
**Tasks:** doc/specs/{slug}/03-tasks.md
**Created:** {date}
**Last Updated:** {date}

## Progress

| Status | Count |
|--------|-------|
| Completed | X |
| In Progress | X |
| Pending | X |

## Session Log

### Session {N} - {date}

**Tasks Completed:**
- Task {X.Y}: {title} - {brief summary}
- Task {X.Y}: {title} - {brief summary}

**Files Modified:**
- `path/to/file.ts` - {what changed}

**Tests Added:**
- `path/to/test.ts` - {what's tested}

**Notes:**
{Any implementation decisions, issues discovered, or context for future sessions}

---

### Session {N-1} - {date}
...

## Known Issues

{Any issues discovered during implementation}

## Next Steps

{If incomplete:}
- [ ] Continue with Task {X.Y}
- [ ] Address {issue}

{If complete:}
- [ ] Run /spec:feedback to process post-implementation feedback
- [ ] Run /spec:doc-update to sync documentation
```

### Step 7: Present Summary

**If all tasks completed:**
```
---------------------------------------------------
Implementation Complete
---------------------------------------------------

Feature: {slug}
Tasks Completed: {total}

All acceptance criteria have been met.

Next Steps:
1. Manual testing of the implemented feature
2. Run /spec:feedback for post-implementation review
3. Run /spec:doc-update to update documentation
4. Run /git:commit to commit all changes
```

**If session ended with tasks remaining:**
```
---------------------------------------------------
Session Complete
---------------------------------------------------

Feature: {slug}
Progress: {completed}/{total} tasks

Completed this session:
- Task {X.Y}: {title}
- Task {X.Y}: {title}

Next task: Task {X.Y} - {title}

To continue: /spec:execute doc/specs/{slug}/03-tasks.md
```

---

## Example Usage

```bash
# Auto-select most recently modified tasks file
/spec:execute

# Or specify a path explicitly
/spec:execute doc/specs/fix-chat-scroll-bug/03-tasks.md
```

This will:
1. Locate the tasks file (and derive the spec path)
2. Determine current execution state
3. Execute pending tasks with specialist agents
4. Update 03-tasks.md in real-time
5. Create/update implementation summary
6. Report progress and next steps

---

## Notes

- **Re-entrant:** Run multiple times to continue from where you left off
- **Save-as-you-go:** Task file updated after each significant action
- **Session continuity:** Implementation summary preserves history across sessions
- **Parallelization:** Use concurrent agents when tasks/concerns are independent
- **Domain experts:** Match tasks to appropriate specialist agents for better quality
