# Transform claude-config into npm Package

**Slug:** package-publishing-strategy
**Author:** Claude Code
**Date:** 2025-11-21
**Branch:** feat/add-feedback-workflow-command
**Related:** README.md, install.sh, CHANGELOG.md

---

## 1) Intent & Assumptions

**Task brief:** Investigate what it would take to turn this project into a legitimate npm package and identify a compelling name that could achieve claudekit-level popularity.

**Assumptions:**
- Goal is to publish to npm registry as a globally installable CLI tool
- Package should maintain current functionality (workflow orchestration system)
- Target audience is developers using Claude Code for AI-assisted development
- Success metric is achieving adoption comparable to claudekit
- Current structure (bash-based install.sh) needs to evolve to npm-based distribution
- Existing .claude/ directory structure and commands should be preserved

**Out of scope:**
- Rewriting core functionality or commands
- Changing the fundamental architecture (3-layer: Claude Code → ClaudeKit → this package)
- Removing ClaudeKit dependency
- Supporting package managers other than npm/yarn/pnpm (they share npm registry)
- Python/pip distribution (wrong audience, unnecessary complexity)
- Enterprise/private package distribution

---

## 2) Pre-reading Log

### Repository Documentation
- `README.md`: Comprehensive overview of hybrid configuration system, v1.2.0 features, three-layer architecture, installation patterns
  - **Takeaway:** Project is mature (v1.2.0) with complete workflow lifecycle, depends on ClaudeKit, uses bash installer currently

- `CHANGELOG.md`: Version history from v1.0.0 to v1.2.0
  - **Takeaway:** Recent additions include feedback workflow (v1.2.0), feature-based directories (v1.1.0), shows active development

- `docs/DESIGN_RATIONALE.md`: Comprehensive design decisions, ADRs, research validation
  - **Takeaway:** Well-documented rationale for architectural choices, testing philosophy, content preservation patterns

- `install.sh`: Current installation script (262 lines)
  - **Takeaway:** Handles both user-level (~/.claude) and project-level (.claude/) installation, copies files manually, integrates with ClaudeKit setup

