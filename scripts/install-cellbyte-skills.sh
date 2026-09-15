#!/usr/bin/env bash
set -euo pipefail

# Install this fork as symlinks so a pull updates every harness at once.
# Promoted engineering and productivity skills are shared by Claude Code,
# Codex, and Pi. Pi also receives the structured question tool it needs for
# grilling.

REPO="$(cd "$(dirname "$0")/.." && pwd)"
SKILL_DESTS=(
  "$HOME/.claude/skills"
  "$HOME/.agents/skills"
  "$HOME/.codex/skills"
)
PI_EXTENSION_DEST="$HOME/.pi/agent/extensions"
PI_QUESTION_TARGET="$PI_EXTENSION_DEST/cellbyte-question.ts"

names=()
srcs=()
while IFS= read -r -d '' skill_md; do
  src="$(dirname "$skill_md")"
  names+=("$(basename "$src")")
  srcs+=("$src")
done < <(
  find "$REPO/skills/engineering" "$REPO/skills/productivity" -name SKILL.md -not -path '*/node_modules/*' -print0
)

# Fail before changing anything when a user-owned directory would be replaced.
for dest in "${SKILL_DESTS[@]}"; do
  for name in "${names[@]}"; do
    target="$dest/$name"
    if [ -e "$target" ] && [ ! -L "$target" ]; then
      echo "error: $target exists and is not a symlink; move or back it up first." >&2
      exit 1
    fi
  done
done

if [ -e "$PI_QUESTION_TARGET" ] && [ ! -L "$PI_QUESTION_TARGET" ]; then
  echo "error: $PI_QUESTION_TARGET exists and is not a symlink; move or back it up first." >&2
  exit 1
fi

for dest in "${SKILL_DESTS[@]}"; do
  mkdir -p "$dest"
  for i in "${!names[@]}"; do
    ln -sfn "${srcs[$i]}" "$dest/${names[$i]}"
    echo "linked ${names[$i]} -> ${srcs[$i]} ($dest)"
  done
done

mkdir -p "$PI_EXTENSION_DEST"
ln -sfn "$REPO/extensions/question.ts" "$PI_QUESTION_TARGET"
echo "linked Pi question tool -> $REPO/extensions/question.ts"
