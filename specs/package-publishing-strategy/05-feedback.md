# Post-Implementation Feedback Log: package-publishing-strategy

**Feature:** Transform claude-config into npm Package "claudeflow"
**Specification:** specs/package-publishing-strategy/02-specification.md
**Created:** 2025-11-21

---

## Feedback Entry #1

**Date:** 2025-11-21
**Session:** Post-Implementation (Session 2)
**Source:** User feedback via `/spec:feedback` command

### Feedback Content
"npmjs recommends using this trusted-publishers feature for deploying from github actions https://docs.npmjs.com/trusted-publishers"

### Category
Security/Best Practices

### Exploration Summary

**Current Implementation:**
- Uses NPM_TOKEN (static long-lived credential) stored in GitHub Secrets
- Configured in `.github/workflows/release.yml` environment variables
- Standard semantic-release publishing pattern

**Proposed Alternative:**
- npm Trusted Publishers (OIDC-based authentication)
- No NPM_TOKEN storage - short-lived tokens generated per-workflow run
- Automatic cryptographic provenance attestations (SLSA Level 2)
- Aligns with npm security roadmap (classic tokens being deprecated)

**Code Exploration Results:**
- Files affected: `.github/workflows/release.yml`, npm account configuration
- Blast radius: ~50-100 line changes across 4 files
- Implementation requirements:
  - Add `id-token: write` permission to workflow
  - Remove NPM_TOKEN from environment variables
  - Update npm CLI to 11.5.1+ (required for OIDC)
  - Configure trusted publishers on npmjs.com

**Research Conducted:**
- Comprehensive research via research-expert agent
- Research report: `/tmp/research_20251121_npm_trusted_publishers_semantic_release.md`
- Key findings:
  - Production-ready, fully compatible with semantic-release
  - Package must exist before OIDC configuration (workflow order requirement)
  - Recommended approach: Initial token publish → switch to OIDC
  - No changes to semantic-release configuration needed (auto-detects OIDC)

### Decision
**Implement Now**

**Rationale:**
1. **Timing Advantage**: Package not yet published - easier to implement before first release than retrofit later
2. **Security Benefits**: Eliminates long-lived token storage, automatic provenance, SLSA Level 2 compliance
3. **Future-Proofing**: npm phasing out classic tokens (revocation scheduled Dec 9, 2025)
4. **Low Effort**: ~30-60 minutes implementation time, minimal blast radius
5. **Research Validation**: Comprehensive research confirms production-readiness and compatibility

### Actions Taken

**Specification Updates:**
1. Updated `specs/package-publishing-strategy/02-specification.md`:
   - Security Considerations section: Added OIDC publishing details
   - Changelog section: Documented decision and implementation plan
   - Lines affected: 1272-1280 (Security), 1781-1789 (Changelog)

2. Updated `specs/package-publishing-strategy/03-tasks.md`:
   - Incremental decompose (Session 2)
   - Preserved 15 completed tasks
   - Updated Task 1.12 (workflow) with OIDC context
   - Updated Task 1.16 (publishing) with two-phase approach
   - Created 4 new tasks: 1.17-1.20

**Task Breakdown Updates:**

**Preserved Tasks (✅ DONE):**
- Tasks 1.1-1.11, 1.13-1.15: No changes, completed in Session 1

**Updated Tasks (🔄 UPDATED):**
- Task 1.12: Create .github/workflows/release.yml
  - Added OIDC implementation details
  - Updated workflow YAML with id-token: write permission
  - Removed NPM_TOKEN from environment
  - Added npm update step for OIDC support
- Task 1.16: Publish to npm with provenance
  - Updated with two-phase publishing strategy
  - Phase 1: Initial token-based publish (Task 1.18)
  - Phase 2: Switch to OIDC (Task 1.19)

**New Tasks Created (⏳ NEW):**
- Task 1.17: Configure npm account for trusted publishers
  - Priority: High
  - Must be done AFTER Task 1.18 (package must exist)
  - npm web UI configuration with exact field values
  - STM Task ID: 73
- Task 1.18: Perform initial token-based publish
  - Priority: Critical
  - Create 7-day granular access token
  - Temporary workflow on feat/initial-publish branch
  - Security cleanup after publish
  - STM Task ID: 74
