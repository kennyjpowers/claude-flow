---
description: Interactively resolve clarification questions from brainstorm
allowed-tools: Read, Grep, Glob, Edit, AskUserQuestion, Bash(ls:*), Bash(find:*), Task, mcp__*
argument-hint: "[path-to-brainstorm-doc]"
category: workflow
---

# Brainstorm Clarify

**Brainstorm Document (optional):** $ARGUMENTS

---

## Workflow Instructions

This command interactively resolves clarification questions from a brainstorm document, then evaluates whether additional questions have emerged. Follow each step sequentially.

### Step 1: Locate Brainstorm Document

**If a path was provided:** Use that path directly.

**If no path was provided:** Find the most recently modified `01-brainstorm.md` file in `doc/specs/`:
1. Search for all `01-brainstorm.md` files under `doc/specs/`
2. Select the one with the most recent modification time
3. Inform the user which file was auto-selected:
   ```
   Auto-selected: doc/specs/{slug}/01-brainstorm.md (modified {time})
   ```

### Step 2: Extract Slug & Read Document

1. Extract the feature slug from the brainstorm path (e.g., `doc/specs/fix-chat-scroll-bug/01-brainstorm.md` → slug is `fix-chat-scroll-bug`)

2. Read the brainstorm document

3. Extract key context:
   - **Intent & Assumptions** (Section 1) - Task brief, assumptions, out of scope
   - **Codebase Map** (Section 3) - Components/modules affected
   - **Research** (Section 5) - Potential solutions and recommendation
   - **Clarification** (Section 6) - Questions requiring user input

### Step 3: Interactive Clarification Gathering

Review the clarifications from Section 6 of the brainstorm document. **Skip any question that is already marked as answered** (contains "**Answer:**" or is struck through with `~~`).

For each unanswered clarification:

1. **Present the decision point clearly** to the user with:
   - Context from the research findings (Section 5)
   - Recommended option (if the research identified one)
   - Pros/cons of alternatives (if applicable)
   - Impact on implementation complexity/scope

2. **Ask the user to decide** with specific options when possible:
   - Multiple choice format for clear alternatives
   - Open-ended questions for creative/architectural decisions
   - Default recommendations to speed up decision-making

3. **Record and save the decision immediately:**
   - Update the brainstorm document after each answer
   - Use strikethrough format to preserve the original question
   - Mark with "(RESOLVED)" and include the answer

**Example interaction format:**
```
Clarification 1 of 3: State management approach
From research: We identified Redux and Zustand as viable options

Options:
  A) Redux (recommended) - Team already familiar, good DevTools
  B) Zustand - Simpler API, less boilerplate
  C) React Context - No new dependencies, but limited for complex state

Which approach do you prefer? [A/B/C or your own approach]
```

**Example answer format in document:**
```markdown
1. ~~What state management approach should we use?~~ (RESOLVED)
   **Answer:** Redux - team familiarity and DevTools support

   Original context:
   - Redux: Team already familiar, good DevTools
   - Zustand: Simpler API, less boilerplate
```

If no unanswered questions remain, skip to Step 4.

### Step 4: Evaluate for Additional Clarifications

After all existing questions have been answered, re-read the brainstorm document and analyze the answers holistically.

**Consult Domain Experts:** Before concluding, check which specialized agents, skills, plugins, or MCP servers are currently available (e.g., react-expert, database-expert, security-auditor, documentation tools, etc.). **Launch relevant domain experts in parallel** when multiple apply - given the user's answers, they may surface additional questions or concerns that weren't apparent before.

Consider whether any answers have revealed new questions that weren't previously considered:
- Does an answer reveal a dependency or prerequisite?
- Does an answer contradict or conflict with another answer?
- Does an answer open up a new decision branch (e.g., "use library X" → "which version?")
- Does an answer imply scope changes that need clarification?
- Does the combination of answers reveal integration concerns?

**If additional clarifications ARE needed:**

1. Formulate clear, specific questions for each new clarification
2. Append them to Section 6 under a divider marking them as follow-up questions
3. Inform the user:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Additional Clarifications Needed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on your answers, additional questions have emerged:

{List the new questions briefly}

The brainstorm document has been updated with these questions.

**Next Step:** Run `/brainstorm:clarify {path}` again to resolve the follow-up questions.
```

**If NO additional clarifications are needed:**

Inform the user that clarification is complete:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Clarification Complete ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All clarification questions have been resolved.

**Summary of Decisions:**
{List each resolved question with its answer}

**Brainstorm Document:** doc/specs/{slug}/01-brainstorm.md

**Next Step:** Ready to proceed with spec creation!
Run `/brainstorm:spec doc/specs/{slug}/01-brainstorm.md`
```

---

## Example Usage

```bash
# Auto-select most recently modified brainstorm
/brainstorm:clarify

# Or specify a path explicitly
/brainstorm:clarify doc/specs/fix-chat-scroll-bug/01-brainstorm.md
```

This will:
1. Locate the brainstorm document (auto-select if no path provided)
2. Present each unanswered clarification question interactively
3. Record answers directly in the document
4. Evaluate if additional questions emerged from the answers
5. Either prompt for another clarify session or declare ready for spec creation

---

## Notes

- **Iterative by design:** May need multiple runs if answers generate new questions
- **Save-as-you-go:** Each answer saved immediately to prevent data loss
- **Re-entrant:** Safe to run multiple times; skips already-answered questions
