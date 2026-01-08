---
name: spec-validate
description: "Analyze a specification document to determine if it has enough detail for autonomous implementation. Use to validate specs before decomposition."
---

# Specification Validation Skill

## Overview

This skill analyzes a specification document to determine if it contains sufficient detail for successful autonomous implementation, while also identifying overengineering and non-essential complexity.

**Announce at start:** "I'm using the spec-validate skill to analyze the specification."

## Inputs Required

- **Spec path** - Path to the specification file to validate

## Process

### Phase 1: Load and Parse Specification

Read the specification document and identify its structure.

### Phase 2: Domain Expert Consultation

**Parallelization opportunity:** Launch relevant domain experts in parallel (e.g., react-expert, database-expert, security-auditor) for comprehensive validation. Instruct them to analyze and return findings as text only.

Match specification domains to expert knowledge for thorough validation.

### Phase 3: Evaluate Three Fundamental Aspects

#### 1. WHY - Intent and Purpose
- Background/Problem Statement clarity
- Goals and Non-Goals definition
- User value/benefit explanation
- Justification vs alternatives
- Success criteria

#### 2. WHAT - Scope and Requirements
- Features and functionality definition
- Expected deliverables
- API contracts and interfaces
- Data models and structures
- Integration requirements (external systems, auth, protocols)
- Performance requirements
- Security requirements

#### 3. HOW - Implementation Details
- Architecture and design patterns
- Implementation phases/roadmap
- Technical approach (core logic, functions, execution flow)
- Error handling (failure modes, recovery, edge cases)
- Platform considerations (cross-platform, dependencies)
- Resource management (constraints, limits, cleanup)
- Testing strategy (purpose docs, meaningful tests, edge cases)
- Deployment considerations

### Phase 4: Additional Quality Checks

**Completeness Assessment:**
- Missing critical sections
- Unresolved decisions
- Open questions

**Clarity Assessment:**
- Ambiguous statements
- Assumed knowledge
- Inconsistencies

**Overengineering Assessment:**
- Features not aligned with core user needs
- Premature optimizations
- Unnecessary complexity patterns

### Phase 5: Overengineering Detection

**Core Value Alignment Analysis:**
- Does this feature solve a real, immediate problem?
- Is it being used frequently enough to justify complexity?
- Would a simpler solution work for 80% of use cases?

**YAGNI Principle (You Aren't Gonna Need It):**
Be aggressive about cutting features:
- If unsure whether it's needed → Cut it
- If it's for "future flexibility" → Cut it
- If only 20% of users need it → Cut it
- If it adds any complexity → Question it, probably cut it

**Common Overengineering Patterns:**

1. **Premature Optimization**
   - Caching for rarely accessed data
   - Performance optimizations without benchmarks
   - Complex algorithms for small datasets

2. **Feature Creep**
   - "Nice to have" features (cut them)
   - Edge case handling for unlikely scenarios (cut them)
   - Multiple ways to do the same thing (keep only one)

3. **Over-abstraction**
   - Generic solutions for specific problems
   - Too many configuration options
   - Unnecessary plugin/extension systems

4. **Infrastructure Overhead**
   - Complex build pipelines for simple tools
   - Multiple deployment environments for internal tools

5. **Testing Extremism**
   - 100% coverage requirements
   - Testing implementation details
   - Mocking everything

### Phase 6: Generate Output

Produce a structured analysis report:

```markdown
## Specification Validation Report

**Spec:** {path}
**Status:** Ready / Not Ready
**Date:** {YYYY-MM-DD}

---

### Summary
{Overall readiness assessment with brief explanation}

### Critical Gaps
{Must-fix issues blocking implementation}
1. {Gap 1}
2. {Gap 2}

### Missing Details
{Specific areas needing clarification}
1. {Detail 1}
2. {Detail 2}

### Open Questions
{Unresolved decisions in the spec}
1. {Question 1}
2. {Question 2}

### Risk Areas
{Potential implementation challenges}
1. {Risk 1}
2. {Risk 2}

### Overengineering Analysis

**Non-core features to remove:**
- {Feature 1} - Reason: {why it should be cut}
- {Feature 2} - Reason: {why it should be cut}

**Suggested simplifications:**
- {Simplification 1}
- {Simplification 2}

**Essential scope (minimum viable):**
- {Core item 1}
- {Core item 2}

### Recommendations
{Next steps to improve the spec}
1. {Recommendation 1}
2. {Recommendation 2}
```

## Output Interpretation

- **Ready**: Spec can proceed to decomposition
- **Ready (with recommendations)**: Minor improvements suggested but not blocking
- **Not Ready**: Critical gaps must be addressed before proceeding

## Example Overengineering Detections

**Unnecessary Caching:**
- Spec: "Cache user preferences with Redis"
- Analysis: User preferences accessed once per session
- Recommendation: Use in-memory storage or localStorage for MVP

**Premature Edge Cases:**
- Spec: "Handle 10,000+ concurrent connections"
- Analysis: Expected usage is <100 concurrent users
- Recommendation: Cut this entirely - let it fail at scale if needed

**Over-abstracted Architecture:**
- Spec: "Plugin system for custom validators"
- Analysis: Only 3 validators needed, all known upfront
- Recommendation: Implement validators directly, no plugin system

**Feature Creep:**
- Spec: "Support 5 export formats (JSON, CSV, XML, YAML, TOML)"
- Analysis: 95% of users only need JSON
- Recommendation: Cut all formats except JSON - YAGNI
