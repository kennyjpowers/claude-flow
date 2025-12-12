---
description: Implement a validated specification task by task
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(ls:*), Bash(find:*), Bash(git:*), Bash(npm:*), Bash(npx:*), Task, TodoWrite, mcp__*
argument-hint: "[path-to-tasks-file]"
category: workflow
---

# Execute Specification

**Tasks File (optional):** $ARGUMENTS

---

## CRITICAL REQUIREMENTS

**Status Updates are MANDATORY:**
- You MUST update `03-tasks.md` **immediately** when starting each task (mark `🔄 in_progress`)
- You MUST update `03-tasks.md` **immediately** when completing each task (mark `✅ completed`)
- You MUST update the Summary table counts after each status change
- **DO NOT** batch status updates - update the file after EACH task state change
- Use the Edit tool to modify task status, not Write (preserves file structure)

**Parallelization is REQUIRED when possible:**
- Read the "## Parallelization Strategy" section in `03-tasks.md`
- Launch parallel tasks using multiple Task tool calls in a single message
- Only run tasks sequentially when they have explicit dependencies

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
   - **Parallelization Strategy section** - which tasks can run in parallel

3. **Read the specification** to understand overall scope and requirements

4. **Build execution plan based on parallelization:**
   - Identify the next batch of parallelizable tasks
   - Note sequential dependencies that must be respected

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

Work through tasks following the Parallelization Strategy:
- **Parallel groups:** Launch all tasks in a group simultaneously using multiple Task tool calls
- **Sequential tasks:** Execute one at a time in dependency order

**Before starting ANY task implementation:**

#### 4a. Mark Task In Progress (MANDATORY FIRST STEP)

**⚠️ DO THIS BEFORE ANY IMPLEMENTATION WORK:**

1. Use Edit tool to update `03-tasks.md`:
   - Change `**Status:** ⏳ pending` to `**Status:** 🔄 in_progress`
   - Add `**Started:** {YYYY-MM-DD HH:MM}`

2. Update the Summary table counts

3. **Only after the file is saved**, proceed to implementation

**Display:**
```
Starting Task {X.Y}: {Title}
Status: 🔄 in_progress (updated in 03-tasks.md)
```

#### 4b. Implement (Parallel or Sequential)

**For Parallel Groups (from Parallelization Strategy):**

If the current tasks are in a parallel group, launch them ALL simultaneously:
1. Mark ALL tasks in the group as `🔄 in_progress` first (multiple Edit calls)
2. Launch ALL task implementations in a single message with multiple Task tool calls
3. When all complete, mark ALL as `✅ completed`

**For Sequential Tasks:**

Execute one at a time following dependency order.

Read the full task details from `03-tasks.md` (technical requirements, acceptance criteria, files to modify).

**Leverage available AI resources:** Match task domain to appropriate specialists (e.g., react-expert, database-expert, typescript-expert).

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

#### 4e. Update Task Status (MANDATORY AFTER COMPLETION)

**⚠️ DO THIS IMMEDIATELY AFTER TASK PASSES REVIEW:**

1. Use Edit tool to update `03-tasks.md`:
   - Change `**Status:** 🔄 in_progress` to `**Status:** ✅ completed`
   - Add `**Completed:** {YYYY-MM-DD HH:MM}`
   - Add completion summary under task

2. Update the Summary table counts

3. **Only after the file is saved**, proceed to next task or commit

**Display:**
```
Task {X.Y} Complete ✅ (updated in 03-tasks.md)
- Files modified: {list}
- Tests added: {list}
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
