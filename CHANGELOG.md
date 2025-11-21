# Changelog

## [1.1.0] - 2025-11-21

### Added

- **Feature-Based Directory Structure** - All specification documents now organized in `specs/<slug>/` directories
  - `01-ideation.md` - Created by `/ideate`
  - `02-specification.md` - Created by `/ideate-to-spec`
  - `03-tasks.md` - Created by `/spec:decompose`
  - `04-implementation.md` - Created by `/spec:execute`
- **STM Task Tagging** - All tasks tagged with `feature:<slug>` for easy filtering
- **Session Continuity** - `/spec:execute` now reads previous progress from implementation summary
- **Migration Command** - `/spec:migrate` to convert existing specs to new structure
- **Command Overrides:**
  - `/spec:create` - Detects output path from prompt
  - `/spec:decompose` - Extracts slug and tags STM tasks
  - `/spec:execute` - Creates/updates implementation summary with session history

### Changed

- **Replaced `/spec:progress`** - Now use `stm list --pretty --tag feature:<slug>` instead
- **Updated `/ideate`** - Creates specs in `specs/<slug>/01-ideation.md` (was `docs/ideation/<slug>.md`)
- **Updated `/ideate-to-spec`** - Extracts slug and passes explicit paths
- **Updated README.md** - New document organization section and updated workflow examples
- **Workflow Commands Count** - Reduced from 4 to 3 custom commands (removed `/spec:progress`)

### Benefits

- All feature documents in one directory
- Clear lifecycle progression with numbered prefixes
- Easy filtering of STM tasks by feature
- Session continuity for multi-run implementations
- Backward compatible with legacy paths

## [1.0.0] - 2025-11-12

### Initial Release

**What's Included:**

- **4 Custom Workflow Commands:**
  - `/ideate` - Structured ideation workflow with comprehensive documentation
  - `/ideate-to-spec` - Transform ideation documents into validated specifications
  - `/spec:progress` - Track implementation progress and update task breakdowns
  - `/spec:doc-update` - Parallel documentation review based on spec files

- **ClaudeKit Integration:**
  - npm-based installation (no git submodules)
  - Layers custom commands on top of ClaudeKit's 30+ agents, 20+ commands, and 25+ hooks
  - Example settings.json with ClaudeKit hooks configuration

- **Templates & Configuration:**
  - Project-level configuration templates
  - User-level configuration templates
  - Example .gitignore patterns
  - CLAUDE.md templates

- **Documentation:**
  - Comprehensive README with installation and usage instructions
  - Detailed SETUP_GUIDE.md
  - Research documentation validating the hybrid approach

- **Installation Script:**
  - Automated `install.sh` for project and user-level installation
  - Prerequisite checking
  - ClaudeKit integration

### Design Decisions

- **No Example Agents:** Relies on ClaudeKit's comprehensive agent library rather than including redundant examples
- **Workflow Focus:** Custom commands focus on workflow orchestration (ideation → specification → documentation)
- **npm Over Submodules:** Uses ClaudeKit via npm for simpler installation and updates
- **Layered Architecture:** Three-layer approach (Claude Code → ClaudeKit → Custom Commands)

### Breaking Changes

None - this is the initial release.

---

**Repository:** https://github.com/kennethpriester/claude-config
**License:** MIT