### Codebase Structure
- `.claude/commands/`: 8 custom markdown command files (ideate.md, ideate-to-spec.md, spec/*.md)
- `templates/`: Project and user configuration templates
- `docs/`: Comprehensive documentation including guides and API specs
- **No package.json currently exists** - project is not yet an npm package
- **No bin/ directory** - no CLI executable
- **No dist/ or build output** - commands are markdown files executed by Claude Code

### Related Tools Analysis
- **ClaudeKit**: npm package providing 30+ agents, 20+ commands, 25+ hooks
  - **Takeaway:** Uses standard npm distribution, automatically supports npm/yarn/pnpm via single npm registry publish
- **simple-task-master (stm)**: Optional npm package for task tracking
- **Claude Code**: Official CLI that loads custom commands

### ClaudeKit Distribution Analysis (Perfect Example)
- **Repository**: https://github.com/carlrannaberg/claudekit
- **Distribution**: Published to npm registry only
- **Package managers supported**: npm, yarn, pnpm (all three explicitly documented)
- **How it works**: Single publish to npm registry = automatic support for all three PMs
- **Installation**:
  - `npm install -g claudekit`
  - `yarn global add claudekit`
  - `pnpm add -g claudekit`
- **Key insight**: No special configuration needed - standard package.json works for all three
- **Technical details**:
  - Two bin commands: `claudekit` and `claudekit-hooks`
  - Node.js 20+ required
  - Uses esbuild for compilation to CommonJS
  - Dependencies managed through standard package.json
  - Uses `prepublishOnly` hook for build automation

---

## 3) Codebase Map

### Primary Components
- **`.claude/commands/`** - Core workflow commands (markdown format)
  - `ideate.md` - Structured ideation workflow
  - `ideate-to-spec.md` - Transform ideation to specification
  - `spec/create.md` - Enhanced spec creation (overrides ClaudeKit)
  - `spec/decompose.md` - Incremental task breakdown (overrides ClaudeKit)
  - `spec/execute.md` - Session resume implementation (overrides ClaudeKit)
  - `spec/feedback.md` - Post-implementation feedback processing
  - `spec/doc-update.md` - Documentation review
  - `spec/migrate.md` - Migration to feature-based structure

- **`templates/`** - Configuration templates
  - `project-config/` - Team-level settings, CLAUDE.md, .gitignore examples
  - `user-config/` - Personal global settings

- **`docs/`** - Documentation
  - `DESIGN_RATIONALE.md` - Architecture decisions, research validation
  - `guides/feedback-workflow-guide.md` - Complete feedback workflow guide
  - `api/feedback-workflow.md` - API specifications
  - `INSTALLATION_GUIDE.md`, `SETUP_GUIDE.md`

- **`install.sh`** - Bash installation script (current distribution method)

### Shared Dependencies
- **ClaudeKit (npm)** - Required dependency, provides base agents/commands/hooks
- **simple-task-master (optional)** - Task tracking integration
- **Claude Code CLI** - Runtime environment for commands

### Data Flow
1. User runs `install.sh` → Copies .claude/ files → Runs ClaudeKit setup
2. Claude Code loads commands from `.claude/commands/`
3. Commands execute in Claude context, spawn agents, manage specs/

### Feature Flags/Config
- No explicit feature flags
- Configuration via settings.json (5-tier hierarchy)
- Commands are markdown files interpreted by Claude Code

### Potential Blast Radius
**High Impact Areas:**
- Installation mechanism (bash → npm)
- Distribution of .claude/ files and templates
- ClaudeKit integration approach
- Documentation paths and references

**Medium Impact:**
- Version management (currently manual)
- Update notifications
- Migration from current install.sh to npm

**Low Impact:**
- Command markdown syntax (stays same)
- Spec file formats
- STM integration

---

## 4) Root Cause Analysis

**N/A** - This is a feature request (packaging for npm), not a bug fix.

---

## 5) Research Findings

### Research Conducted
Two comprehensive research sessions performed by research-expert agent:

**Session 1: npm CLI Naming & Packaging**
1. npm package naming strategies and rules
2. CLI tool packaging requirements (package.json, bin, shebang)
3. Cross-platform compatibility patterns
4. Publishing workflows (semantic-release, changesets)
5. Version management and prerelease channels
6. Package name suggestions

Full research saved to: `/tmp/research_20251121_npm_cli_naming_packaging.md`

**Session 2: Package Manager Interoperability** (ClaudeKit-informed)
1. How npm registry automatically supports yarn and pnpm
2. Why publishing to npm = automatic multi-PM support
3. Best practices for cross-PM compatibility
4. Phantom dependencies and strict resolution (pnpm)
5. Python/pip distribution necessity analysis
6. Real-world examples and patterns

Full research saved to: `/tmp/research_20251121_npm_package_manager_interop.md`

### Key Research Insights

#### 1. Naming Strategy Analysis

**Successful CLI Tool Patterns:**
- **Ultra-short (3-5 chars)**: git, npm, bun, vite (fast to type, maximum memorability)
- **Compound words (6-9 chars)**: webpack, ripgrep, claudekit, tailwind (self-documenting, modern)
- **Action verbs (6-8 chars)**: prettier, composer (benefit-focused)

**Trending 2024-2025:**
- Single-word compound names preferred over hyphens
- Speed/performance in name correlates with adoption
- Developer tools emphasize efficiency and simplicity

**Recommendation Matrix (Top 5):**

| Name | Memorability | Clarity | Availability | Brand | Total |
|------|--------------|---------|--------------|-------|-------|
| **claudeflow** | 5/5 | 5/5 | 5/5 | 5/5 | **20/20** ⭐ |
| orkestra | 5/5 | 4/5 | 5/5 | 5/5 | 19/20 |
| clauderun | 4/5 | 5/5 | 5/5 | 4/5 | 18/20 |
| strm | 5/5 | 3/5 | 5/5 | 5/5 | 18/20 |
| tempo | 5/5 | 4/5 | 4/5 | 5/5 | 18/20 |

**Why "claudeflow" is optimal:**
- ✅ Sits perfectly alongside "claudekit" in ecosystem
- ✅ "flow" suggests workflow/orchestration immediately
- ✅ Modern compound word pattern (no hyphen)
- ✅ Likely available on npm and claudeflow.dev
- ✅ Professional yet approachable
- ✅ Easy to pronounce globally

**Alternative if unavailable:** orkestra (unique, memorable orchestration theme)

#### 2. Multi-Package Manager Support (NEW - ClaudeKit Analysis)

**Critical Discovery:** Publishing to npm registry **automatically supports all three package managers** (npm, yarn, pnpm) with ZERO additional configuration.

**How It Works:**
- All three package managers consume packages from the **same npm registry** (npmjs.com)
- All three use the **same package.json format**
- Publishing once = works with all three automatically
- ClaudeKit demonstrates this perfectly in their documentation

**Evidence from ClaudeKit:**
```bash
# All three work identically after single npm publish:
npm install -g claudekit
yarn global add claudekit
pnpm add -g claudekit
```

**What Package Authors Must Do:**
1. ✅ **Declare ALL dependencies explicitly** - Critical for pnpm (strictest PM)
2. ✅ **Never hardcode node_modules paths** - Different PMs use different structures
3. ✅ **Don't reference .bin folder directly** - Use package names in scripts
4. ✅ **Test with pnpm** - Catches phantom dependencies npm/yarn might hide
5. ✅ **Use standard package.json features** - Avoid PM-specific extensions

**What Happens Automatically:**
- Global CLI installation works identically across all three PMs
- `bin` field creates executables automatically
- Dependencies resolve from npm registry
- Lock files (package-lock.json, yarn.lock, pnpm-lock.yaml) are consumer concern

**Python/pip Decision:**
**Verdict: NOT NEEDED** - Skip pip/PyPI distribution entirely

**Rationale:**
- ❌ Wrong target audience (JS devs already have Node.js/npm)
- ❌ Massive complexity (must bundle Node.js binaries for each platform)
- ❌ Maintenance burden (two distribution channels to sync)
- ❌ No successful precedent (Prettier, ESLint, Webpack, TypeScript all use npm only)
- ✅ ClaudeKit pattern validates npm-only approach

**Successful JavaScript CLI Tools (npm ONLY):**
- Prettier (139,888 weekly downloads)
- create-react-app
- Vue CLI
- Angular CLI
- ESLint
- Webpack
- TypeScript

None distribute via pip, yet wildly successful.

#### 3. Package Requirements for CLI Tools

**Critical package.json Fields:**
```json
{
  "name": "claudeflow",
  "version": "0.1.0",
  "description": "Workflow orchestration for Claude Code",
  "keywords": ["claude", "workflow", "cli", "orchestration"],
  "author": { "name": "...", "email": "..." },
  "license": "MIT",
  "repository": { "type": "git", "url": "..." },
  "bin": { "claudeflow": "./bin/cli.js" },
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["bin", "dist", ".claude", "templates"],
  "engines": { "node": ">=18.0.0" }
}
```

**Bin Configuration Requirements:**
1. **Shebang** - Must be first line: `#!/usr/bin/env node`
2. **Executable permissions** - `chmod +x bin/cli.js`
3. **Cross-platform** - npm creates .cmd wrapper on Windows automatically

**Files Field Best Practice:**
- Use whitelist approach (not .npmignore blacklist)
- Include only necessary files
- Reduces bundle size significantly (typical 83% reduction possible)

#### 4. Distribution Strategy (ClaudeKit-Informed)

**Current Approach (install.sh):**
- Manual file copying
- Bash-based
- Requires user to run script
- Two modes: user (~/.claude) and project (.claude/)

**Proposed npm Approach (Following ClaudeKit Pattern):**
```bash
# Global install (replaces install.sh user mode)
# Works with npm, yarn, OR pnpm - user's choice!
npm install -g claudeflow
yarn global add claudeflow
pnpm add -g claudeflow

# Project install (replaces install.sh project mode)
cd my-project
npx claudeflow init  # or: yarn dlx claudeflow init, pnpm dlx claudeflow init
```

**Benefits of npm Distribution:**
- ✅ **Multi-PM support automatically** - Single publish supports npm/yarn/pnpm
- ✅ **Standard installation method** - Familiar to all Node developers
- ✅ **Automatic updates** - `npm update -g claudeflow` (or yarn/pnpm equivalent)
- ✅ **Version management built-in** - Semantic versioning
- ✅ **Cross-platform automatically** - Works on Windows/macOS/Linux
- ✅ **ClaudeKit proven pattern** - Same approach as our dependency
- ✅ **Backward compatibility possible** - Maintain install.sh during transition

**ClaudeKit Lessons Applied:**
- Use `bin` field for CLI executables (automatic cross-PM support)
- Require Node.js >=18.0.0 (modern, stable LTS)
- Use build tooling (esbuild or similar) for optimization
- Include `prepublishOnly` hook to ensure clean builds
- Document all three package managers explicitly in README

#### 5. CI/CD & Publishing Workflow

**Recommended: semantic-release**
- Fully automated releases from commit messages
- Analyzes conventional commits (`feat:`, `fix:`, `BREAKING CHANGE:`)
- Generates CHANGELOG.md automatically
- Creates GitHub releases
- Publishes to npm with provenance

**Setup Requirements:**
1. GitHub Actions workflow
2. NPM_TOKEN in repository secrets
3. `.releaserc.json` configuration
4. Conventional commit messages

**Version Bumping:**
- `fix:` → patch (1.0.0 → 1.0.1)
- `feat:` → minor (1.0.0 → 1.1.0)
- `BREAKING CHANGE:` → major (1.0.0 → 2.0.0)

#### 6. Architecture Considerations

**Challenge:** Current project is NOT executable code - it's markdown commands
- Commands are `.md` files executed by Claude Code
- No JavaScript/TypeScript code to compile
- No traditional CLI executable

**Proposed Solution: Hybrid Approach**

**Option A: Pure Installer Package**
```bash
npm install -g claudeflow
claudeflow setup          # Installs .claude/ files
claudeflow setup --user   # Global install
claudeflow setup --project # Project install
```

Package would:
- Replace install.sh with Node.js installer
- Copy .claude/ files to appropriate locations
- Integrate with ClaudeKit setup
- Provide update commands

**Option B: Installer + Wrapper Commands**
```bash
npm install -g claudeflow
claudeflow ideate "task brief"        # Wrapper that calls Claude Code
claudeflow spec:create "description"
```

Package would:
- Provide command-line interface
- Internally invoke Claude Code CLI with custom commands
- More seamless UX but higher complexity

**Option C: Distribution Package Only**
```json
{
  "name": "claudeflow",
  "files": [".claude/**", "templates/**"],
  "postinstall": "node scripts/setup.js"
}
```

Package would:
- Distribute .claude/ and templates/ as data files
- Run setup script on postinstall
- Minimal wrapper, mainly for distribution

#### 7. Potential Solutions Comparison

| Approach | Pros | Cons | Complexity |
|----------|------|------|------------|
| **Option A: Pure Installer** | Clean separation, easy to maintain | User still types claude commands | Low |
| **Option B: Wrapper Commands** | Better UX, single entry point | Complex integration with Claude | High |
| **Option C: Data Package** | Simplest implementation | Limited functionality | Very Low |

**Recommended: Option A (Pure Installer)**
- Maintains current architecture (commands in .claude/)
- npm provides distribution and versioning
- Setup command replaces install.sh
- Users still use Claude Code CLI with custom commands
- Clean separation of concerns
- Easiest to implement and maintain

---

## 6) Clarifications

### Name Selection
**Question 1:** Is "claudeflow" acceptable as the package name?
- **Option A:** claudeflow (top recommendation - 20/20 score)
- **Option B:** orkestra (alternative if claudeflow unavailable)
- **Option C:** clauderun (more action-oriented)
- **Option D:** Other (user preference)

**Context:** Research shows "claudeflow" scores highest for ecosystem fit, memorability, clarity, and likely availability. However, need to verify npm availability and user preference.

### Packaging Architecture
**Question 2:** Which packaging approach should we implement?
- **Option A:** Pure Installer - npm package that replaces install.sh, copies files, minimal wrapper (recommended)
- **Option B:** Wrapper Commands - Full CLI that wraps Claude Code commands for seamless UX
- **Option C:** Data Package Only - Simple npm package with postinstall script
- **Option D:** Hybrid - Start with Option A, evolve to Option B over time

**Context:** Option A is simplest and maintains current architecture. Option B provides better UX but significantly more complex.

### Multi-Package Manager Support
**Question 3:** How should we document multi-PM support in README?
- **Option A:** Show all three installation methods explicitly (like ClaudeKit) - recommended
- **Option B:** Show npm only, mention yarn/pnpm work in footnote
- **Option C:** Show npm primarily, link to separate "Installation" doc for alternatives

**Context:** ClaudeKit explicitly documents all three package managers in their README, which signals broad compatibility and user choice. Research shows this is automatic - just needs documentation.

### Distribution Strategy
**Question 4:** Should we maintain install.sh during transition?
- **Option A:** Keep both - install.sh for legacy, npm for new users (recommended for transition period)
- **Option B:** Remove install.sh - npm only (cleaner but breaks existing workflows)
- **Option C:** Deprecate install.sh with warning - both work for 6 months, then remove

**Context:** Many users may have existing install.sh-based setups. Transition period reduces disruption.

### ClaudeKit Dependency
**Question 5:** How should ClaudeKit be declared?
- **Option A:** peerDependency (user installs ClaudeKit separately)
- **Option B:** dependency (claudeflow installs ClaudeKit automatically) - recommended
- **Option C:** optionalDependency (claudeflow works without ClaudeKit, with reduced features)

**Context:** Current architecture requires ClaudeKit for agents/commands. Option B ensures it's always available.

### Version Strategy
**Question 6:** What should initial npm version be?
- **Option A:** 1.0.0 (current version is 1.2.0, could match) - recommended
- **Option B:** 0.1.0 (start conservatively, signal it's new to npm)
- **Option C:** 1.2.0 (match exact current version)

**Context:** While project is mature (v1.2.0), npm packaging is new. Option A signals stability while acknowledging repackaging.

### Scope Decision
**Question 7:** Should package be scoped or unscoped?
- **Option A:** Unscoped - `claudeflow` (better discoverability, easier to type) - recommended
- **Option B:** Scoped - `@kennethpriester/claudeflow` or `@claudeflow/core` (namespace protection)

**Context:** Research shows unscoped packages get better adoption for CLI tools. Only use scoped if name unavailable or organization preference.

### Cross-PM Testing Strategy
**Question 8:** Should we test with all three package managers in CI/CD?
- **Option A:** Test with all three (npm, yarn, pnpm) in GitHub Actions matrix - recommended
- **Option B:** Test with pnpm only (strictest, catches most issues)
- **Option C:** Test with npm only (simplest, fastest CI)

**Context:** Research shows pnpm catches phantom dependencies that npm/yarn hide. Testing all three validates ClaudeKit-style multi-PM compatibility claims.

### Feature Flags
**Question 9:** Should we add update notifications?
- **Option A:** Yes - notify users of new versions (using update-notifier package)
- **Option B:** No - users check manually with `npm outdated`

**Context:** Popular CLI tools provide update notifications. Improves adoption of new features.

### Documentation
**Question 10:** Should we create a dedicated website (claudeflow.dev)?
- **Option A:** Yes - purchase domain, create documentation site (increases professional appearance)
- **Option B:** No - GitHub README sufficient initially (lower barrier)
- **Option C:** Later - launch to npm first, add website after validation

**Context:** Domain costs $12-20/year for .dev. Website helps marketing but not required for MVP.

### Platform Testing Strategy
**Question 11:** What testing approach for installer functionality?
- **Option A:** Comprehensive - test on Windows/macOS/Linux in CI/CD (recommended)
- **Option B:** Manual - test manually before releases (faster to implement)
- **Option C:** Minimal - test on one platform, rely on users for issues

**Context:** Cross-platform compatibility is critical for npm packages. ClaudeKit supports all platforms. Option A prevents issues.

### Migration Path
**Question 12:** Should we provide migration command for existing users?
- **Option A:** Yes - `claudeflow migrate` detects install.sh installation and converts (recommended)
- **Option B:** No - users uninstall/reinstall manually
- **Option C:** Documentation only - step-by-step migration guide

**Context:** Existing users have ~/.claude or .claude/ from install.sh. Migration command reduces friction.

---

## 7) Recommended Implementation Plan

Based on research and codebase analysis, here's a phased approach:

### Phase 1: MVP (Pure Installer Package)
**Goal:** Replace install.sh with npm package

**Deliverables:**
1. Create `package.json` with recommended fields
2. Implement `bin/cli.js` with setup command
3. Port install.sh logic to Node.js
4. Add cross-platform compatibility
5. Set up GitHub Actions CI/CD
6. Configure semantic-release
7. Write comprehensive README
8. Publish 1.0.0 to npm

**Estimated Effort:** 2-3 days

### Phase 2: Enhanced Distribution
**Goal:** Improve UX and add features

**Deliverables:**
1. Add update notifications
2. Implement migration command
3. Add `claudeflow doctor` (diagnostic command)
4. Create CONTRIBUTING.md
5. Set up test suite (cross-platform)
6. Purchase claudeflow.dev domain
7. Submit to awesome-claude-code list

**Estimated Effort:** 1-2 weeks

### Phase 3: Marketing & Adoption
**Goal:** Drive adoption to claudekit levels

**Deliverables:**
1. Launch blog post on DEV.to
2. Submit to Product Hunt
3. Create demo video
4. Present at meetups/conferences
5. Write integration guides
6. Build documentation website
7. Active community engagement

**Estimated Effort:** Ongoing

---

## 8) Success Metrics

**Adoption Indicators:**
- 100 GitHub stars (1 month target)
- 1K npm downloads/week (3 months)
- 500 GitHub stars (6 months)
- 10K npm downloads/week (1 year)
- Featured in awesome-claude-code (immediate)

**Quality Indicators:**
- 80%+ test coverage
- Zero critical npm audit vulnerabilities
- <24 hour issue response time
- Cross-platform CI/CD passing
- Provenance enabled

**Community Health:**
- Active discussions on GitHub
- Regular contributors (5+ in first 6 months)
- Positive sentiment in community channels
- Integration by other tools/projects

---

## 9) Open Questions

1. **Package name verification:** Need to actually check `npm view claudeflow` to confirm availability
2. **Domain registration:** Check claudeflow.dev availability and pricing
3. **Author/maintainer:** Who should be listed as package author?
4. **License confirmation:** Current project appears to be MIT but needs explicit LICENSE file
5. **GitHub org:** Should package be under personal account or organization?
6. **Breaking changes:** How to handle breaking changes in future (semver major bumps)?
7. **Support policy:** What versions will be supported? LTS strategy?
8. **Trademark search:** Is "claudeflow" trademarked anywhere?
9. **Anthropic permission:** Should we get blessing from Anthropic/Claude team for using "claude" prefix?
10. **ClaudeKit coordination:** Should we coordinate launch with ClaudeKit maintainer?

---

## 10) Key Takeaways (ClaudeKit-Informed)

### Critical Insights from ClaudeKit Analysis

1. **Multi-PM Support is Automatic** - Publishing to npm registry = automatic support for npm, yarn, and pnpm with ZERO additional configuration

2. **Python/pip is Unnecessary** - Skip pip/PyPI entirely. Wrong audience, massive complexity, no successful precedent for JS tools

3. **Documentation Matters** - ClaudeKit explicitly shows all three installation methods in README to signal user choice and broad compatibility

4. **Standard Best Practices = Compatibility** - Follow npm package best practices (explicit dependencies, no hardcoded paths) and all three PMs work automatically

5. **Test with pnpm** - Strictest package manager, catches phantom dependencies that npm/yarn hide

6. **ClaudeKit Pattern is Proven** - Same 3-layer architecture (Claude Code → ClaudeKit → custom commands), successful distribution model to emulate

### Recommendations Updated Based on Research

**Do:**
- ✅ Publish to npm registry only (automatic multi-PM support)
- ✅ Document all three PMs explicitly (npm, yarn, pnpm) like ClaudeKit
- ✅ Declare all dependencies explicitly (critical for pnpm compatibility)
- ✅ Use standard package.json `bin` field for CLI executables
- ✅ Test with pnpm in CI/CD to catch phantom dependencies
- ✅ Follow ClaudeKit's proven pattern (bin commands, Node >=18, build tooling)

**Don't:**
- ❌ Support pip/PyPI (wrong audience, unnecessary complexity)
- ❌ Hardcode node_modules paths (breaks pnpm symlink structure)
- ❌ Use PM-specific features (stick to standard package.json)
- ❌ Assume npm hoisting (pnpm uses strict dependency resolution)

---

## 11) References

**Research Documents:**
- Session 1 (Naming & Packaging): `/tmp/research_20251121_npm_cli_naming_packaging.md`
- Session 2 (Multi-PM Interop): `/tmp/research_20251121_npm_package_manager_interop.md`

**Official Documentation:**
- npm official docs: https://docs.npmjs.com/
- Yarn Rulebook: https://yarnpkg.com/advanced/rulebook
- pnpm package.json: https://pnpm.io/package_json
- Rush.js Phantom Dependencies: https://rushjs.io/pages/advanced/phantom_deps/

**Tools & Resources:**
- ClaudeKit: https://github.com/carlrannaberg/claudekit
- ClaudeKit Docs: https://docs.claudekit.cc/
- semantic-release: https://github.com/semantic-release/semantic-release
- nodejs-cli-apps-best-practices: https://github.com/lirantal/nodejs-cli-apps-best-practices
- awesome-claude-code: https://github.com/hesreallyhim/awesome-claude-code

---

**Next Steps:**
1. User answers clarification questions (Questions 1-12)
2. Run `/ideate-to-spec` to transform this ideation into validated specification
3. Begin Phase 1 implementation (MVP Pure Installer Package)

---

## CHANGELOG

**2025-11-21 (Re-evaluation based on ClaudeKit analysis):**
- Added ClaudeKit distribution analysis and technical details
- Added comprehensive multi-PM interoperability research (Session 2)
- **Key Decision**: Skip pip/PyPI distribution entirely (wrong audience, unnecessary complexity)
- **Key Insight**: Publishing to npm automatically supports npm/yarn/pnpm (ZERO additional config)
- Updated clarification questions (now 12 total, added Q3 on multi-PM documentation, Q8 on cross-PM testing)
- Added section 10: Key Takeaways with ClaudeKit-informed recommendations
- Updated references with Session 2 research document and official PM documentation
- Renumbered sections 4-7 due to new "Multi-Package Manager Support" section
- Updated out-of-scope to explicitly exclude pip/PyPI distribution
