# Feedback: v2.0.0 Major Release Preparation

**Spec:** doc/specs/v2-major-release-prep/02-specification.md
**Created:** 2026-01-08

## Pending

## Resolved

### FB-3: Update GitHub workflow to use Node 20
**Added:** 2026-01-08
**Resolved:** 2026-01-08
**Outcome:** implement
**Decision:** Approved for implementation

Since we lowered the node requirement to 20+ we should be testing against node 20.X and using node 20 for releases in .github/workflows/release.yml

### FB-1: Replace ideate/ideate-to-spec with brainstorm:* commands in docs
**Added:** 2026-01-08
**Resolved:** 2026-01-08
**Outcome:** implement
**Decision:** Approved for implementation

Documentation references outdated commands:
- `ideate` and `ideate-to-spec` commands no longer exist
- Replaced by `brainstorm:start`, `brainstorm:clarify`, and `brainstorm:spec`
- All mentions of `01-ideation.md` filename should be `01-brainstorm.md`
- Need to read new brainstorm:* commands to understand what each does
- Replace descriptions of old commands with descriptions of new brainstorm:* commands throughout all docs

### FB-2: Replace spec:feedback with feedback:* commands in docs
**Added:** 2026-01-08
**Resolved:** 2026-01-08
**Outcome:** implement
**Decision:** Approved for implementation

Documentation references outdated command:
- `spec:feedback` command no longer exists
- Replaced by `feedback:add` and `feedback:resolve`
- Need to read new feedback:* commands to understand what each does
- Replace descriptions of legacy spec:feedback command with descriptions of new feedback:* commands throughout all docs

