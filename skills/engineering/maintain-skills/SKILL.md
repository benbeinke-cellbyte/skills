---
name: maintain-skills
description: Maintain, add, validate, publish, or reinstall Cellbyte's shared agent skills across Codex, Claude Code, and Pi.
---

# Maintain shared skills

The canonical checkout is `/mnt/data/tools/mattpocock-skills`, from
`https://github.com/benbeinke-cellbyte/skills`. All harness installations are
symlinks into this checkout, so edit the canonical files instead of copies in a
harness directory.

## Shared layout

- Put shared skills in `skills/engineering/<name>/SKILL.md` or
  `skills/productivity/<name>/SKILL.md`.
- The installer promotes both directories to `~/.codex/skills`,
  `~/.claude/skills`, and `~/.agents/skills`.
- Pi's structured Q&A tool lives at `extensions/question.ts` and is linked to
  `~/.pi/agent/extensions/cellbyte-question.ts`.

## Workflow

1. Inspect `git status` in the canonical checkout and preserve unrelated work.
2. Edit an existing skill in place. For a new skill, use a lowercase hyphenated
   directory name and include a concise `name` and discriminating `description`
   in `SKILL.md` frontmatter.
3. Keep instructions harness-neutral. Put harness-specific behavior behind a
   capability mapping, as `skills/productivity/grilling/QUESTION-TOOLS.md` does.
4. Validate every changed skill:

   ```bash
   python3 /home/azureuser/.codex/skills/.system/skill-creator/scripts/quick_validate.py \
     /mnt/data/tools/mattpocock-skills/skills/<group>/<skill>
   git -C /mnt/data/tools/mattpocock-skills diff --check
   bash -n /mnt/data/tools/mattpocock-skills/scripts/install-cellbyte-skills.sh
   ```

5. Existing skills become live immediately through their symlinks. After adding
   a skill or repairing links, run:

   ```bash
   /mnt/data/tools/mattpocock-skills/scripts/install-cellbyte-skills.sh
   ```

6. When publication is part of the request, commit and push from the canonical checkout:

   ```bash
   git -C /mnt/data/tools/mattpocock-skills add -A
   git -C /mnt/data/tools/mattpocock-skills commit -m "Update <skill-name>"
   git -C /mnt/data/tools/mattpocock-skills push origin main
   ```

   Other machines must pull this checkout and run the installer once for newly
   added skills. Existing linked skills update as soon as the pull completes.

7. Tell the user that new sessions see the change automatically. Existing
   Claude Code and Pi sessions may need `/reload` or a restart; existing Codex
   tasks may need a new task.

## Completion criteria

The changed skill validates, the checkout has only intended changes, all three
harness paths resolve to the canonical skill directory, and requested commits
are present on the fork's `main` branch.
