#!/usr/bin/env node

/**
 * Claude Code Status Line - Last Command Detector
 *
 * Receives Claude Code session data via stdin and displays:
 * - Last user command/prompt
 * - Current model name
 * - Git branch (if available)
 *
 * Usage: Configure in Claude Code settings:
 * {
 *   "statusLine": {
 *     "type": "command",
 *     "command": "/path/to/statusline.js"
 *   }
 * }
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Configuration
const MAX_COMMAND_LENGTH = 60;
const TRANSCRIPT_TAIL_LINES = 200;
const CACHE_DIR = "/tmp";
const FALLBACK_CACHE = "/tmp/statusline-last-command.txt";

/**
 * Generate session-specific cache path from transcript path
 */
function getCachePath(transcriptPath) {
  if (!transcriptPath) {
    return FALLBACK_CACHE;
  }

  try {
    // Extract session identifier from transcript path
    // e.g., /path/to/session-abc123.jsonl -> session-abc123
    const sessionId = path.basename(transcriptPath, ".jsonl");
    return path.join(CACHE_DIR, `statusline-${sessionId}.txt`);
  } catch (err) {
    return FALLBACK_CACHE;
  }
}

/**
 * Read cached last command for this session
 */
function getCachedCommand(transcriptPath) {
  try {
    const cachePath = getCachePath(transcriptPath);
    if (fs.existsSync(cachePath)) {
      return fs.readFileSync(cachePath, "utf8").trim() || null;
    }
  } catch (err) {
    // Ignore cache read errors
  }
  return null;
}

/**
 * Write command to session-specific cache
 */
function setCachedCommand(command, transcriptPath) {
  try {
    const cachePath = getCachePath(transcriptPath);
    fs.writeFileSync(cachePath, command, "utf8");
  } catch (err) {
    // Ignore cache write errors
  }
}

/**
 * Read and parse stdin
 */
async function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => {
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        resolve({});
      }
    });
  });
}

/**
 * Get current git branch
 */
function getGitBranch() {
  try {
    return execSync("git branch --show-current 2>/dev/null", {
      encoding: "utf8",
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Extract last slash command from transcript
 */
function getLastCommand(transcriptPath) {
  try {
    if (!transcriptPath || !fs.existsSync(transcriptPath)) {
      return null;
    }

    // Read last N lines of transcript
    const content = fs.readFileSync(transcriptPath, "utf8");
    const lines = content.split("\n").slice(-TRANSCRIPT_TAIL_LINES);

    // Find the last actual slash command (must start with /)
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (!line) continue;

      // Look for user messages in transcript format
      if (line.includes('"role":"user"') || line.includes('"role": "user"')) {
        try {
          const parsed = JSON.parse(line);
          const content = parsed.message?.content || parsed.content;

          if (content && typeof content === "string") {
            // Check for command in XML-like tags
            const commandMatch = content.match(
              /<command-name>(\/[^<]+)<\/command-name>/
            );
            const argsMatch = content.match(
              /<command-args>([^<]*)<\/command-args>/
            );

            if (commandMatch) {
              let cmd = commandMatch[1];
              if (argsMatch && argsMatch[1]) {
                cmd += " " + argsMatch[1];
              }
              cmd = cmd.trim();

              if (cmd.length > MAX_COMMAND_LENGTH) {
                cmd = cmd.substring(0, MAX_COMMAND_LENGTH) + "…";
              }
              setCachedCommand(cmd, transcriptPath);
              return cmd;
            }

            // Fallback: check if content directly starts with /
            let cmd = content.replace(/\n/g, " ").replace(/\s+/g, " ").trim();

            if (cmd.startsWith("/")) {
              if (cmd.length > MAX_COMMAND_LENGTH) {
                cmd = cmd.substring(0, MAX_COMMAND_LENGTH) + "…";
              }
              setCachedCommand(cmd, transcriptPath);
              return cmd;
            }
          }
        } catch (parseErr) {
          continue;
        }
      }

      // Also check for slash commands in plain text
      if (line.startsWith("/")) {
        let cmd = line.split("\n")[0].trim();
        if (cmd.length > MAX_COMMAND_LENGTH) {
          cmd = cmd.substring(0, MAX_COMMAND_LENGTH) + "…";
        }
        setCachedCommand(cmd, transcriptPath);
        return cmd;
      }
    }

    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Format status line output
 */
function formatStatusLine(data) {
  const model = data?.model?.display_name || "Claude";
  const branch = getGitBranch();
  const transcriptPath = data?.transcript_path || data?.transcriptPath;
  let lastCommand = getLastCommand(transcriptPath);

  // Fallback to cached command if no new command found
  if (!lastCommand) {
    lastCommand = getCachedCommand(transcriptPath);
  }

  // Build status line
  const parts = [];

  if (lastCommand) {
    // Map specific commands to icons
    const commandIcons = {
      "/ideate": "💡",
      "/ideate-to-spec": "📝",
      "/spec:decompose": "🔨",
      "/spec:execute": "⚙️",
      "/spec:feedback": "💬",
      "/spec:doc-update": "📚",
    };

    // Extract just the command name (without args)
    const commandName = lastCommand.split(" ")[0];
    const icon = commandIcons[commandName] || "❓";
    parts.push(`Claudeflow: ${icon} ${lastCommand}`);
  } else {
    parts.push(`Claudeflow: ✓ Ready to start`);
  }

  return parts.join(" | ");
}

/**
 * Main execution
 */
async function main() {
  try {
    const data = await readStdin();
    const output = formatStatusLine(data);
    console.log(output);
  } catch (err) {
    // Fallback on error
    console.log("✓ Claude Code");
  }
}

main();
