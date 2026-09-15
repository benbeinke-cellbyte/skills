## What it does

`implement` builds work that has already been decided. You point it at one [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket), a dependency-linked ticket set, or a small [spec](https://www.aihero.dev/ai-coding-dictionary/spec). The parent agent schedules the work and dispatches exactly one fresh implementation-owner [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent) per ticket.

It never reopens the plan, and the parent does not quietly become an implementation owner. Owners drive [tdd](https://aihero.dev/skills-tdd), commit and review one ticket each; the parent chooses their models, integrates those commits in dependency order and verifies the combined result.

## When to reach for it

You invoke this by typing `/implement` yourself: the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) will not reach for it on its own. Pass one full ticket reference, a set of ticket references, or one small spec.

Where the work currently lives decides whether this is the right skill:

| The work is… | Reach for |
| --- | --- |
| One ticket on the tracker | `/implement <full-ticket-reference>`; one fresh owner is dispatched |
| A dependency-linked ticket set | `/implement <ticket-set>`; the parent schedules the frontier and assigns one fresh owner per ticket |
| An unsliced spec with several testable slices | [to-tickets](https://aihero.dev/skills-to-tickets) first, then `/implement` the resulting set |
| A genuinely small spec | `/implement` directly; the whole spec is one implementation unit with one owner |
| Not written down anywhere yet | [grill-with-docs](https://aihero.dev/skills-grill-with-docs), or [grill-me](https://aihero.dev/skills-grill-me) if there's no codebase |
| One concrete behaviour you want test-first, with no spec | [tdd](https://aihero.dev/skills-tdd) directly |
| Already built, and you want it checked | [code-review](https://aihero.dev/skills-code-review) directly |

Use full issue identifiers or URLs. A bare `#2` is ambiguous outside a repository-qualified tracker context.

## Prerequisites

`implement` needs a harness that can create fresh subagents and isolate their writes with worktrees or an equivalent mechanism. If either capability is missing, the skill stops before code changes and asks before using a weaker fallback.

Tickets must name their repository, target base, blockers, acceptance criteria and verification. The tracker and domain layout come from [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) and repository instructions.

## What one run does

A run is an orchestration loop:

1. Read the complete work and build its blocker graph.
2. Choose an available model and reasoning effort for each ready ticket.
3. Dispatch exactly one fresh implementation owner per ticket, with isolated writes.
4. Each owner drives [tdd](https://aihero.dev/skills-tdd), runs focused checks, commits, and runs [code-review](https://aihero.dev/skills-code-review) against its fixed point.
5. Inspect and integrate successful commits in dependency order, then recompute the ready frontier.
6. Run the combined full suite once from the final revision.

Independent tickets may run in parallel only with disjoint write scopes. Dependent or overlapping tickets run sequentially. A research or review subagent never counts as the ticket's implementation owner.

## Pre-agreed seams

The idea the skill runs on is the **seam**: the public boundary you observe behaviour at, without reaching inside. Tests live at seams. Working at a seam agreed before any code is written is what keeps the tests durable, because the implementation underneath can be rewritten without the tests moving.

The word "pre-agreed" is doing real work, and it is also the skill's weakest joint. Nothing inside `implement` agrees the seams. `tdd` is the skill that asks, and it refuses to write a test at an unconfirmed seam. So in practice the agreement happens either upstream in the spec, or in the first exchange of the run. If it happens nowhere, the precondition never fires and the run quietly becomes "just write the code". Naming the seams in the spec is what stops that.

## Common questions

**It finished, but my ticket is still open and the acceptance criteria are still unchecked.**

The parent updates a work item only when repository tracker instructions authorize it. Otherwise it reports the commit and acceptance evidence without silently changing external state.

**Can I point it at all my tickets at once, or run several in parallel?**

Yes. That is the fork's main change. The parent computes the dependency frontier and assigns exactly one fresh implementation owner per ticket. It parallelizes only independent tickets whose writes are isolated; it never runs multiple owners in one checkout.

**Can it open a pull request instead of committing?**

Only when the user or repository workflow asks for one. Owner commits are the integration unit; publishing a branch or pull request remains a separate external action.

**`code-review` says it cannot see my changes.**

Each owner commits before calling `code-review`, then reviews against the exact pre-ticket fixed point. Review subagents are separate from the implementation owner, so their context is independent.

**One ticket burned 150k tokens. Am I using it wrong?**

Probably the ticket is too big rather than the skill being misused. A run does codebase exploration, a red-green loop per seam, a full suite, and a review, so a non-trivial ticket exceeding 100k [tokens](https://www.aihero.dev/ai-coding-dictionary/token) is normal rather than a sign something broke. The lever is upstream: right-size the tickets in [to-tickets](https://aihero.dev/skills-to-tickets) so each fits one fresh window. If a single ticket keeps blowing out, split it rather than raising the [effort](https://www.aihero.dev/ai-coding-dictionary/effort) level.

**`/implement #2` in a fresh session worked on something completely unrelated.**

`#2` is resolved against whatever numbered list the agent can see, which in a fresh session may be a todo file, a checklist, or another work list rather than the configured tracker. The resolution is confident rather than fail-closed, so the mistake is not obvious until it has started. Pass the full reference, the issue URL or `owner/repo#2`, and ask it to confirm the title back before it begins.

## It's working if

- The parent shows a blocker graph and dispatches only its ready frontier.
- Every ticket maps to one fresh owner, one isolated write scope, and one commit.
- The parent records the effective model and reasoning setting per ticket.
- Owners show actual `tdd` and `code-review` invocations, not just similar prose.
- The parent inspects owner diffs and runs the combined suite once after integration.

## Where it fits

`implement` is the orchestrated build step of the main chain:

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review
```

Its neighbours are [to-tickets](https://aihero.dev/skills-to-tickets), which produces the blocker graph it schedules; [tdd](https://aihero.dev/skills-tdd), which each owner drives; and [code-review](https://aihero.dev/skills-code-review), which reviews each committed ticket against a fixed point. It sits downstream of planning and refuses to guess when a ticket is materially incomplete.

That trust is why [wayfinder](https://aihero.dev/skills-wayfinder) merges onto the chain at [to-spec](https://aihero.dev/skills-to-spec) rather than looping its map straight into `implement`. Go straight to `implement` from a map only when the effort turned out genuinely small.

[ask-matt](https://aihero.dev/skills-ask-matt) is the router over the whole set when you are not sure which flow you are in.