- Task 1.19: Switch to OIDC publishing
  - Priority: High
  - Merge OIDC workflow to main
  - Verify OIDC authentication in workflow logs
  - Enable provenance for all future publishes
  - STM Task ID: 75
- Task 1.20: Verify OIDC provenance attestation
  - Priority: Medium
  - Confirm provenance badge on npm
  - Validate SLSA-compliant attestations
  - Update README.md with provenance information
  - STM Task ID: 76

**STM Task Management:**
- Created 4 new STM tasks (IDs: 73, 74, 75, 76)
- All tagged with `feature:package-publishing-strategy,incremental,phase1,oidc`
- Dependencies properly configured (74→73→75→76)
- Tasks include full implementation details (not summaries)

### Implementation Strategy

**Two-Phase Publishing Approach (Option A):**

**Phase 1: Initial Token Publish (Task 1.18)**
- Purpose: Create package on npm (required for OIDC config)
- Method: Temporary 7-day granular access token
- Branch: feat/initial-publish (temporary)
- Workflow: .github/workflows/release-token.yml (temporary)
- Cleanup: Delete token, workflow, branch after success

**Phase 2: OIDC Migration (Tasks 1.17, 1.19, 1.20)**
- Configure trusted publishers on npmjs.com (Task 1.17)
- Merge OIDC workflow to main (Task 1.19)
- Verify provenance attestations (Task 1.20)
- All future publishes use OIDC (no tokens)

**Critical Implementation Order:**
1. Task 1.12: Update workflow file (OIDC-ready, not yet active)
2. Task 1.18: Initial token publish (creates package)
3. Task 1.17: Configure npm OIDC (requires package to exist)
4. Task 1.19: Merge OIDC workflow (activates OIDC)
5. Task 1.20: Verify provenance (confirms working)

### Security Benefits

- **No Token Storage**: NPM_TOKEN removed from GitHub Secrets
- **Short-Lived Credentials**: OIDC tokens expire in minutes, not 90 days
- **Automatic Provenance**: Cryptographic proof linking package to source/workflow/commit
- **SLSA Level 2 Compliance**: Supply chain security framework adherence
- **Token Rotation**: Automatic per-workflow run, no manual management
- **Audit Trail**: Each publish cryptographically linked to exact workflow run

### Next Steps

1. Resume `/spec:execute specs/package-publishing-strategy/02-specification.md`
   - Will load updated task breakdown (22 tasks total)
   - Will show 15 completed, 2 updated, 4 new, 1 pending
   - Will start with Task 1.18 (first new task)
2. Implementation will follow critical order (1.18 → 1.17 → 1.19 → 1.20)
3. After Task 1.20 complete, proceed with Task 1.21 (verify installation)
4. Final task: 1.22 (notify ClaudeKit maintainer)

### Documentation References

- **Research Report**: `/tmp/research_20251121_npm_trusted_publishers_semantic_release.md`
- **npm Trusted Publishers Docs**: https://docs.npmjs.com/trusted-publishers/
- **npm Provenance Docs**: https://docs.npmjs.com/generating-provenance-statements/
- **GitHub OIDC Docs**: https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect
- **semantic-release GitHub Actions**: https://semantic-release.gitbook.io/semantic-release/recipes/ci-configurations/github-actions

### Lessons Learned

1. **Timing Matters**: Implementing security features before first publish is significantly easier than retrofitting
2. **Workflow Order**: npm's requirement for package existence before OIDC config drove the two-phase approach
3. **Research Value**: Comprehensive research (14 sources) provided confidence in production-readiness
4. **Incremental Decompose**: Preserved completed work while adding new tasks - no wasted effort
5. **Security-First**: Modern security practices (OIDC) should be default, not afterthought

---

## Feedback Entry #2

**Date:** 2025-11-21
**Status:** Accepted - Implementation in progress
**Type:** Bug/Error
**Priority:** High

### Description

ClaudeKit setup fails for global mode with error: `error: unknown option '--global'`

**Context from console logs:**
```
ℹ Running ClaudeKit setup...
error: unknown option '--global'
✗ ClaudeKit setup failed (non-fatal)
ℹ You may need to run "claudekit setup" manually
```

