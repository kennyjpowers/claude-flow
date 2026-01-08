---
name: spec-create
description: "Generate a comprehensive specification document for a feature or bugfix. Use when you need to create a new spec file with full technical detail."
---

# Specification Creation Skill

## Overview

This skill guides you through creating a comprehensive specification document for a feature or bugfix. The spec should contain enough detail for autonomous implementation.

**Announce at start:** "I'm using the spec-create skill to generate the specification."

## Inputs Required

Before using this skill, you should have:
1. **Task description** - Clear description of what to build/fix
2. **Output path** - Where to save the spec (e.g., `doc/specs/{slug}/02-specification.md`)
3. **Technical context** (optional) - Files affected, dependencies, constraints

## Process

### Phase 1: Pre-Reading & Context Discovery

**Parallelization opportunity:** Launch `Explore` or domain expert agents concurrently.

1. Scan repository for guidance documents:
   - Developer guides in `developer-guides/`, `docs/`
   - AI tooling configuration (CLAUDE.md, AGENTS.md)
   - Architecture documentation
   - README files
   - Existing specs in `specs/` or `doc/specs/` - follow established patterns

2. Search codebase for related features/code:
   - Similar implementations
   - Potential conflicts or duplicates
   - Current library versions

3. Record key conventions, patterns, and constraints.

### Phase 2: First Principles Problem Analysis

Before defining any solution, validate the problem:

**Core Problem Investigation:**
- What is the core problem, separate from any proposed solution?
- Why does this problem exist? What created this need?
- What are we fundamentally trying to achieve?
- Could we achieve the goal without building anything?

**Problem Validation:**
- Is this solving a real problem users actually have?
- What assumptions might be wrong?
- What is the minimum viable solution?

**CRITICAL: Only proceed if the core problem is clearly defined.**

### Phase 3: End-to-End Integration Analysis

Map the complete system impact:

- **Data Flow**: Trace from user action → processing → storage → response
- **Service Dependencies**: Identify all affected services, APIs, databases
- **Integration Points**: Map every place this feature touches existing functionality
- **User Journey**: Entry points, step-by-step flow, error scenarios, exit points
- **Deployment**: Migration path, rollback strategy, data migration

### Phase 4: Write the Specification

Create the spec document with these sections:

```markdown
# {Title}

**Status:** Draft
**Author:** Claude Code
**Date:** {YYYY-MM-DD}
**Branch:** preflight/{slug}
**Related:** {links to issues/PRs/specs}

---

## Overview
{Brief description and purpose}

## Background/Problem Statement
{Why this feature is needed, what problem it solves}

## Goals
- {Goal 1}
- {Goal 2}

## Non-Goals
- {Explicitly out of scope item 1}
- {Explicitly out of scope item 2}

## Technical Dependencies
- {Library/framework with version}
- {Links to relevant documentation}

## Detailed Design

### Architecture Changes
{Description of architectural impact}

### Implementation Approach
{How this will be built}

### Code Structure
{File organization, new files, modified files}

### API Changes
{New/modified endpoints, request/response formats}

### Data Model Changes
{Database schema changes, new models}

## User Experience
{How users will interact with this feature}

## Testing Strategy

### Unit Tests
{What to test, key scenarios}

### Integration Tests
{Cross-component testing approach}

### E2E Tests
{User journey tests if needed}

**Test Documentation:** Each test should include a purpose comment explaining why it exists.

## Performance Considerations
{Impact on performance, mitigation strategies}

## Security Considerations
{Security implications, safeguards}

## Documentation
{What docs need to be created/updated}

## Implementation Phases

### Phase 1: MVP/Core Functionality
- {Task 1}
- {Task 2}

### Phase 2: Enhanced Features (if applicable)
- {Task 3}

### Phase 3: Polish and Optimization (if applicable)
- {Task 4}

## Open Questions
1. {Unresolved question 1}
2. {Unresolved question 2}

## References
- {Related issues, PRs, documentation}
- {External library docs}
```

### Phase 5: Validation Checkpoints

After completing each major section, verify:
- **Problem Statement**: Specific and measurable?
- **Technical Requirements**: All dependencies available?
- **Implementation Plan**: Technically sound?
- **Testing Strategy**: All requirements testable?

### Phase 6: Final Validation

Before marking complete:
1. **Completeness Check**: All sections meaningfully filled
2. **Consistency Check**: No contradictions between sections
3. **Implementability Check**: Someone could build this from the spec
4. **Quality Score**: Rate spec 1-10, only accept 8+

## Guidelines

- Use Markdown format similar to existing specs
- Be thorough and technical but also accessible
- Include code examples where helpful
- Consider edge cases and error scenarios
- Reference existing project patterns and conventions
- Use diagrams if they would clarify complex flows (ASCII art or mermaid)
- **Do NOT include time or effort estimations**

## Output

Write the specification to the provided output path (e.g., `doc/specs/{slug}/02-specification.md`).

Create parent directories if needed: `mkdir -p $(dirname OUTPUT_PATH)`
