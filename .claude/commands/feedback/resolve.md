---
description: Batch analyze and resolve pending feedback items
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(ls:*), Bash(find:*), Bash(date:*), AskUserQuestion, Task, mcp__*
argument-hint: "[path-to-feedback-file]"
category: workflow
---

# Resolve Feedback

**Feedback File (optional):** $ARGUMENTS

---

## Workflow Instructions

This command batch processes all pending feedback items, analyzing each and helping the user decide how to resolve them. Updates the specification with approved changes. Follow each step sequentially.

### Step 1: Locate Feedback File

**If a path was provided:** Use that path directly.

**If no path was provided:** Find the most recently modified `05-feedback.md` file in `doc/specs/`:
1. Search for all `05-feedback.md` files under `doc/specs/`
2. Select the one with the most recent modification time
3. Inform the user which file was auto-selected:
   ```
   Auto-selected: doc/specs/{slug}/05-feedback.md (modified {time})
   ```

**If no feedback file found:**
```
No feedback file found. Run /feedback first to capture feedback items.
```
Exit the command.

Extract the feature slug from the path.
Derive the specification path: `doc/specs/{slug}/02-specification.md`

### Step 2: Load Pending Feedback

Read `05-feedback.md` and extract all items under "## Pending" section.

**If no pending items:**
```
No pending feedback to resolve.

All feedback has been processed. If you have new feedback, run /feedback to add items.
```
Exit the command.

**Display summary:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Resolving Feedback: {slug}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{count} pending feedback item(s):

1. FB-{N}: {brief title}
2. FB-{N}: {brief title}
...
```

### Step 3: Batch Analysis

**Parallelization opportunity:** Analyze all pending feedback items concurrently. **Instruct agents to return findings as text only - no file creation.**

For each pending feedback item, launch analysis in parallel:
- Read relevant code sections mentioned in or related to the feedback
- Check specification for related requirements
- Identify which spec sections would need updates if implemented

Use relevant domain experts (e.g., react-expert for UI feedback, database-expert for data issues). All agents return text findings.

Collect analysis results for all items before proceeding to resolution.

### Step 4: Resolve Each Item

Present each feedback item with its analysis for user decision.

For each pending item:

#### 4a. Present the Feedback

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Feedback {current} of {total}: FB-{N}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{original feedback text}

**Analysis:**
- Related code: {files/components identified}
- Spec sections affected: {sections that would need updates}
- Complexity estimate: {low/medium/high}
```

#### 4b. Ask for Decision

Use **AskUserQuestion tool** to present options:

```
AskUserQuestion:
  questions:
    - header: "FB-{N}"
      question: "How should we handle this feedback?"
      multiSelect: false
      options:
        - label: "Implement"
          description: "Add to specification for implementation"
        - label: "Defer"
          description: "Valid but not for this iteration"
        - label: "Out of scope"
          description: "Not aligned with feature goals"
```

#### 4c. Capture Rationale (if Defer or Out of scope)

If user selected **Defer** or **Out of scope**, use another AskUserQuestion:

```
AskUserQuestion:
  questions:
    - header: "Reason"
      question: "Brief reason for this decision? (Select 'Other' to provide)"
      multiSelect: false
      options:
        - label: "Not enough time"
          description: "Will address in future iteration"
        - label: "Low priority"
          description: "Other items take precedence"
        - label: "Technical constraints"
          description: "Current architecture doesn't support this"
```
(User can select a preset or provide custom reason via "Other")

#### 4d. Record Resolution

Update `05-feedback.md`:

1. Remove item from "## Pending" section
2. Add to "## Resolved" section with resolution details:

```markdown
### FB-{N}: {brief title}
**Added:** {original date}
**Resolved:** {current date}
**Outcome:** {implement | defer | out-of-scope}
**Decision:** {user's rationale or "Approved for implementation"}

{original feedback text}

```

**Save immediately** after each resolution (save-as-you-go).

### Step 5: Update Specification

After all items resolved, if any were marked **Implement**:

1. Read the current specification

2. **Update relevant spec sections** with the new requirements from each "implement" item

3. **Add changelog entry** at the end of the spec (create "## Changelog" section if it doesn't exist):

```markdown
## Changelog

### {YYYY-MM-DD HH:MM} - Feedback Resolution

**Source:** /feedback:resolve
**Feedback Items:** FB-{N}, FB-{N}, ...

**Changes:**
- {Section X.Y}: {what was added/changed}
- {Section X.Y}: {what was added/changed}

**New Requirements:**
- {Requirement 1 from feedback}
- {Requirement 2 from feedback}
```

**Important:** The changelog entry format is used by `/spec:decompose` to detect what needs new tasks. The datetime and "New Requirements" list are critical for incremental task generation. Use 24-hour format (e.g., `2025-01-15 14:30`).

4. Save the specification

### Step 6: Present Summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Feedback Resolution Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Results:**
| Outcome | Count |
|---------|-------|
| Implement | {X} |
| Defer | {X} |
| Out of Scope | {X} |

**Feedback file:** doc/specs/{slug}/05-feedback.md

{If any "implement" items:}
**Specification updated:** doc/specs/{slug}/02-specification.md

**Next Steps:**
1. Review spec changes at doc/specs/{slug}/02-specification.md
2. Run /spec:decompose doc/specs/{slug}/02-specification.md to create new tasks
3. Run /spec:execute to implement the changes

{If no "implement" items:}
No specification changes needed. All feedback was deferred or marked out of scope.

{If any "defer" items:}
**Deferred Items ({count}):**
- FB-{N}: {title} - {reason}
Consider these for future iterations.
```

---

## Example Usage

```bash
# Auto-select most recently modified feedback file
/feedback:resolve

# Or specify a path explicitly
/feedback:resolve doc/specs/fix-chat-scroll-bug/05-feedback.md
```

This will:
1. Locate the feedback file
2. Load all pending items
3. Analyze all items in parallel
4. Present each for user decision
5. Update feedback file with resolutions
6. Update specification with approved changes
7. Present summary and next steps

---

## Notes

- **Batch processing:** All items analyzed upfront, then resolved sequentially
- **Parallelization:** Analysis phase uses concurrent agents for speed
- **Save-as-you-go:** Each resolution saved immediately
- **Spec integration:** "Implement" items automatically update the specification
- **Re-entrant:** Safe to run multiple times; only processes pending items
