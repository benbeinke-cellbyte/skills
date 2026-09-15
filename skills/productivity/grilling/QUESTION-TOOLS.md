# Structured Q&A tools

Every grilling decision is delivered through the current harness's native
structured question tool. The tool schema is the source of truth for field
names, option counts, and batching limits.

## Tool resolution

Use the first available tool that matches this table:

| Harness | Tool | Availability notes |
| --- | --- | --- |
| Claude Code | `AskUserQuestion` | Native interactive Q&A tool |
| Codex | `request_user_input` | Available only in modes that expose structured user input |
| Pi | `question` | Supplied by this fork's `extensions/question.ts` |
| Another harness | Its native structured question or user-input tool | Use only if its description explicitly says it asks the user |

Do not simulate a tool by writing numbered questions in a normal assistant
message. If no matching tool is available, stop the grilling session and tell
the user which capability is missing. For Codex, suggest switching to a mode
that exposes `request_user_input`. For Pi, suggest installing or reloading this
fork's `question` extension.

## Question shape

- Put the recommended option first and append `(Recommended)` to its label.
- Give each option a short label and a one-sentence impact or trade-off.
- Use mutually exclusive options. Respect the tool's minimum and maximum option
  counts.
- Preserve a free-form escape hatch. Use the tool's native `Other` behavior
  when it has one; do not duplicate it as another option.
- Keep prerequisite-dependent questions out of the same batch.
- If the frontier exceeds the tool's per-call question limit, send the
  independent questions in consecutive tool calls and then recompute the
  frontier from all answers.

Use dedicated approval or permission mechanisms for privileged actions. The Q&A
tool is for product and design decisions, not a substitute for an approval
prompt.
