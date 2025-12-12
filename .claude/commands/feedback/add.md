---
description: Quickly capture feedback items for a feature
allowed-tools: Read, Write, Edit, Glob, Bash(ls:*), Bash(find:*), Bash(date:*), AskUserQuestion
argument-hint: "[path-to-spec-file]"
category: workflow
---

# Add Feedback

**Specification (optional):** $ARGUMENTS

---

## Workflow Instructions

This command quickly captures feedback items for a feature. Run after manual testing to document issues, suggestions, or changes needed. Follow each step sequentially.

### Step 1: Locate Specification

**If a path was provided:** Use that path directly.

**If no path was provided:** Find the most recently modified `02-specification.md` file in `doc/specs/`:
1. Search for all `02-specification.md` files under `doc/specs/`
2. Select the one with the most recent modification time
3. Inform the user which file was auto-selected:
   ```
   Auto-selected: doc/specs/{slug}/02-specification.md (modified {time})
   ```

**If no spec found:**
```
No specification found. Create one first with /spec:create or /brainstorm:spec
```
Exit the command.

Extract the feature slug from the path (e.g., `doc/specs/fix-chat-scroll-bug/02-specification.md` → slug is `fix-chat-scroll-bug`).

### Step 2: Initialize or Load Feedback File

Check if `doc/specs/{slug}/05-feedback.md` exists.

**If it doesn't exist:** Create it with this structure:

```markdown
# Feedback: {Feature Title from spec}

**Spec:** doc/specs/{slug}/02-specification.md
**Created:** {date}

## Pending

{feedback items will be added here}

## Resolved

{resolved items will be moved here by /feedback:resolve}
```

**If it exists:** Read it to determine the next feedback ID (FB-N).

### Step 3: Capture Feedback Loop

Display:
```
Adding Feedback: {slug}
```

**Loop until user is done:**

1. **Use AskUserQuestion tool** to gather feedback:
   ```
   AskUserQuestion:
     questions:
       - header: "Feedback"
         question: "What feedback do you have? (Select 'Other' to enter your feedback, or 'Done' to finish)"
         multiSelect: false
         options:
           - label: "Done"
             description: "Finished adding feedback items"
   ```
   (User will select "Other" and provide feedback text, or "Done" to exit)

2. **If user selects "Done":** Exit the loop

3. **Otherwise (user provided text via "Other"):** Add the feedback item:
   - Generate next ID: FB-{N} where N increments from highest existing ID
   - Generate brief title: Extract first ~5 words or create summary
   - Append to the "## Pending" section:

   ```markdown
   ### FB-{N}: {brief title}
   **Added:** {date}

   {verbatim feedback text}

   ```

   - Confirm: `FB-{N} added.`

4. Continue loop (ask for next feedback)

### Step 4: Present Summary

After user selects "Done":

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{count} feedback item(s) added
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Feedback file: doc/specs/{slug}/05-feedback.md

{If there are pending items:}
Next: Run /feedback:resolve to analyze and resolve pending feedback
```

**If no items were added (user immediately typed 'done'):**
```
No feedback added. Run /feedback again when you have items to capture.
```

---

## Example Usage

```bash
# Auto-select most recently modified specification
/feedback

# Or specify a path explicitly
/feedback doc/specs/fix-chat-scroll-bug/02-specification.md
```

This will:
1. Locate the specification and derive feedback file path
2. Create or load the feedback file
3. Loop to capture multiple feedback items
4. Save each item immediately (save-as-you-go)
5. Present summary and next steps

---

## Notes

- **Quick capture:** Each item is just text - no analysis or resolution yet
- **Save-as-you-go:** Each feedback item saved immediately to prevent data loss
- **Re-entrant:** Run multiple times to add more feedback
- **IDs persist:** Feedback IDs never reused, even after resolution
