# Migration to claude-flow Repository

## Overview

This document guides you through creating the new `claude-flow` GitHub repository and migrating the code from `claude-config`.

## Why This Migration?

The claude-config repository is being transformed into the claudeflow npm package. To align the repository name with the package name and ensure proper provenance for npm publishing, we're creating a new repository called `claude-flow`.

## Prerequisites

- GitHub account (kennyjpowers)
- Member of @33strategies organization on npm
- Current code in claude-config repository

## Step-by-Step Migration

### Step 1: Create New GitHub Repository

1. Go to https://github.com/new
2. Repository settings:
   - **Owner**: kennyjpowers
   - **Repository name**: `claude-flow`
   - **Description**: Workflow orchestration for Claude Code - end-to-end feature development lifecycle
   - **Visibility**: Public
   - **DO NOT** initialize with README, .gitignore, or license (we'll push existing code)
3. Click "Create repository"

### Step 2: Update Local Git Remote

```bash
# Navigate to project directory
cd /Users/kennethpriester/src/ai_projects/claude-config

# Rename remote from origin to old-origin (backup)
git remote rename origin old-origin

# Add new repository as origin
git remote add origin git@github.com:kennyjpowers/claude-flow.git

# Verify new remote
git remote -v
# Should show:
# origin    git@github.com:kennyjpowers/claude-flow.git (fetch)
# origin    git@github.com:kennyjpowers/claude-flow.git (push)
# old-origin    git@github.com:kennyjpowers/claude-config.git (fetch)
# old-origin    git@github.com:kennyjpowers/claude-config.git (push)
```

### Step 3: Push All Branches to New Repository

```bash
# Push main branch
git checkout main
git push -u origin main

# Push feature branch
git checkout feat/package-publishing-strategy
git push -u origin feat/package-publishing-strategy

# Push all other branches (if any)
git push origin --all

# Push all tags
git push origin --tags
```

### Step 4: Verify Migration

```bash
# Check that all branches are pushed
git branch -r

# Should show branches on both old-origin and origin

# Verify GitHub repository has all content
# Visit: https://github.com/kennyjpowers/claude-flow
```

### Step 5: Update Repository Settings on GitHub

1. Go to https://github.com/kennyjpowers/claude-flow/settings
2. Set default branch to `main` (if not already)
3. Enable features:
   - Issues
   - Discussions (optional)
4. Branch protection rules (recommended):
   - Protect `main` branch
   - Require PR reviews before merging
   - Require status checks to pass

### Step 6: Set Up GitHub Secrets for Publishing

1. Go to https://github.com/kennyjpowers/claude-flow/settings/secrets/actions
2. You'll add NPM_TOKEN here in the next step (Task 74)

### Step 7: Archive Old Repository (Optional)

Once migration is verified:

1. Go to https://github.com:kennyjpowers/claude-config/settings
2. Scroll to "Danger Zone"
3. Click "Archive this repository"
4. Add archive notice: "This repository has been migrated to claude-flow"

**OR** keep it as a separate project if you want to maintain both.

### Step 8: Update Local Folder Name (Optional)

```bash
# Navigate to parent directory
cd /Users/kennethpriester/src/ai_projects

# Rename folder to match new repository
mv claude-config claude-flow

# Navigate back into project
cd claude-flow
```

## Verification Checklist

- [ ] New repository `claude-flow` created on GitHub
- [ ] Git remote updated to point to new repository
- [ ] All branches pushed to new repository
- [ ] All tags pushed to new repository
- [ ] Repository settings configured
- [ ] Ready to proceed with npm publishing (Task 74)

## Next Steps

After completing this migration:

1. Proceed with Task 74: Perform initial token-based publish
2. Configure npm Trusted Publishers (Task 73)
3. Switch to OIDC publishing (Task 75)

## Rollback Plan

If something goes wrong:

```bash
# Revert to old repository
git remote remove origin
git remote rename old-origin origin

# Verify
git remote -v
```

## Notes

- The old-origin remote is kept as a backup
- You can remove old-origin after verifying everything works:
  ```bash
  git remote remove old-origin
  ```
- All commit history is preserved in the migration
- GitHub repository provenance will link to the new claude-flow repository
