---
description: Transform completed brainstorm into specification
allowed-tools: Read, Grep, Glob, Write, Edit, AskUserQuestion, Bash(ls:*), Bash(find:*), Bash(mkdir:*), Task, mcp__*
argument-hint: "[path-to-brainstorm-doc]"
category: workflow
---

# Brainstorm → Spec

**Brainstorm Document (optional):** $ARGUMENTS

---

## CRITICAL CONSTRAINTS

**Output:** Create ONLY ONE file: `doc/specs/{slug}/02-specification.md`

**Prohibited:**
- NO code changes
- NO extra documentation files
- NO example files or scripts

**Subagents:** If used, instruct them to return findings as text only - no file creation.

---

## Workflow Instructions

This command transforms a completed brainstorm document (with all clarifications resolved) into a technical specification. Follow each step sequentially.

### Step 1: Locate Brainstorm Document

**If a path was provided:** Use that path directly.

**If no path was provided:** Find the most recently modified `01-brainstorm.md` file in `doc/specs/`:
1. Search for all `01-brainstorm.md` files under `doc/specs/`
2. Select the one with the most recent modification time
3. Inform the user which file was auto-selected:
   ```
   Auto-selected: doc/specs/{slug}/01-brainstorm.md (modified {time})
   ```

### Step 2: Verify Clarifications Complete

1. Read the brainstorm document
2. Check Section 6 (Clarification) for any unanswered questions
3. If unanswered questions exist:
   ```
   ⚠️ Unresolved clarifications found in brainstorm document.

   Please run `/brainstorm:clarify` first to resolve all questions before creating the spec.
   ```
   Exit the command.

4. Extract the feature slug from the path (e.g., `doc/specs/fix-chat-scroll-bug/01-brainstorm.md` → slug is `fix-chat-scroll-bug`)

### Step 3: Synthesize Brainstorm Content

Read and synthesize the key information from the brainstorm document:

1. **Intent & Assumptions** (Section 1):
   - Task brief - what we're building/fixing and why
   - Assumptions made
   - What's explicitly out of scope

2. **Codebase Map** (Section 3):
   - Primary components/modules that will be affected (with file paths)
   - Shared dependencies
   - Data flow
   - Potential blast radius

3. **Root Cause Analysis** (Section 4, if present):
   - Bug context and selected hypothesis

4. **Research Findings** (Section 5):
   - Recommended approach
   - Alternatives considered with pros/cons

5. **Resolved Clarifications** (Section 6):
   - All user decisions with their answers

### Step 4: Identify Specification Scope

Based on the brainstorm document and resolved clarifications:

1. **Determine specification scope:**
   - Is this a single feature/fix or does it need multiple specs?
   - Are there prerequisite changes needed first?
   - Should any parts be deferred to follow-up work?

2. **If scope is unclear, use AskUserQuestion tool:**
   ```
   AskUserQuestion:
     questions:
       - header: "Scope"
         question: "How should we scope this specification?"
         multiSelect: false
         options:
           - label: "Single comprehensive spec (Recommended)"
             description: "One spec covering all requirements from the brainstorm"
           - label: "Multiple smaller specs"
             description: "Break into separate specs for distinct concerns"
           - label: "Phased approach"
             description: "Core MVP first, defer advanced features"
   ```

3. **Record the specification plan:**
   ```
   Primary spec: {description}
   Additional specs (if any): {list}
   Deferred work: {list}
   ```

### Step 5: Prepare Spec Creation Context

Gather all information needed for the specification:

1. **Task description** (from Intent + resolved clarifications):
   - Clear, imperative statement of what to build/fix
   - Include "why" context from the brainstorm
   - Reference the recommended approach from Research

2. **Technical context** (from Codebase Map):
   - Files/components that will be modified (with paths)
   - Data flow and dependencies
   - Potential blast radius

3. **Implementation constraints** (from clarifications + research):
   - All resolved clarification decisions
   - Architectural choices from research
   - Out-of-scope items

4. **Acceptance criteria** (inferred from brainstorm):
   - User-visible outcomes
   - Technical requirements
   - Non-regression requirements

### Step 6: Execute Spec Creation Using the Skill

1. **Create the output directory if needed:**
   ```bash
   mkdir -p doc/specs/{slug}
   ```

2. Use and follow the `spec-create` skill exactly as written to generate the specification.
   
   Pass to the skill:
   - Task description, technical context, constraints, and acceptance criteria from Step 5
   - Output path: `doc/specs/{slug}/02-specification.md`

3. **Verify the spec file was created at:** `doc/specs/{slug}/02-specification.md`

### Step 7: Present Summary & Next Steps

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Specification Created ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Feature:** {slug}
**Brainstorm:** doc/specs/{slug}/01-brainstorm.md
**Specification:** doc/specs/{slug}/02-specification.md

### What Was Specified

1. {Key feature/fix described}
2. {Technical approach chosen}
3. {Implementation scope}

### Decisions Incorporated

{List each resolved clarification with its answer}

### Recommended Next Steps

1. Review the specification at doc/specs/{slug}/02-specification.md
2. Run `/spec:refine doc/specs/{slug}/02-specification.md` (if validation issues to resolve)
3. Run `/spec:decompose doc/specs/{slug}/02-specification.md`
4. Implement with: `/spec:execute doc/specs/{slug}/02-specification.md`

### Deferred Work (if any)

{Items explicitly deferred during brainstorming}
```

---

## Example Usage

```bash
# Auto-select most recently modified brainstorm
/brainstorm:spec

# Or specify a path explicitly
/brainstorm:spec doc/specs/fix-chat-scroll-bug/01-brainstorm.md
```

This will:
1. Locate the completed brainstorm document
2. Verify all clarifications have been resolved
3. Synthesize the brainstorm content
4. Use the `spec-create` skill to generate the specification
5. Present summary and next steps

---

## Notes

- **Requires completed clarifications:** Will not proceed if unanswered questions exist
- **Preserves context:** All brainstorm research and decisions flow into the spec
- **Consistent output path:** Spec created at `doc/specs/{slug}/02-specification.md`
