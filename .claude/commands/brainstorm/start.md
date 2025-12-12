---
description: Structured brainstorm with documentation
allowed-tools: Read, Grep, Glob, Bash(git:*), Bash(npm:*), Bash(npx:*), Task, mcp__*
argument-hint: "<task-brief>"
category: workflow
---

# Brainstorm

**Task Brief:** $ARGUMENTS

---

## Workflow Instructions

Execute this structured engineering workflow for brainstorming that enforces complete investigation for any code-change task (bug fix or feature). Follow each step sequentially.

### Step 1: Create Task Slug & Setup

1. Create a URL-safe slug from the task brief (e.g., "fix-chat-scroll-bug")
2. Create feature directory: `mkdir -p doc/specs/{slug}`

This directory will contain all documents related to this feature throughout its lifecycle (brainstorming → spec → tasks → implementation).

### Step 2: Echo & Scope

Write an "Intent & Assumptions" block that:
- Restates the task brief in 1-3 sentences
- Lists explicit assumptions
- Lists what's explicitly out-of-scope to avoid scope creep

This becomes the opening of the brainstorm file.

### Step 3: Pre-Reading & Codebase Mapping

**Parallelization opportunity:** Launch multiple subagents concurrently to speed up codebase exploration - e.g., one for scanning documentation, one for searching relevant code, one for analyzing dependencies.

1. Scan repository for:
   - Developer guides in `developer-guides/`
   - Any AI tooling configuration like rules
   - Architecture docs in the root directory
   - README files
   - Related spec files in `specs/` or `doc/specs/`

2. Search for relevant code using keywords inferred from task:
   - Components, hooks, utilities
   - Styles and layout files
   - Data access patterns
   - Feature flags or config

3. Build a dependency/context map:
   - Primary components/modules (with file paths)
   - Shared dependencies (theme/hooks/utils/stores)
   - Data flow (source → transform → render)
   - Feature flags/config
   - Potential blast radius

Record findings under **Pre-reading Log** and **Codebase Map** sections.

### Step 4: Root Cause Analysis (bugs only)

If the task is a bug fix for existing functionality:

1. Reproduce the issue or model the feature behavior locally
2. Capture:
   - Reproduction steps (numbered)
   - Observed vs expected behavior
   - Relevant logs or error messages
   - Screenshots if UI-related

3. Identify plausible root-cause hypotheses with evidence:
   - Code lines, props/state issues
   - CSS/layout rules
   - Event handlers, race conditions
   - API or data flow issues

4. Select the most likely hypothesis and explain why

Record under **Root Cause Analysis**.

### Step 5: Research

**Parallelization opportunity:** If multiple research angles exist (e.g., different libraries, approaches, or external resources), launch parallel subagents to investigate them concurrently.

1. Consult the research-expert agent to conduct comprehensive research into potential solutions to the task
2. Search for existing open source tooling that is intended to solve similar problems, and prioritize using them rather than a custom solution if they have significant adoption (100+ stars on github, or > 1000 weekly downloads)
2. Consider which potential solutions are most appropriate for this code base by exploring the local repo further if necessary
3. Summarize the most promising potential approaches, the pros and cons of each, and an ultimate recommendation.

Record findings under **Research Findings**

### Step 6: Consult Domain Experts

Before synthesizing clarification questions, check which specialized agents, skills, plugins, or MCP servers are currently available (e.g., react-expert, database-expert, security-auditor, documentation tools, etc.). **Launch relevant domain experts in parallel** when multiple apply - consult any that are relevant to this bug or feature to:

- Get domain-specific insights on the problem space
- Identify potential pitfalls or considerations you may have missed
- Surface technical questions that a domain expert would ask
- Validate or challenge the research recommendations
- Fetch relevant library documentation if MCP tools are available

Incorporate their insights into your understanding before proceeding to clarification.

### Step 7: Clarification

The primary goal of this brainstorm is to surface ALL relevant clarification questions to the user rather than making key decisions yourself. If a choice is not 100% obvious, it should be considered an unspecified requirement.

1. Create a list of any unspecified requirements or clarification that would be helpful for the user to decide upon

### Step 8: Write brainstorm document

Create `doc/specs/{slug}/01-brainstorm.md` with the following structure:

```markdown
# {Task Title}

**Slug:** {slug}
**Author:** Claude Code
**Date:** {current-date}
**Branch:** preflight/{slug}
**Related:** {links-to-issues/PRs/specs}

---

## 1) Intent & Assumptions
- **Task brief:** {task description}
- **Assumptions:** {bulleted list}
- **Out of scope:** {bulleted list}

## 2) Pre-reading Log
{List files/docs read with 1-2 line takeaways}
- `path/to/file`: takeaway...

## 3) Codebase Map
- **Primary components/modules:** {paths + roles}
- **Shared dependencies:** {theme/hooks/utils/stores}
- **Data flow:** {source → transform → render}
- **Feature flags/config:** {flags, env, owners}
- **Potential blast radius:** {areas impacted}

## 4) Root Cause Analysis
- **Repro steps:** {numbered list}
- **Observed vs Expected:** {concise description}
- **Evidence:** {code refs, logs, CSS/DOM snapshots}
- **Root-cause hypotheses:** {bulleted with confidence}
- **Decision:** {selected hypothesis + rationale}

## 5) Research
- **Potential solutions:** {numbered list with pros and cons for each}
- **Recommendation** {consise description}

## 6) Clarification
- **Clarifications:** {numbered list with decisions for the user to clarify}


```


---

## Example Usage

```bash
/brainstorm Fix chat UI auto-scroll bug when messages exceed viewport height
```

This will execute the full workflow, creating comprehensive brainstorm document at `doc/specs/fix-chat-ui-auto-scroll-bug/01-brainstorm.md` and guide you through discovery of the task.