### Code Exploration Findings

**Root Cause Analysis:**
- File: `lib/setup.js`, line 257
- Current code: `const setupCommand = mode === 'global' ? 'claudekit setup --global' : 'claudekit setup';`
- Issue: ClaudeKit does NOT support a `--global` flag
- Correct flag: `--user` (installs to ~/.claude/ directory)

**ClaudeKit Supported Flags (from help output):**
- `--user` - Install in user directory (~/.claude) instead of project
- `--project <path>` - Target directory for project installation
- `--yes` - Automatic yes to prompts (non-interactive mode)
- NO `--global` flag exists

**Blast Radius:**
- LOW - Single function affected: `runClaudeKitSetup()` in lib/setup.js (lines 252-266)
- Error is caught and marked as "non-fatal"
- ALL global mode installations fail ClaudeKit setup (but continue)
- No downstream dependencies

**Affected Files:**
- `lib/setup.js:257` (implementation - uses wrong flag)
- `specs/package-publishing-strategy/02-specification.md:620` (spec documentation - shows wrong flag)

### Research Findings

Research skipped by user

### Decisions

- **Action:** Implement now
- **Scope:** Minimal
- **Approach:** Add non-interactive mode
- **Priority:** High

**Selected Approach:**
Change `--global` to `--user` and add `--yes` flag for both modes to prevent prompts during setup.

**Fix:**
```javascript
// Before (WRONG):
const setupCommand = mode === 'global' ? 'claudekit setup --global' : 'claudekit setup';

// After (CORRECT):
const setupCommand = mode === 'global' ? 'claudekit setup --user --yes' : 'claudekit setup --yes';
```

### Actions Taken

**Specification Updates:**
1. Updated `specs/package-publishing-strategy/02-specification.md`:
   - Added changelog entry documenting this feedback
   - Section "2025-11-21 - Post-Implementation Feedback" (new entry after OIDC feedback)
   - Documented change needed in lib/setup.js:257
   - Lines 1796-1821

**Implementation Changes Required:**
- File: `lib/setup.js`
- Line: 257
- Change: Replace `--global` with `--user --yes` for global mode
- Change: Add `--yes` flag for project mode
- Impact: One-line fix, non-interactive setup for both modes

### Rationale

This feedback was addressed through the /spec:feedback workflow:
1. Code exploration identified the incorrect flag usage and correct replacement
2. Research was skipped (issue was straightforward with clear solution)
3. Interactive decision process resulted in: Implement now with minimal scope
4. Specification updated with changelog entry documenting the change
5. Next steps: Run `/spec:decompose` to create tasks, then `/spec:execute` to implement

**Why High Priority:**
- Affects ALL global mode installations
- Creates confusing error message for users
- Simple one-line fix with low risk
- Improves user experience by making setup non-interactive

### Security & Performance Impact

**Security:** No security implications (both flags achieve the same result)
**Performance:** `--yes` flag eliminates interactive prompts, slightly faster setup
**Compatibility:** Both `--user` and `--yes` are supported in ClaudeKit v0.9.0+

### Next Steps

1. Review the changelog entry in the spec
2. Update the affected specification section (lib/setup.js code block at line 620)
3. Run: `/spec:decompose specs/package-publishing-strategy/02-specification.md`
4. Run: `/spec:execute specs/package-publishing-strategy/02-specification.md`

---

## Summary Statistics

**Feedback Items Processed:** 2
**Decisions:**
- Implement Now: 2
- Defer: 0
- Out of Scope: 0

**Implementation Impact:**
- Specification sections updated: 2
- Task breakdown sessions: 2 (Full + Incremental)
- Tasks preserved: 15 (completed)
- Tasks updated: 2 (affected by feedback)
- Tasks created: 4 (new work)
- Total tasks: 22
- STM tasks created: 4 (IDs: 73-76)
- Estimated implementation time: 30-60 minutes
- Security improvement: High (eliminates long-lived tokens)

**Files Modified:**
- specs/package-publishing-strategy/02-specification.md (changelog + security section)
- specs/package-publishing-strategy/03-tasks.md (incremental decompose)
- specs/package-publishing-strategy/05-feedback.md (this file)

---

*End of Feedback Log*
